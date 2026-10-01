/**
 * Authorization tests for the NairobiX CRM access rules.
 *
 * The real rule code (lib/access/zoho-directory.ts + lib/access/resolve.ts)
 * runs against an in-memory stand-in for Zoho, so every rule and every
 * failure path is exercised without network access.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createZohoDirectory, type AuthorizationSource } from '@/lib/access/zoho-directory';
import { resolveAccess } from '@/lib/access/resolve';
import { CrmUnavailableError } from '@/lib/crm/zoho/client';
import type { ZohoRecord, ZohoUser } from '@/lib/crm/zoho/schema';
import type { AccessResult, VerifiedIdentity } from '@/lib/access/types';

const EMAIL = 'person@example.com';
const ACCOUNT = 'acc-1';
const CONTACT = 'ct-1';

interface World {
  contacts: ZohoRecord[];
  accounts: ZohoRecord[];
  deals: ZohoRecord[];
  participants: ZohoRecord[];
  users: ZohoUser[];
}

const contact = (overrides: Partial<ZohoRecord> = {}): ZohoRecord => ({
  id: CONTACT,
  Email: EMAIL,
  Full_Name: 'Pat Example',
  Account_Name: { id: ACCOUNT, name: 'Acme Ltd' },
  Contact_Status: 'Active',
  Portal_Access_Status: 'Active',
  ...overrides,
});

const account = (overrides: Partial<ZohoRecord> = {}): ZohoRecord => ({
  id: ACCOUNT,
  Account_Name: 'Acme Ltd',
  Account_Status: 'Active',
  ...overrides,
});

const deal = (overrides: Partial<ZohoRecord> = {}): ZohoRecord => ({
  id: 'deal-1',
  Account_Name: { id: ACCOUNT, name: 'Acme Ltd' },
  Stage: 'Closed Won',
  Portal_Required: true,
  Contact_Name: { id: CONTACT, name: 'Pat Example' },
  Primary_Contact_Confirmed: true,
  ...overrides,
});

const participant = (overrides: Partial<ZohoRecord> = {}): ZohoRecord => ({
  id: 'onp-1',
  Name: 'Pat Example',
  Contact: { id: CONTACT, name: 'Pat Example' },
  Participant_Status: 'Active',
  Portal_Access_Status: 'Active',
  Participation_Type: ['Referral Partner', 'Expert'],
  ...overrides,
});

const staffUser = (overrides: Partial<ZohoUser> = {}): ZohoUser => ({
  id: 'user-1',
  email: EMAIL,
  full_name: 'Pat Example',
  status: 'active',
  ...overrides,
});

function world(partial: Partial<World>): World {
  return { contacts: [], accounts: [], deals: [], participants: [], users: [], ...partial };
}

/** In-memory Zoho: loose "search" semantics like the real API; the rules must re-check every field. */
function fakeSource(w: World): AuthorizationSource {
  return {
    findContactsByEmail: async (email) => w.contacts.filter((c) => String(c.Email).toLowerCase() === email),
    getAccount: async (id) => w.accounts.find((a) => a.id === id) ?? null,
    findClosedWonDeals: async (accountId) =>
      w.deals.filter((d) => (d.Account_Name as { id: string }).id === accountId && d.Stage === 'Closed Won'),
    findParticipantsByContact: async (contactId) =>
      w.participants.filter((p) => (p.Contact as { id: string } | null)?.id === contactId),
    findActiveUserByEmail: async (email) =>
      w.users.find((u) => u.status === 'active' && u.email.toLowerCase() === email) ?? null,
  };
}

const identity = (overrides: Partial<VerifiedIdentity> = {}): VerifiedIdentity => ({
  subject: 'supabase-user-1',
  provider: 'supabase',
  email: EMAIL,
  emailVerified: true,
  ...overrides,
});

function resolveIn(w: World, id: VerifiedIdentity | null = identity()): Promise<AccessResult> {
  return resolveAccess(id, createZohoDirectory(fakeSource(w)));
}

const clientWorld = (overrides: { contact?: Partial<ZohoRecord>; account?: Partial<ZohoRecord>; deal?: Partial<ZohoRecord> } = {}) =>
  world({
    contacts: [contact(overrides.contact)],
    accounts: [account(overrides.account)],
    deals: [deal(overrides.deal)],
  });

const participantWorld = (overrides: { contact?: Partial<ZohoRecord>; participant?: Partial<ZohoRecord> } = {}) =>
  world({
    contacts: [contact({ Account_Name: null, ...overrides.contact })],
    participants: [participant(overrides.participant)],
  });

