/**
 * Access model for the unified NairobiX Portal.
 *
 * There is one Portal. Client, Opportunity Network Participant and Staff are
 * Relationships a person holds with NairobiX — never portals the user picks.
 * The chain is:
 *
 *   Identity (authenticated, verified email)
 *     → CRM identity       (Contact and/or active CRM User — lib/access/zoho-directory.ts)
 *     → Relationships      (Client via a Closed Won Deal, Participant via an
 *                           Opportunity Network Participant record, Staff via
 *                           an active CRM User)
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

/** `participant` = Opportunity Network Participant ("Partner" is UI shorthand only). */
export type RelationshipType = 'client' | 'participant' | 'staff';

/**
 * Role ≠ Relationship: a Relationship says how the person is connected to
 * NairobiX; the Role says what they do within it. Each Relationship type has
 * a single default Role today.
 */
export type RelationshipRole = 'client-contact' | 'participant' | 'staff-member';

/** Lifecycle of the Relationship itself. CRM-resolved Relationships are always `active`. */
export type RelationshipStatus = 'active' | 'onboarding' | 'inactive';

export interface Relationship {
  type: RelationshipType;
  role: RelationshipRole;
  status: RelationshipStatus;
  /** Account the Relationship is scoped to. Staff Relationships are NairobiX-internal and have none. */
  accountId?: NairobiXAccountId;
  accountName: string;
  /** Client: the Closed Won Deals that authorize this Relationship. */
  dealIds?: string[];
  /** Participant: the Opportunity Network Participant record(s). */
  participantIds?: string[];
  /** Participant: approved Participation Types (a relationship attribute, not an entitlement). */
  participationTypes?: string[];
  /**
   * Module capabilities. Only the local demo directory sets these; no CRM
   * field grants them yet, so CRM-resolved Participants receive none.
   */
  capabilities?: PartnerCapabilities;
}

/** Access ≠ Entitlement: whether this Contact may sign in to the Portal at all. */
export type PortalAccessStatus = 'active' | 'suspended' | 'revoked';

/** An authenticated, authorized Portal user. Only ever constructed server-side. */
export interface PortalPrincipal {
  /** CRM Contact, for Client and Participant Relationships. */
  contactId?: NairobiXContactId;
  /** CRM User, for the Staff Relationship. */
  crmUserId?: string;
  name: string;
  email: string;
  /** Authorized Relationships only (status active or onboarding). */
  relationships: Relationship[];
  permissions: Permission[];
}

/**
 * Outcome of resolving an identity. The user-facing states intentionally
 * collapse "no Contact", "Lead only" and "no eligible Relationship" into
 * `no-access` so the Portal never reveals what the CRM holds about an email.
 * `unavailable` means the CRM could not be consulted: access is denied, and
 * the decision is not cached.
 */
export type AccessResult =
  | { state: 'unauthenticated' }
  | { state: 'unverified'; email: string }
  | { state: 'no-access'; email: string }
  | { state: 'suspended'; email: string }
  | { state: 'unavailable'; email: string }
  | { state: 'authorized'; principal: PortalPrincipal };
