/**
 * Canonical public origin of the NairobiX Portal. Used wherever an absolute
 * URL is needed (metadata, and later the identity provider's redirect URI).
 * Request-relative redirects (middleware, server actions) don't depend on it.
 */
export const PORTAL_ORIGIN = (process.env.NAIROBIX_PORTAL_ORIGIN ?? 'https://portal.nairobix.com').replace(/\/+$/, '');