function authorized(result: AccessResult) {
  if (result.state !== 'authorized') throw new Error(`expected authorized, got ${result.state}`);
  return result.principal;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('authentication gates', () => {
  it('no session → unauthenticated', async () => {
    expect((await resolveIn(clientWorld(), null)).state).toBe('unauthenticated');
  });

  it('unverified email → unverified, CRM never consulted', async () => {
    const source = fakeSource(clientWorld());
    const spy = vi.spyOn(source, 'findContactsByEmail');
    const result = await resolveAccess(identity({ emailVerified: false }), createZohoDirectory(source));
    expect(result.state).toBe('unverified');
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('Client', () => {
  it('authorized Client: Closed Won + Portal Required + confirmed primary Contact + Active portal access', async () => {
    const principal = authorized(await resolveIn(clientWorld()));
    expect(principal.contactId).toBe(CONTACT);
    expect(principal.relationships).toEqual([
      expect.objectContaining({ type: 'client', accountId: ACCOUNT, accountName: 'Acme Ltd', dealIds: ['deal-1'] }),
    ]);
    expect(principal.permissions).toContain('client.overview');
    expect(principal.permissions.some((p) => p.startsWith('participant.') || p.startsWith('staff.'))).toBe(false);
  });

  it('matches the email case-insensitively', async () => {
    authorized(await resolveIn(clientWorld(), identity({ email: 'Person@Example.COM' })));
  });

  it.each([
    ['Deal not Closed Won', { deal: { Stage: 'Negotiation/Review' } }],
    ['Portal Required = false', { deal: { Portal_Required: false } }],
    ['Portal Required missing', { deal: { Portal_Required: null } }],
    ['Deal Contact is someone else', { deal: { Contact_Name: { id: 'ct-other' } } }],
    ['Primary Contact not confirmed', { deal: { Primary_Contact_Confirmed: false } }],
    ['Contact not linked to the Deal Account', { contact: { Account_Name: { id: 'acc-other' } } }],
    ['Contact has no Account', { contact: { Account_Name: null } }],
    ['Portal access Not Enabled', { contact: { Portal_Access_Status: 'Not Enabled' } }],
    ['Portal access Invitation Pending', { contact: { Portal_Access_Status: 'Invitation Pending' } }],
    ['Portal access empty', { contact: { Portal_Access_Status: null } }],
  ])('unauthorized Client — %s → no access', async (_label, overrides) => {
    expect((await resolveIn(clientWorld(overrides))).state).toBe('no-access');
  });

  it('Client Onboarding status does not affect eligibility', async () => {
    authorized(await resolveIn(clientWorld({ deal: { Onboarding_Status: 'Not Started' } })));
  });

  it.each(['Suspended', 'Revoke'])('suspended Client — Portal Access Status %s → suspended', async (status) => {
    expect((await resolveIn(clientWorld({ contact: { Portal_Access_Status: status } }))).state).toBe('suspended');
  });
});

describe('Contact and Account status gates', () => {
  it.each(['Inactiv', 'Inactive', 'Archived'])('inactive Contact (%s) → no access, even with eligible Client and Participant records', async (status) => {
    const w = clientWorld({ contact: { Contact_Status: status } });
    w.participants.push(participant());
    expect((await resolveIn(w)).state).toBe('no-access');
  });

  it.each(['Inactive', 'Archived'])('inactive Account (%s) → no access for Client and Participant', async (status) => {
    const w = clientWorld({ account: { Account_Status: status } });
    w.participants.push(participant());
    expect((await resolveIn(w)).state).toBe('no-access');
  });

  it('linked Account that cannot be found → no access', async () => {
    const w = clientWorld();
    w.accounts = [];
    expect((await resolveIn(w)).state).toBe('no-access');
  });
});

describe('Opportunity Network Participant', () => {
  it('authorized Active Participant: Participant Status Active AND Portal Access Status Active', async () => {
    const principal = authorized(await resolveIn(participantWorld()));
    expect(principal.relationships).toEqual([
      expect.objectContaining({
        type: 'participant',
        participantIds: ['onp-1'],
        participationTypes: ['Referral Partner', 'Expert'],
      }),
    ]);
  });

  it('Participation Type grants no module entitlements: only Overview, Resources, Notifications, Settings', async () => {
    const principal = authorized(await resolveIn(participantWorld({ participant: { Participation_Type: ['Referral Partner', 'Expert', 'Service Partner', 'Project Partner'] } })));
    expect(principal.permissions).toEqual([
      'participant.overview',
      'participant.resources',
      'participant.notifications',
      'participant.settings',
    ]);
  });

  it.each(['Pending', 'Onboarding', 'Under Verification', 'Approved', 'Inactive', null])(
    'non-Active Participant (status %s) → no access',
    async (status) => {
      expect((await resolveIn(participantWorld({ participant: { Participant_Status: status } }))).state).toBe('no-access');
    }
  );

  it.each(['Not Required', 'Pending Verification', null])(
    'Active Participant without Active portal access (%s) → no access',
    async (status) => {
      expect((await resolveIn(participantWorld({ participant: { Portal_Access_Status: status } }))).state).toBe('no-access');
    }
  );

  it('suspended Participant — Participant Status Suspended → suspended', async () => {
    expect((await resolveIn(participantWorld({ participant: { Participant_Status: 'Suspended' } }))).state).toBe('suspended');
  });

  it.each(['Suspended', 'Revoked'])('suspended Participant — Portal Access Status %s → suspended', async (status) => {
    expect((await resolveIn(participantWorld({ participant: { Portal_Access_Status: status } }))).state).toBe('suspended');
  });

  it('Participant record without a valid linked Contact → no access', async () => {
    const w = participantWorld();
    w.participants = [participant({ Contact: null, Email: EMAIL })];
    expect((await resolveIn(w)).state).toBe('no-access');
  });

  it('Participant Email alone is not an identity match', async () => {
    const w = world({ participants: [participant({ Contact: null, Email: EMAIL })] });
    expect((await resolveIn(w)).state).toBe('no-access');
  });

  it('Contact portal status does not gate Participant access (separate concepts)', async () => {
    authorized(await resolveIn(participantWorld({ contact: { Portal_Access_Status: 'Not Enabled' } })));
  });
});

describe('Staff', () => {
  it('authorized Staff: an active CRM User, no Contact required', async () => {
    const principal = authorized(await resolveIn(world({ users: [staffUser()] })));
    expect(principal.crmUserId).toBe('user-1');
    expect(principal.contactId).toBeUndefined();
    expect(principal.relationships).toEqual([expect.objectContaining({ type: 'staff' })]);
    expect(principal.permissions).toContain('staff.overview');
    expect(principal.permissions.some((p) => !p.startsWith('staff.'))).toBe(false);
  });

  it('inactive CRM User → no access', async () => {
    expect((await resolveIn(world({ users: [staffUser({ status: 'disabled' })] }))).state).toBe('no-access');
  });
});

describe('relationship fields are not used for authorization', () => {
  it('Contacts.NairobiX_Relationship = Staff grants nothing', async () => {
    const w = world({ contacts: [contact({ NairobiX_Relationship: 'Staff', Account_Name: null })] });
    expect((await resolveIn(w)).state).toBe('no-access');
  });

  it('Contacts.NairobiX_Relationship = Client grants nothing without an eligible Deal', async () => {
    const w = clientWorld({ contact: { NairobiX_Relationship: 'Client' }, deal: { Portal_Required: false } });
    expect((await resolveIn(w)).state).toBe('no-access');
  });
});

describe('unknown and ambiguous identities', () => {
  it('unknown email → no access', async () => {
    expect((await resolveIn(clientWorld(), identity({ email: 'stranger@example.com' }))).state).toBe('no-access');
  });

  it('two Contacts sharing the email → no Contact-based access', async () => {
    const w = clientWorld();
    w.contacts.push(contact({ id: 'ct-2' }));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect((await resolveIn(w)).state).toBe('no-access');
  });
});

describe('CRM lookup failure fails closed', () => {
  it.each<keyof AuthorizationSource>([
    'findContactsByEmail',
    'getAccount',
    'findClosedWonDeals',
    'findParticipantsByContact',
    'findActiveUserByEmail',
  ])('%s throws → unavailable (no access)', async (method) => {
    const w = clientWorld();
    w.participants.push(participant());
    const source = fakeSource(w);
    source[method] = async () => {
      throw new CrmUnavailableError('Zoho responded 500');
    };
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect((await resolveAccess(identity(), createZohoDirectory(source))).state).toBe('unavailable');
  });
});

describe('production safety', () => {
  it('production never falls back to the demo directory: a demo Staff email is denied', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const key of ['ZOHO_ACCOUNTS_URL', 'ZOHO_API_DOMAIN', 'ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN']) {
      vi.stubEnv(key, '');
    }
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const result = await resolveAccess(identity({ email: 'grace@nairobix.com' }));
    expect(result.state).toBe('unavailable');
  });

  it('production without CRM configuration denies every identity', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ZOHO_REFRESH_TOKEN', '');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect((await resolveAccess(identity())).state).toBe('unavailable');
  });

  it('production has no development sign-in: without Supabase, sign-in is unavailable', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    const { getIdentityProvider } = await import('@/lib/auth/provider');
    expect(getIdentityProvider()).toBeNull();
  });

  it('production rejects sessions when the session secret is missing', async () => {
    const { createSessionToken, verifySessionToken } = await import('@/lib/auth/session');
    const token = await createSessionToken(identity());
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NAIROBIX_SESSION_SECRET', '');
    expect(await verifySessionToken(token)).toBeNull();
    await expect(createSessionToken(identity())).rejects.toThrow();
  });

  it('a tampered session cookie is rejected', async () => {
    const { createSessionToken, verifySessionToken } = await import('@/lib/auth/session');
    const token = await createSessionToken(identity());
    const [body, signature] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, 'base64url').toString()), email: 'ceo@nairobix.com' }))
      .toString('base64url');
    expect(await verifySessionToken(`${forged}.${signature}`)).toBeNull();
  });
});
