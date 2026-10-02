/** Seconds an authorization decision or CRM read is cached (NAIROBIX_AUTHZ_CACHE_TTL_SECONDS, 30–3600, default 300). */
export function cacheTtlSeconds(): number {
  const ttl = Number(process.env.NAIROBIX_AUTHZ_CACHE_TTL_SECONDS);
  return Number.isFinite(ttl) && ttl >= 30 && ttl <= 3600 ? ttl : 300;
}
