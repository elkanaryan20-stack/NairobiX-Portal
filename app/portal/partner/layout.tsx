import { requireRelationship } from '@/lib/access/server';

/**
 * Partner context inside the unified Portal — not a separate portal. Requires
 * a server-resolved Partner Relationship; module-level permissions are
 * enforced per request by middleware.ts.
 */
export default async function PartnerContextLayout({ children }: { children: React.ReactNode }) {
  await requireRelationship('partner');
  return <>{children}</>;
}
