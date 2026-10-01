/**
 * Access model for the unified NairobiX Portal.
 *
 * There is one Portal. Client, Partner and Staff are Relationships a Contact
 * holds with NairobiX — never portals the user picks. The chain is:
 *
 *   Identity (authenticated, verified)
 *     → Contact            (lib/access/directory.ts)
 *     → Portal Access      (active / suspended / revoked)
 *     → Relationships      (Client, Partner, Staff — each scoped to an Account)
 *     → Role per Relationship
 *     → Permissions        (lib/access/permissions.ts)
 *     → Modules / Navigation (lib/access/modules.ts)
 *
 * Every step runs on the server. Nothing the browser sends (query string,
 * localStorage, form fields) can add a Relationship, Role or Permission.
 */

import type { PartnerCapabilities } from '@/lib/types';
import type { NairobiXAccountId, NairobiXContactId } from '@/lib/crm/types';
import type { Permission } from './permissions';

/** A person's identity as asserted by the identity provider. Carries no authorization. */
export interface VerifiedIdentity {
  /** Stable subject identifier from the identity provider. */
  subject: string;
  /** Identity provider that authenticated this subject. */
  provider: string;
  email: string;
  emailVerified: boolean;
}

export type RelationshipType = 'client' | 'partner' | 'staff';

/**
 * Role ≠ Relationship: a Relationship says how the Contact is connected to
 * NairobiX; the Role says what they do within it. Each Relationship type has
 * a single default Role today — the seam exists so CRM-assigned Roles (e.g. a
 * billing-only client contact) can narrow permissions without UI changes.
 */
export type RelationshipRole = 'client-contact' | 'partner-contact' | 'staff-member';

/** Lifecycle of the Relationship itself, derived from the Account's CRM status. */
export type RelationshipStatus = 'active' | 'onboarding' | 'inactive';

export interface Relationship {
  type: RelationshipType;
  role: RelationshipRole;
  status: RelationshipStatus;
  /** Account the Relationship is scoped to. Staff Relationships are NairobiX-internal and have none. */
  accountId?: NairobiXAccountId;
  accountName: string;
  /** Approved partner capabilities (Partner Relationships only). */
  partnerCapabilities?: PartnerCapabilities;
}

/** Access ≠ Entitlement: whether this Contact may sign in to the Portal at all. */
export type PortalAccessStatus = 'active' | 'suspended' | 'revoked';

/** An authenticated, authorized Portal user. Only ever constructed server-side. */
export interface PortalPrincipal {
  contactId: NairobiXContactId;
  name: string;
  email: string;
  /** Authorized Relationships only (status active or onboarding). */
  relationships: Relationship[];
  permissions: Permission[];
}

/**
 * Outcome of resolving an identity against the NairobiX directory. The
 * user-facing states intentionally collapse "no Contact", "Lead only" and
 * "no active Relationship" into `no-access` so the Portal never reveals what
 * the CRM holds about an email address.
 */
export type AccessResult =
  | { state: 'unauthenticated' }
  | { state: 'unverified'; email: string }
  | { state: 'no-access'; email: string }
  | { state: 'suspended'; email: string }
  | { state: 'authorized'; principal: PortalPrincipal };
