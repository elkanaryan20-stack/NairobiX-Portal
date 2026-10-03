import { createHash } from 'node:crypto';
import type { PortalPrincipal } from '@/lib/access/types';
import { criteriaValue, searchRecords } from '@/lib/crm/zoho/client';
import type { ZohoRecord } from '@/lib/crm/zoho/schema';

const TYPE_VALUES = {
  'growth-initiative': 'Growth Initiative',
  'system-request': 'System Request',
  'website-request': 'Website Request',
  'reporting-question': 'Reporting Question',
  'strategy-session': 'Strategy Session',
} as const;
const PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Urgent'] as const;
const WINDOW_MS = 15 * 60 * 1000;
const DUPLICATE_MS = 10 * 60 * 1000;
const MAX_CASES_PER_WINDOW = 5;

export interface CaseSubmissionInput {
  type: keyof typeof TYPE_VALUES;
  subject: string;
  description: string;
  priority: (typeof PRIORITY_VALUES)[number];
  dealId?: string;
}

export class CaseSubmissionError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

const attempts = new Map<string, number[]>();
const inFlight = new Map<string, Promise<ZohoRecord>>();
const recentSubmissions = new Map<string, { expiresAt: number; record: ZohoRecord }>();

function cleanMaps(now: number) {
  for (const [key, timestamps] of attempts) {
    const recent = timestamps.filter((time) => now - time < WINDOW_MS);
    if (recent.length) attempts.set(key, recent);
    else attempts.delete(key);
  }
  for (const [key, value] of recentSubmissions) if (value.expiresAt <= now) recentSubmissions.delete(key);
}

function fingerprint(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function parseCaseSubmission(value: unknown): CaseSubmissionInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CaseSubmissionError(400, 'Check the request details and try again.');
  const input = value as Record<string, unknown>;
  const allowedKeys = ['type', 'subject', 'description', 'priority', 'dealId'];
  if (Object.keys(input).some((key) => !allowedKeys.includes(key))) throw new CaseSubmissionError(400, 'The request contains unsupported fields.');
  if (typeof input.type !== 'string' || !Object.prototype.hasOwnProperty.call(TYPE_VALUES, input.type)) throw new CaseSubmissionError(400, 'Choose a valid request type.');
  if (typeof input.priority !== 'string' || !PRIORITY_VALUES.includes(input.priority as (typeof PRIORITY_VALUES)[number])) {
    throw new CaseSubmissionError(400, 'Choose a valid priority.');
  }
  if (typeof input.subject !== 'string' || !input.subject.trim() || input.subject.trim().length > 255 || /[\u0000-\u001f\u007f]/.test(input.subject)) {
    throw new CaseSubmissionError(400, 'Enter a subject of 1 to 255 characters.');
  }
  if (typeof input.description !== 'string' || !input.description.trim() || input.description.trim().length > 30000) {
    throw new CaseSubmissionError(400, 'Enter a description of 1 to 30,000 characters.');
  }
  if (input.dealId !== undefined && (typeof input.dealId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(input.dealId))) {
    throw new CaseSubmissionError(400, 'The selected engagement is invalid.');
  }
  return {
    type: input.type as CaseSubmissionInput['type'],
    subject: input.subject.trim(),
    description: input.description.trim(),
    priority: input.priority as CaseSubmissionInput['priority'],
    ...(typeof input.dealId === 'string' ? { dealId: input.dealId } : {}),
  };
}

function caseKey(principal: PortalPrincipal, input: CaseSubmissionInput): string {
  return fingerprint({ accountId: principal.relationships.find((r) => r.type === 'client')?.accountId, contactId: principal.contactId, input });
}

async function matchingRecentCase(principal: PortalPrincipal, input: CaseSubmissionInput): Promise<ZohoRecord | undefined> {
  const client = principal.relationships.find((relationship) => relationship.type === 'client');
  if (!client?.accountId || !principal.contactId) throw new CaseSubmissionError(403, 'Client access could not be confirmed.');
  const criteria = `((Account_Name:equals:${criteriaValue(client.accountId)})and(Subject:equals:${criteriaValue(input.subject)}))`;
  const records = await searchRecords('cases', criteria);
  const cutoff = Date.now() - DUPLICATE_MS;
  return records.find((record) => {
    const created = typeof record.Created_Time === 'string' ? Date.parse(record.Created_Time) : NaN;
    return (
      Number.isFinite(created) && created >= cutoff &&
      record.Email === principal.email && record.Description === input.description &&
      (record.Type === TYPE_VALUES[input.type]) && record.Priority === input.priority
    );
  });
}

/** In-process rate control plus CRM duplicate lookup; all failures reject the create. */
export async function guardAndDeduplicate(
  principal: PortalPrincipal,
  input: CaseSubmissionInput,
  create: () => Promise<ZohoRecord>
): Promise<{ record: ZohoRecord; duplicate: boolean }> {
  const client = principal.relationships.find((relationship) => relationship.type === 'client');
  if (!client?.accountId || !principal.contactId) throw new CaseSubmissionError(403, 'Client access could not be confirmed.');
  const now = Date.now();
  cleanMaps(now);
  const rateKey = fingerprint({ accountId: client.accountId, contactId: principal.contactId });
  const timestamps = attempts.get(rateKey) ?? [];
  if (timestamps.length >= MAX_CASES_PER_WINDOW) throw new CaseSubmissionError(429, 'Too many requests. Please try again later.');
  attempts.set(rateKey, [...timestamps, now]);

  const key = caseKey(principal, input);
  const recent = recentSubmissions.get(key);
  if (recent) return { record: recent.record, duplicate: true };
  const existing = await matchingRecentCase(principal, input);
  if (existing) {
    recentSubmissions.set(key, { expiresAt: now + DUPLICATE_MS, record: existing });
    return { record: existing, duplicate: true };
  }

  const pending = inFlight.get(key);
  if (pending) return { record: await pending, duplicate: true };
  const creation = create();
  inFlight.set(key, creation);
  try {
    const record = await creation;
    recentSubmissions.set(key, { expiresAt: Date.now() + DUPLICATE_MS, record });
    return { record, duplicate: false };
  } finally {
    inFlight.delete(key);
  }
}

export function zohoCaseFields(principal: PortalPrincipal, input: CaseSubmissionInput): Record<string, unknown> {
  const client = principal.relationships.find((relationship) => relationship.type === 'client');
  if (!client?.accountId || !principal.contactId) throw new CaseSubmissionError(403, 'Client access could not be confirmed.');
  const fields: Record<string, unknown> = {
    Subject: input.subject,
    Description: input.description,
    Type: TYPE_VALUES[input.type],
    Priority: input.priority,
    Account_Name: { id: client.accountId },
    Related_To: { id: principal.contactId },
    Email: principal.email,
    Reported_By: principal.name,
    Case_Origin: 'Portal',
    Status: 'New',
  };
  if (input.dealId) {
    if (!client.dealIds?.includes(input.dealId)) throw new CaseSubmissionError(403, 'That engagement is not available for this account.');
    fields.Deal_Name = { id: input.dealId };
  }
  return fields;
}
