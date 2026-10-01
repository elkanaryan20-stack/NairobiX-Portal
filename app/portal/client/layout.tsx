import { requireRelationship } from '@/lib/access/server';

/**
 * Client context inside the unified Portal — not a separate portal. Requires
 * a server-resolved Client Relationship; module-level permissions are
 * enforced per request by middleware.ts.
 */
export default async function ClientContextLayout({ children }: { children: React.ReactNode }) {
  await requireRelationship('client');
  return <>{children}</>;
}
