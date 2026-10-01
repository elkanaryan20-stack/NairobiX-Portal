/**
 * Portal module registry — the single source of truth that maps every
 * protected Portal route to the permission that opens it.
 *
 * The same registry drives both the sidebar (lib/access/navigation.ts) and
 * route enforcement (requireModule in lib/access/server.ts, called by every
 * module page), so a module can never appear in the navigation without also
 * being enforced on the server, or vice versa.
 *
 * Kept free of React imports.
 */

import type { Permission } from './permissions';
import type { RelationshipType } from './types';

/** Icon keys are resolved to lucide icons on the client (components/layout/PortalLayout.tsx). */
export type ModuleIcon =
  | 'overview'
  | 'growth'
  | 'work'
  | 'insights'
  | 'billing'
  | 'support'
  | 'resources'
  | 'onboarding'
  | 'referrals'
  | 'opportunities'
  | 'tasks'
  | 'earnings'
  | 'pipeline'
  | 'accounts'
  | 'delivery'
  | 'reports'
  | 'notifications'
  | 'settings';

export interface PortalModule {
  permission: Permission;
  relationship: RelationshipType;
  label: string;
  href: string;
  icon: ModuleIcon;
  /** Reachable from the sidebar. Notifications and Settings live in the header / user menu instead. */
  inNavigation: boolean;
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  client: 'Client',
  participant: 'Opportunity Network',
  staff: 'Staff',
};

export const PORTAL_ROOT = '/portal';
/** Where an authorized user is sent when they open a module outside their permissions. */
export const PORTAL_RESTRICTED_PATH = '/portal/restricted';

export const PORTAL_MODULES: readonly PortalModule[] = [
  // Client Relationship
  { permission: 'client.overview', relationship: 'client', label: 'Overview', href: '/portal/client', icon: 'overview', inNavigation: true },
  { permission: 'client.growth', relationship: 'client', label: 'Growth', href: '/portal/client/growth', icon: 'growth', inNavigation: true },
  { permission: 'client.work', relationship: 'client', label: 'Work', href: '/portal/client/work', icon: 'work', inNavigation: true },
  { permission: 'client.insights', relationship: 'client', label: 'Insights', href: '/portal/client/insights', icon: 'insights', inNavigation: true },
  { permission: 'client.billing', relationship: 'client', label: 'Billing', href: '/portal/client/billing', icon: 'billing', inNavigation: true },
  { permission: 'client.support', relationship: 'client', label: 'Support', href: '/portal/client/support', icon: 'support', inNavigation: true },
  { permission: 'client.resources', relationship: 'client', label: 'Resources', href: '/portal/client/resources', icon: 'resources', inNavigation: true },
  { permission: 'client.notifications', relationship: 'client', label: 'Notifications', href: '/portal/client/notifications', icon: 'notifications', inNavigation: false },
  { permission: 'client.settings', relationship: 'client', label: 'Settings', href: '/portal/client/settings', icon: 'settings', inNavigation: false },

  // Opportunity Network Participant Relationship
  { permission: 'participant.overview', relationship: 'participant', label: 'Overview', href: '/portal/participant', icon: 'overview', inNavigation: true },
  { permission: 'participant.onboarding', relationship: 'participant', label: 'Onboarding', href: '/portal/participant/onboarding', icon: 'onboarding', inNavigation: true },
  { permission: 'participant.referrals', relationship: 'participant', label: 'Referrals', href: '/portal/participant/referrals', icon: 'referrals', inNavigation: true },
  { permission: 'participant.opportunities', relationship: 'participant', label: 'Opportunities', href: '/portal/participant/opportunities', icon: 'opportunities', inNavigation: true },
  { permission: 'participant.work', relationship: 'participant', label: 'Work', href: '/portal/participant/work', icon: 'tasks', inNavigation: true },
  { permission: 'participant.earnings', relationship: 'participant', label: 'Earnings', href: '/portal/participant/earnings', icon: 'earnings', inNavigation: true },
  { permission: 'participant.resources', relationship: 'participant', label: 'Resources', href: '/portal/participant/resources', icon: 'resources', inNavigation: true },
  { permission: 'participant.notifications', relationship: 'participant', label: 'Notifications', href: '/portal/participant/notifications', icon: 'notifications', inNavigation: false },
  { permission: 'participant.settings', relationship: 'participant', label: 'Settings', href: '/portal/participant/settings', icon: 'settings', inNavigation: false },

  // Staff Relationship
  { permission: 'staff.overview', relationship: 'staff', label: 'Overview', href: '/portal/staff', icon: 'overview', inNavigation: true },
  { permission: 'staff.pipeline', relationship: 'staff', label: 'Pipeline', href: '/portal/staff/pipeline', icon: 'pipeline', inNavigation: true },
  { permission: 'staff.accounts', relationship: 'staff', label: 'Accounts', href: '/portal/staff/accounts', icon: 'accounts', inNavigation: true },
  { permission: 'staff.delivery', relationship: 'staff', label: 'Delivery', href: '/portal/staff/delivery', icon: 'delivery', inNavigation: true },
  { permission: 'staff.support', relationship: 'staff', label: 'Support', href: '/portal/staff/support', icon: 'support', inNavigation: true },
  { permission: 'staff.billing', relationship: 'staff', label: 'Billing', href: '/portal/staff/billing', icon: 'billing', inNavigation: true },
  { permission: 'staff.reports', relationship: 'staff', label: 'Reports', href: '/portal/staff/reports', icon: 'reports', inNavigation: true },
  { permission: 'staff.settings', relationship: 'staff', label: 'Settings', href: '/portal/staff/settings', icon: 'settings', inNavigation: false },
];

/**
 * The module that owns a pathname (longest matching href wins), or undefined
 * for Portal-level paths such as /portal itself.
 */
export function moduleForPath(pathname: string): PortalModule | undefined {
  let match: PortalModule | undefined;
  for (const portalModule of PORTAL_MODULES) {
    if (pathname === portalModule.href || pathname.startsWith(portalModule.href + '/')) {
      if (!match || portalModule.href.length > match.href.length) match = portalModule;
    }
  }
  return match;
}

/** Relationship context a pathname belongs to, e.g. /portal/participant/work → 'participant'. */
export function relationshipForPath(pathname: string): RelationshipType | undefined {
  const segment = pathname.split('/')[2];
  return segment === 'client' || segment === 'participant' || segment === 'staff' ? segment : undefined;
}

/**
 * Where /portal sends an authorized user: the first navigable module of
 * their first Relationship they hold a permission for.
 */
export function defaultModulePath(principal: {
  relationships: { type: RelationshipType }[];
  permissions: Permission[];
}): string | undefined {
  for (const relationship of principal.relationships) {
    const first = PORTAL_MODULES.find(
      (m) => m.relationship === relationship.type && m.inNavigation && principal.permissions.includes(m.permission)
    );
    if (first) return first.href;
  }
  return undefined;
}
