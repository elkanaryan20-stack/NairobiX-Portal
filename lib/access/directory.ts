/**
 * NairobiX directory: resolves an authenticated identity to a Contact, the
 * Contact's Portal Access record and their Relationships.
 *
 * `PortalDirectory` is the contract. The mock implementation below reads the
 * demo data in lib/mock-data.ts; the production implementation should query
 * NairobiX CRM (Zoho) server-side:
 *
 *   findContactByVerifiedEmail → Contacts search on verified email
 *   getPortalAccess            → Portal Access fields on the Contact
 *                                 (granted explicitly by staff — never inferred)
 *   getRelationships           → Contact ↔ Account links (Client / Partner)
 *                                 and the internal staff directory
 *
 * Lead ≠ Portal User: Leads are never consulted here. An email that only
 * exists as a CRM Lead resolves to no Contact and therefore no access.
 *
 * Kept free of React / Node-only imports so it can run in middleware.
 */

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
import type { PortalAccessStatus, Relationship, RelationshipRole, RelationshipType } from './types';

export interface DirectoryContact {
  contactId: NairobiXContactId;
  name: string;
  email: string;
}

export interface PortalAccessRecord {
  contactId: NairobiXContactId;
  status: PortalAccessStatus;
}

export interface PortalDirectory {
  findContactByVerifiedEmail(email: string): Promise<DirectoryContact | undefined>;
  getPortalAccess(contactId: NairobiXContactId): Promise<PortalAccessRecord | undefined>;
  getRelationships(contactId: NairobiXContactId): Promise<Relationship[]>;
}

// ---------------------------------------------------------------------------
// Mock implementation
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
  'CNT-10088': 'active', // James Mwangi — Partner
  'CNT-10004': 'active', // Grace Kipchoge — Staff
  'CNT-10107': 'active', // Amina Wanjiru — Client + Partner
  'CNT-10126': 'active', // Faith Njeri — Partner (onboarding)
  'CNT-10131': 'suspended', // Peter Otieno — access suspended
};

interface RelationshipLink {
  contactId: NairobiXContactId;
  type: RelationshipType;
  role: RelationshipRole;
  accountId?: NairobiXAccountId;
}

/** Contact ↔ Account links, as CRM would hold them. */
const RELATIONSHIP_LINKS: RelationshipLink[] = [
  { contactId: 'CNT-10021', type: 'client', role: 'client-contact', accountId: 'ACC-20031' },
  { contactId: 'CNT-10088', type: 'partner', role: 'partner-contact', accountId: 'ACC-20077' },
  { contactId: 'CNT-10004', type: 'staff', role: 'staff-member' },
  { contactId: 'CNT-10107', type: 'client', role: 'client-contact', accountId: 'ACC-20031' },
  { contactId: 'CNT-10107', type: 'partner', role: 'partner-contact', accountId: 'ACC-20077' },
  { contactId: 'CNT-10126', type: 'partner', role: 'partner-contact', accountId: 'ACC-20112' },
  { contactId: 'CNT-10131', type: 'client', role: 'client-contact', accountId: 'ACC-20031' },
];

function resolveLink(link: RelationshipLink): Relationship | undefined {
  if (link.type === 'staff') {
    return { type: 'staff', role: link.role, status: 'active', accountName: 'NairobiX' };
  }

  if (link.type === 'client') {
    // Only one demo client Account exists; any other accountId has no Account.
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
    type: 'partner',
    role: link.role,
    accountId: link.accountId,
    accountName: partner.businessName,
    status:
      partner.partnerStatus === 'active'
        ? 'active'
        : partner.partnerStatus === 'onboarding' || partner.partnerStatus === 'pending'
          ? 'onboarding'
          : 'inactive',
    partnerCapabilities: partner.capabilities,
  };
}

export const mockPortalDirectory: PortalDirectory = {
  async findContactByVerifiedEmail(email) {
    const normalized = email.trim().toLowerCase();
    const user = DIRECTORY_CONTACTS.find((u) => u.email.toLowerCase() === normalized);
    if (!user?.nairobixContactId) return undefined;
    return { contactId: user.nairobixContactId, name: user.name, email: user.email };
  },

  async getPortalAccess(contactId) {
    const status = PORTAL_ACCESS[contactId];
    return status ? { contactId, status } : undefined;
  },

  async getRelationships(contactId) {
    return RELATIONSHIP_LINKS.filter((link) => link.contactId === contactId)
      .map(resolveLink)
      .filter((r): r is Relationship => r !== undefined);
  },
};

/** The directory the Portal resolves against. Swap for the CRM-backed implementation. */
export function getPortalDirectory(): PortalDirectory {
  return mockPortalDirectory;
}
