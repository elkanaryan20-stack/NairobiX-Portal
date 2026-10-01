import { requireRelationship } from '@/lib/access/server';

/**
 * Staff context inside the unified Portal — not a separate portal. Requires
 * a server-resolved Staff Relationship; module-level permissions are
 * enforced per request by middleware.ts.
 */
export default async function StaffContextLayout({ children }: { children: React.ReactNode }) {
  await requireRelationship('staff');
  return <>{children}</>;
}
