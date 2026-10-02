import { unstable_cache } from 'next/cache';
import { cacheTtlSeconds } from '@/lib/cache-ttl';

/** Tag on every cached CRM read; the Zoho webhook clears it. */
export const CRM_DATA_TAG = 'crm';

/**
 * A CRM read shared across requests and server instances for a short time,
 * so Zoho isn't called on every page render. `scope` must identify whose
 * data this is (Account, Contact or staff-wide) — it is part of the cache
 * key, so one Account's records can never be served for another. Errors are
 * not cached.
 */
export function cachedCrmRead<T>(scope: string[], read: () => Promise<T>): Promise<T> {
  return unstable_cache(read, ['crm-read', ...scope], { revalidate: cacheTtlSeconds(), tags: [CRM_DATA_TAG] })();
}
