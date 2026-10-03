/**
 * NairobiX CRM authorization rules (Zoho is the system of record).
 *
 *   Client       verified email → Contacts.Email → Contacts.Account_Name
 *                → a Deal on that Account with Stage = Closed Won,
 *                  Portal_Required = true, Contact_Name = this Contact and
 *                  Primary_Contact_Confirmed = true
 *                → Contacts.Portal_Access_Status = Active
 *   Participant  verified email → Contacts.Email
 *                → Opportunity_Network_Participants.Contact = this Contact
 *                → Participant_Status = Active AND Portal_Access_Status = Active
 *                → Participant_Status = Pending AND Portal_Access_Status = Active
 *                  (onboarding-only Relationship)
 *   Staff        verified email → an active Zoho CRM User
 *
 * Gates on every Contact-based Relationship: the Contact must not be
 * Inactive/Archived, and its Account (if any) must not be Inactive/Archived.
 * Contacts.NairobiX_Relationship and Accounts.Relationship_Type are
 * deliberately not consulted. Client Onboarding status does not affect access.
 *
 * Any CRM error propagates (CrmUnavailableError) so the caller denies access.
 */

import { getRecord, listActiveUsers, searchRecords, criteriaValue } from '@/lib/crm/zoho/client';
import { ZOHO_VALUES, type ZohoLookup, type ZohoRecord, type ZohoUser } from '@/lib/crm/zoho/schema';
import type { DirectoryResolution, PortalDirectory } from './directory';
import type { Relationship } from './types';

/** The CRM reads the rules need. Injectable so the rules can be tested without Zoho. */
export interface AuthorizationSource {
  findContactsByEmail(email: string): Promise<ZohoRecord[]>;
  getAccount(accountId: string): Promise<ZohoRecord | null>;
  findClosedWonDeals(accountId: string): Promise<ZohoRecord[]>;
  findParticipantsByContact(contactId: string): Promise<ZohoRecord[]>;
  findActiveUserByEmail(email: string): Promise<ZohoUser | null>;
}

export const zohoAuthorizationSource: AuthorizationSource = {
  findContactsByEmail: (email) => searchRecords('contacts', `(Email:equals:${criteriaValue(email)})`),
  getAccount: (accountId) => getRecord('accounts', accountId),
  findClosedWonDeals: (accountId) =>
    searchRecords(
      'deals',
      `((Account_Name:equals:${criteriaValue(accountId)})and(Stage:equals:${criteriaValue(ZOHO_VALUES.dealClosedWon)}))`
    ),
  findParticipantsByContact: (contactId) =>
    searchRecords('participants', `(Contact:equals:${criteriaValue(contactId)})`),
  findActiveUserByEmail: async (email) =>
    (await listActiveUsers()).find((user) => user.status === 'active' && normalize(user.email) === email) ?? null,
};

