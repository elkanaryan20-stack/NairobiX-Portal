/**
 * Where Portal data and authorization come from.
 *
 *   production build            → always NairobiX CRM (Zoho). Demo data is unreachable.
 *   development / test          → the local demo directory and demo records,
 *                                 unless NAIROBIX_CRM=zoho is set to develop
 *                                 against the real CRM.
 */
export function isDemoMode(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.NAIROBIX_CRM !== 'zoho';
}
