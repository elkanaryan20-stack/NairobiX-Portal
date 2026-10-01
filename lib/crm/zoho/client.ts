/**
 * Server-side Zoho CRM client. Read-only.
 *
 * Credentials come from server environment variables and never reach the
 * browser: nothing in this file is imported by a client component, and no
 * variable here is NEXT_PUBLIC_. Every failure — missing configuration,
 * network error, rate limit, unexpected response — throws CrmUnavailableError
 * so callers can fail closed.
 */

import { ZOHO_FIELDS, ZOHO_MODULES, type ZohoRecord, type ZohoUser } from './schema';

export class CrmUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CrmUnavailableError';
  }
}

export type ZohoModuleKey = keyof typeof ZOHO_MODULES;

const API_VERSION = 'v8';
const PAGE_SIZE = 200;
/** Upper bound on pages fetched per query (2,000 records). */
const MAX_PAGES = 10;
const REQUEST_TIMEOUT_MS = 10_000;

interface ZohoConfig {
  accountsUrl: string;
  apiDomain: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

function readConfig(): ZohoConfig {
  const config = {
    accountsUrl: process.env.ZOHO_ACCOUNTS_URL,
    apiDomain: process.env.ZOHO_API_DOMAIN,
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET,
    refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  };
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) throw new CrmUnavailableError(`Zoho CRM is not configured (missing ${missing.join(', ')}).`);
  return {
    accountsUrl: config.accountsUrl!.replace(/\/+$/, ''),
    apiDomain: config.apiDomain!.replace(/\/+$/, ''),
    clientId: config.clientId!,
    clientSecret: config.clientSecret!,
    refreshToken: config.refreshToken!,
  };
}

// Access tokens last an hour; cache per server instance and refresh early.
let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    throw new CrmUnavailableError(`Zoho request failed: ${(error as Error).message}`);
  }
}

async function getAccessToken(config: ZohoConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  if (pendingToken) return pendingToken;

  pendingToken = (async () => {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
    });
    const response = await fetchWithTimeout(`${config.accountsUrl}/oauth/v2/token?${params}`, { method: 'POST' });
    const body = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
    if (!response.ok || !body.access_token) {
      throw new CrmUnavailableError(`Zoho token refresh failed (${body.error ?? response.status}).`);
    }
    const lifetimeMs = (body.expires_in ?? 3600) * 1000;
    cachedToken = { value: body.access_token, expiresAt: Date.now() + lifetimeMs - 5 * 60 * 1000 };
    return body.access_token;
  })();

  try {
    return await pendingToken;
  } finally {
    pendingToken = null;
  }
}

async function zohoGet(path: string, params: Record<string, string> = {}): Promise<Record<string, unknown> | null> {
  const config = readConfig();
  const url = `${config.apiDomain}/crm/${API_VERSION}${path}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await getAccessToken(config);
    const response = await fetchWithTimeout(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });

    if (response.status === 204) return null;
    if (response.status === 401 && attempt === 0) {
      cachedToken = null; // token revoked or expired early — refresh once
      continue;
    }
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { code?: string };
      throw new CrmUnavailableError(`Zoho ${path} responded ${response.status} ${body.code ?? ''}`.trim());
    }
    return (await response.json()) as Record<string, unknown>;
  }
  throw new CrmUnavailableError(`Zoho ${path} rejected the access token.`);
}

async function paged<T>(path: string, key: string, params: Record<string, string>): Promise<T[]> {
  const records: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const body = await zohoGet(path, { ...params, page: String(page), per_page: String(PAGE_SIZE) });
    if (!body) break;
    const batch = body[key];
    if (!Array.isArray(batch)) throw new CrmUnavailableError(`Zoho ${path} returned an unexpected response.`);
    records.push(...(batch as T[]));
    const info = body.info as { more_records?: boolean } | undefined;
    if (!info?.more_records) break;
  }
  return records;
}

/** Escapes a value for use inside Zoho search criteria. */
export function criteriaValue(value: string): string {
  return value.replace(/[\\(),]/g, (char) => `\\${char}`);
}

/** Records matching a Zoho search criteria expression, e.g. `(Email:equals:x)`. */
export function searchRecords(module: ZohoModuleKey, criteria: string): Promise<ZohoRecord[]> {
  return paged<ZohoRecord>(`/${ZOHO_MODULES[module]}/search`, 'data', {
    criteria,
    fields: ZOHO_FIELDS[module].join(','),
  });
}

/** All records of a module (most recently modified first, up to the page limit). */
export function listRecords(module: ZohoModuleKey): Promise<ZohoRecord[]> {
  return paged<ZohoRecord>(`/${ZOHO_MODULES[module]}`, 'data', {
    fields: ZOHO_FIELDS[module].join(','),
    sort_by: 'Modified_Time',
    sort_order: 'desc',
  });
}

export async function getRecord(module: ZohoModuleKey, id: string): Promise<ZohoRecord | null> {
  const body = await zohoGet(`/${ZOHO_MODULES[module]}/${encodeURIComponent(id)}`, {
    fields: ZOHO_FIELDS[module].join(','),
  });
  const data = body?.data;
  return Array.isArray(data) && data.length ? (data[0] as ZohoRecord) : null;
}

export function listActiveUsers(): Promise<ZohoUser[]> {
  return paged<ZohoUser>('/users', 'users', { type: 'ActiveUsers' });
}