function normalize(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function lookupId(value: unknown): string | undefined {
  const id = (value as ZohoLookup | null | undefined)?.id;
  return typeof id === 'string' && id ? id : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function includes(list: readonly string[], value: unknown): boolean {
  return typeof value === 'string' && list.includes(value);
}

function contactName(contact: ZohoRecord, fallback: string): string {
  return (
    str(contact.Full_Name) ??
    ([str(contact.First_Name), str(contact.Last_Name)].filter(Boolean).join(' ') || fallback)
  );
}

/** Client eligibility for one Deal, re-checked field by field (search results are never trusted alone). */
export function dealAuthorizesClient(deal: ZohoRecord, accountId: string, contactId: string): boolean {
  return (
    lookupId(deal.Account_Name) === accountId &&
    deal.Stage === ZOHO_VALUES.dealClosedWon &&
    deal.Portal_Required === true &&
    lookupId(deal.Contact_Name) === contactId &&
    deal.Primary_Contact_Confirmed === true
  );
}

export function participantAuthorized(participant: ZohoRecord, contactId: string): boolean {
  return (
    lookupId(participant.Contact) === contactId &&
    participant.Participant_Status === ZOHO_VALUES.participantActive &&
    participant.Portal_Access_Status === ZOHO_VALUES.participantPortalActive
  );
}

/** A Pending Participant can enter only the onboarding Relationship lifecycle. */
export function participantOnboardingAuthorized(participant: ZohoRecord, contactId: string): boolean {
  return (
    lookupId(participant.Contact) === contactId &&
    participant.Participant_Status === 'Pending' &&
    participant.Portal_Access_Status === ZOHO_VALUES.participantPortalActive
  );
}

export function createZohoDirectory(source: AuthorizationSource = zohoAuthorizationSource): PortalDirectory {
  return {
    async resolve(rawEmail) {
      const email = normalize(rawEmail);
      if (!email) return null;

      const [contactMatches, staffUser] = await Promise.all([
        source.findContactsByEmail(email),
        source.findActiveUserByEmail(email),
      ]);

      const relationships: Relationship[] = [];
      let blocked = false;
      let contactId: string | undefined;
      let name: string | undefined;

      const contacts = contactMatches.filter((c) => normalize(c.Email) === email);
      if (contacts.length > 1) {
        // Two Contacts share this email: the identity is ambiguous, so no Contact-based access.
        console.warn(`[access] ${contacts.length} CRM Contacts share one email (${contacts.map((c) => c.id).join(', ')}); denying Contact-based access.`);
      }

      const contact = contacts.length === 1 ? contacts[0] : undefined;
      if (contact && !includes(ZOHO_VALUES.contactInactive, contact.Contact_Status)) {
        contactId = contact.id;
        name = contactName(contact, email);
        const accountId = lookupId(contact.Account_Name);

        const [account, participants] = await Promise.all([
          accountId ? source.getAccount(accountId) : Promise.resolve(null),
          source.findParticipantsByContact(contact.id),
        ]);

        // An Account that is linked but missing, inactive or archived blocks every Contact-based Relationship.
        const accountOk = !accountId || (account !== null && !includes(ZOHO_VALUES.accountInactive, account.Account_Status));

        if (accountOk) {
          // Client
          const contactPortalActive = contact.Portal_Access_Status === ZOHO_VALUES.contactPortalActive;
          if (includes(ZOHO_VALUES.contactPortalBlocked, contact.Portal_Access_Status)) blocked = true;

          if (accountId && account && contactPortalActive) {
            const deals = (await source.findClosedWonDeals(accountId)).filter((deal) =>
              dealAuthorizesClient(deal, accountId, contact.id)
            );
            if (deals.length) {
              relationships.push({
                type: 'client',
                role: 'client-contact',
                status: 'active',
                accountId,
                accountName: str(account.Account_Name) ?? 'Client account',
                dealIds: deals.map((d) => d.id),
              });
            }
          }

          // Opportunity Network Participant
          const linked = participants.filter((p) => lookupId(p.Contact) === contact.id);
          if (
            linked.some(
              (p) =>
                includes(ZOHO_VALUES.participantBlocked, p.Participant_Status) ||
                includes(ZOHO_VALUES.participantPortalBlocked, p.Portal_Access_Status)
            )
          ) {
            blocked = true;
          }
          const active = linked.filter((p) => participantAuthorized(p, contact.id));
          const onboarding = linked.filter((p) => participantOnboardingAuthorized(p, contact.id));
          // Preserve Active precedence when the Contact has multiple Participant records.
          const eligible = active.length ? active : onboarding;
          if (eligible.length) {
            const types = new Set<string>();
            for (const p of eligible) {
              for (const t of Array.isArray(p.Participation_Type) ? p.Participation_Type : []) {
                if (includes(ZOHO_VALUES.participationTypes, t)) types.add(t as string);
              }
            }
            relationships.push({
              type: 'participant',
              role: 'participant',
              status: active.length ? 'active' : 'onboarding',
              accountId: accountId,
              accountName: 'Opportunity Network',
              participantIds: eligible.map((p) => p.id),
              participationTypes: [...types],
            });
          }
        }
      }

      // Staff
      if (staffUser) {
        relationships.push({ type: 'staff', role: 'staff-member', status: 'active', accountName: 'NairobiX' });
        name ??= str(staffUser.full_name) ?? email;
      }

      if (!contactId && !staffUser) return null;

      return {
        contactId,
        crmUserId: staffUser?.id,
        name: name ?? email,
        email,
        relationships,
        blocked: relationships.length === 0 && blocked,
      } satisfies DirectoryResolution;
    },
  };
}
