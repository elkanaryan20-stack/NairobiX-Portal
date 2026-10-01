/**
 * Permission catalogue and Relationship → Permission resolution.
 *
 * One permission per Portal module. Permissions are derived only from
 * server-resolved Relationships (lib/access/resolve.ts); they are never read
 * from the session cookie or the request.
 */

import type { Relationship, RelationshipRole } from './types';

export const PERMISSIONS = [
  // Client Relationship
  'client.overview',
  'client.growth',
  'client.work',
  'client.insights',
  'client.billing',
  'client.support',
  'client.resources',
  'client.notifications',
  'client.settings',
  // Opportunity Network Participant Relationship
  'participant.overview',
  'participant.onboarding',
  'participant.referrals',
  'participant.opportunities',
  'participant.work',
  'participant.earnings',
  'participant.resources',
  'participant.notifications',
  'participant.settings',
  // Staff Relationship
  'staff.overview',
  'staff.pipeline',
  'staff.accounts',
  'staff.delivery',
  'staff.support',
  'staff.billing',
  'staff.reports',
  'staff.settings',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Upper bound of what each Role may be granted. Relationship status and capabilities narrow it further. */
const ROLE_PERMISSIONS: Record<RelationshipRole, readonly Permission[]> = {
  'client-contact': PERMISSIONS.filter((p) => p.startsWith('client.')),
  participant: PERMISSIONS.filter((p) => p.startsWith('participant.')),
  'staff-member': PERMISSIONS.filter((p) => p.startsWith('staff.')),
};

/**
 * Participant permissions depend on both approval and capability.
 *
 * Referrals, Opportunities, Work and Earnings open only for an approved
 * (`active`) Participant holding the matching capability. No CRM field grants
 * capabilities yet — Participation Type is a relationship attribute, not an
 * entitlement — so CRM-resolved Participants receive Overview, Resources,
 * Notifications and Settings only. Onboarding applies to the demo directory's
 * onboarding Participants; CRM Participants are always `active`.
 */
function isParticipantPermissionGranted(permission: Permission, relationship: Relationship): boolean {
  const caps = relationship.capabilities;
  const approved = relationship.status === 'active';

  switch (permission) {
    case 'participant.onboarding':
      return !approved;
    case 'participant.referrals':
      return approved && !!caps?.referrals;
    case 'participant.opportunities':
      return approved && !!caps?.opportunities;
    case 'participant.work':
      return approved && !!(caps?.projects || caps?.tasks || caps?.consultations || caps?.deliverables);
    case 'participant.earnings':
      return approved && !!caps?.commissions;
    default:
      return true;
  }
}

export function permissionsForRelationship(relationship: Relationship): Permission[] {
  if (relationship.status === 'inactive') return [];

  return ROLE_PERMISSIONS[relationship.role].filter((permission) =>
    relationship.type === 'participant' ? isParticipantPermissionGranted(permission, relationship) : true
  );
}

export function permissionsForRelationships(relationships: Relationship[]): Permission[] {
  const granted = new Set<Permission>();
  for (const relationship of relationships) {
    for (const permission of permissionsForRelationship(relationship)) granted.add(permission);
  }
  // Stable catalogue order, independent of Relationship order.
  return PERMISSIONS.filter((p) => granted.has(p));
}
