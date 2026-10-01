/**
 * Builds the Portal navigation from a principal's permissions:
 *
 *   Principal → Permissions → Modules → Navigation
 *
 * There is no fixed Client / Participant / Staff menu. A Contact with one
 * Relationship sees one ungrouped list; a Contact with several sees one
 * section per Relationship, all inside the same Portal.
 */

import { isDemoMode } from '@/lib/crm/mode';
import { mockClientServiceRequests, mockStaffNeedsAttention } from '@/lib/mock-data';
import { PORTAL_MODULES, RELATIONSHIP_LABELS, type ModuleIcon } from './modules';
import type { Permission } from './permissions';
import type { PortalPrincipal } from './types';

/** Serializable navigation item handed to the client shell. */
export interface PortalNavItem {
  label: string;
  href: string;
  icon: ModuleIcon;
  badge?: number;
  section?: string;
}

// Sidebar counts. Demo only: in production the shell never calls the CRM,
// so badges are omitted rather than computed from data the page hasn't loaded.
const DEMO_MODULE_BADGES: Partial<Record<Permission, () => number>> = {
  'client.support': () => mockClientServiceRequests.filter((r) => r.status !== 'resolved').length,
  'staff.pipeline': () =>
    mockStaffNeedsAttention.filter((a) => a.type === 'partner' || a.type === 'referral').length,
};

export function buildNavigation(principal: PortalPrincipal): PortalNavItem[] {
  const multiple = principal.relationships.length > 1;
  const items: PortalNavItem[] = [];

  for (const relationship of principal.relationships) {
    const section = !multiple
      ? undefined
      : relationship.type === 'participant'
        ? RELATIONSHIP_LABELS.participant
        : `${RELATIONSHIP_LABELS[relationship.type]} · ${relationship.accountName}`;

    for (const portalModule of PORTAL_MODULES) {
      if (portalModule.relationship !== relationship.type || !portalModule.inNavigation) continue;
      if (!principal.permissions.includes(portalModule.permission)) continue;

      const badge = isDemoMode() ? DEMO_MODULE_BADGES[portalModule.permission]?.() : undefined;
      items.push({ label: portalModule.label, href: portalModule.href, icon: portalModule.icon, section, ...(badge ? { badge } : {}) });
    }
  }

  return items;
}
