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
  // Partner Relationship
  'partner.overview',
  'partner.onboarding',
  'partner.referrals',
  'partner.opportunities',
  'partner.work',
  'partner.earnings',
  'partner.resources',
  'partner.notifications',
  'partner.settings',
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
  'partner-contact': PERMISSIONS.filter((p) => p.startsWith('partner.')),
  'staff-member': PERMISSIONS.filter((p) => p.startsWith('staff.')),
};

/**
 * Partner permissions depend on both approval and capability.
 *
 * Eligibility ≠ Approval: a partner still onboarding holds capabilities from
 * their type preset, but none of the capability-gated modules open until the
 * partner is approved (status `active`). Onboarding itself closes once active,
 * matching the existing Partner navigation behaviour.
 */
function isPartnerPermissionGranted(permission: Permission, relationship: Relationship): boolean {
  const caps = relationship.partnerCapabilities;
  const approved = relationship.status === 'active';

  switch (permission) {
    case 'partner.onboarding':
      return !approved;
    case 'partner.referrals':
      return approved && !!caps?.referrals;
    case 'partner.opportunities':
      return approved && !!caps?.opportunities;
    case 'partner.work':
      return approved && !!(caps?.projects || caps?.tasks || caps?.consultations || caps?.deliverables);
    case 'partner.earnings':
      return approved && !!caps?.commissions;
    default:
      return true;
  }
}

export function permissionsForRelationship(relationship: Relationship): Permission[] {
  if (relationship.status === 'inactive') return [];

  return ROLE_PERMISSIONS[relationship.role].filter((permission) =>
    relationship.type === 'partner' ? isPartnerPermissionGranted(permission, relationship) : true
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
