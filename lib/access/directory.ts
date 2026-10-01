/**
 * NairobiX directory: resolves a verified email to the person's CRM identity
 * and their Relationships.
 *
 * `PortalDirectory` is the contract. Production always uses the Zoho-backed
 * implementation (lib/access/zoho-directory.ts). The demo implementation
 * below reads lib/mock-data.ts and exists only for local development; it is
 * unreachable in production builds (lib/crm/mode.ts).
 *
 * Lead ≠ Portal User: Leads are never consulted. An email that only exists as
 * a CRM Lead resolves to nothing and therefore no access.
 */

import { isDemoMode } from '@/lib/crm/mode';
import {
  mockAllPartners,
  mockClientProfile,
  mockCurrentUser,
  mockMultiRelationshipUser,
  mockOnboardingPartnerUser,
  mockPartnerUser,
  mockStaffUser,
  mockSuspendedUser,
} from '@/lib/mock-data';
import type { User } from '@/lib/types';
import type { NairobiXAccountId, NairobiXContactId } from '@/lib/crm/types';
import { createZohoDirectory } from './zoho-directory';
import type { PortalAccessStatus, Relationship, RelationshipRole, RelationshipType } from './types';

export interface DirectoryResolution {
  contactId?: string;
  crmUserId?: string;
  name: string;
  email: string;
  /** Eligible Relationships (may be empty). */
  relationships: Relationship[];
  /** No eligible Relationship because Portal access is explicitly suspended or revoked. */
  blocked: boolean;
}

export interface PortalDirectory {
  /**
   * The CRM identity behind a verified email, or null when the email matches
   * no Contact and no CRM User. Throws when the CRM cannot be consulted.
   */
  resolve(email: string): Promise<DirectoryResolution | null>;
}

// ---------------------------------------------------------------------------
// Demo implementation (development only)
// ---------------------------------------------------------------------------

const DIRECTORY_CONTACTS: User[] = [
  mockCurrentUser,
  mockPartnerUser,
  mockStaffUser,
  mockMultiRelationshipUser,
  mockOnboardingPartnerUser,
  mockSuspendedUser,
];

/** Portal Access is granted per Contact, explicitly. A Contact with no record has no access. */
const PORTAL_ACCESS: Record<NairobiXContactId, PortalAccessStatus> = {
  'CNT-10021': 'active', // Sarah Johnson — Client
  'CNT-10088': 'active', // James Mwangi — Participant
  'CNT-10004': 'active', // Grace Kipchoge — Staff
  'CNT-10107': 'active', // Amina Wanjiru — Client + Participant
  'CNT-10126': 'active', // Faith Njeri — Participant (onboarding)
  'CNT-10131': 'suspended', // Peter Otieno — access suspended
};

interface RelationshipLink {
  contactId: NairobiXContactId;
  type: RelationshipType;
  role: RelationshipRole;
  accountId?: NairobiXAccountId;
}

const RELATIONSHIP_LINKS: RelationshipLink[] = [
  { contactId: 'CNT-10021', type: 'client', role: 'client-contact', accountId: 'ACC-20031' },
  { contactId: 'CNT-10088', type: 'participant', role: 'participant', accountId: 'ACC-20077' },
  { contactId: 'CNT-10004', type: 'staff', role: 'staff-member' },
  { contactId: 'CNT-10107', type: 'client', role: 'client-contact', accountId: 'ACC-20031' },
  { contactId: 'CNT-10107', type: 'participant', role: 'participant', accountId: 'ACC-20077' },
  { contactId: 'CNT-10126', type: 'participant', role: 'participant', accountId: 'ACC-20112' },
  { contactId: 'CNT-10131', type: 'client', role: 'client-contact', accountId: 'ACC-20031' },
];

function resolveDemoLink(link: RelationshipLink): Relationship | undefined {
  if (link.type === 'staff') {
    return { type: 'staff', role: link.role, status: 'active', accountName: 'NairobiX' };
  }

  if (link.type === 'client') {
    if (link.accountId !== mockClientProfile.nairobixAccountId) return undefined;
    return {
      type: 'client',
      role: link.role,
      accountId: link.accountId,
      accountName: mockClientProfile.businessName,
      status: mockClientProfile.partnershipStatus === 'active' ? 'active' : 'inactive',
    };
  }

  const partner = mockAllPartners.find((p) => p.nairobixAccountId === link.accountId);
  if (!partner) return undefined;
  return {
    type: 'participant',
    role: link.role,
    accountId: link.accountId,
    accountName: partner.businessName,
    status:
      partner.partnerStatus === 'active'
        ? 'active'
        : partner.partnerStatus === 'onboarding' || partner.partnerStatus === 'pending'
          ? 'onboarding'
          : 'inactive',
    capabilities: partner.capabilities,
  };
}

export const demoPortalDirectory: PortalDirectory = {
  async resolve(email) {
    const normalized = email.trim().toLowerCase();
    const user = DIRECTORY_CONTACTS.find((u) => u.email.toLowerCase() === normalized);
    const contactId = user?.nairobixContactId;
    if (!user || !contactId) return null;

    const access = PORTAL_ACCESS[contactId];
    const relationships =
      access === 'active'
        ? RELATIONSHIP_LINKS.filter((link) => link.contactId === contactId)
            .map(resolveDemoLink)
            .filter((r): r is Relationship => r !== undefined)
        : [];

    return {
      contactId,
      name: user.name,
      email: user.email,
      relationships,
      blocked: access === 'suspended' || access === 'revoked',
    };
  },
};

const zohoDirectory = createZohoDirectory();

/** The directory the Portal resolves against: always the CRM in production. */
export function getPortalDirectory(): PortalDirectory {
  return isDemoMode() ? demoPortalDirectory : zohoDirectory;
}
