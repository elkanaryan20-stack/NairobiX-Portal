import { requireRelationship } from '@/lib/access/server';

/**
 * Opportunity Network Participant context inside the unified Portal — not a
 * separate portal. Requires a server-resolved Participant Relationship;
 * module-level permissions are enforced by each module page.
 */
export default async function ParticipantContextLayout({ children }: { children: React.ReactNode }) {
  await requireRelationship('participant');
  return <>{children}</>;
}
