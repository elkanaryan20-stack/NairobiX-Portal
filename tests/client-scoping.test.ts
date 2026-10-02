/**
 * Client data scoping: every Zoho query a Client Workspace loader issues must
 * be keyed to the signed-in client's own Account, Contact or verified email —
 * never another client's — and loaders refuse principals without a Client
 * Relationship.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PortalPrincipal } from '@/lib/access/types';

const calls: { kind: string; module: string; arg: string }[] = [];

vi.mock('next/cache', () => ({
  unstable_cache: (fn: () => Promise<unknown>) => fn,
}));

vi.mock('@/lib/crm/zoho/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/crm/zoho/client')>();
  return {
    ...actual,
    searchRecords: vi.fn(async (module: string, criteria: string) => {
      calls.push({ kind: 'search', module, arg: criteria });
      return [];
    }),
    getRecord: vi.fn(async (module: string, id: string) => {
      calls.push({ kind: 'get', module, arg: id });
      return { id, Account_Name: 'Acme Ltd' };
    }),
    listRecords: vi.fn(async (module: string) => {
      calls.push({ kind: 'list', module, arg: '' });
      return [];
    }),
  };
});

const ACCOUNT = '5001';
const CONTACT = '7001';
const EMAIL = 'client@acme.example';

const principal: PortalPrincipal = {
  contactId: CONTACT,
  name: 'Pat Client',
  email: EMAIL,
  relationships: [{ type: 'client', role: 'client-contact', status: 'active', accountId: ACCOUNT, accountName: 'Acme Ltd', dealIds: ['9001'] }],
  permissions: ['client.overview'],
};

beforeEach(() => {
  calls.length = 0;
  vi.stubEnv('NAIROBIX_CRM', 'zoho');
});

describe('client loaders are scoped to the authorized client', () => {
  it('every query targets only this Account, Contact or verified email', async () => {
    const client = await import('@/lib/portal-data/client');
    await Promise.all([
      client.getClientProfile(principal),
      client.getClientProjects(principal),
      client.getClientInvoices(principal),
      client.getClientServiceRequests(principal),
      client.getClientDocuments(principal),
      client.getClientOnboarding(principal),
      client.getClientServices(principal),
      client.getClientProposals(principal),
      client.getClientSignatureRequests(principal),
      client.getClientMeetings(principal),
    ]);

    // Client loaders never list whole modules.
    expect(calls.filter((c) => c.kind === 'list')).toEqual([]);

    const expected: Record<string, RegExp> = {
      deals: new RegExp(`^\\(\\(Account_Name:equals:${ACCOUNT}\\)and\\(Stage:equals:Closed Won\\)\\)$`),
      engagements: new RegExp(`^\\(Account:equals:${ACCOUNT}\\)$`),
      invoices: new RegExp(`^\\(Account_Name:equals:${ACCOUNT}\\)$`),
      cases: new RegExp(`^\\(Account_Name:equals:${ACCOUNT}\\)$`),
      signDocuments: new RegExp(`^\\(zohosign__Account:equals:${ACCOUNT}\\)$`),
      clientOnboardings: new RegExp(`^\\(Account:equals:${ACCOUNT}\\)$`),
      salesOrders: new RegExp(`^\\(Account_Name:equals:${ACCOUNT}\\)$`),
      quotes: new RegExp(`^\\(Account_Name:equals:${ACCOUNT}\\)$`),
      signRecipients: new RegExp(`^\\(Email:equals:${EMAIL.replace(/\./g, '\\.')}\\)$`),
      meetings: new RegExp(`^\\((What_Id:equals:${ACCOUNT}|Who_Id:equals:${CONTACT})\\)$`),
    };

    const searches = calls.filter((c) => c.kind === 'search');
    expect(new Set(searches.map((c) => c.module))).toEqual(new Set(Object.keys(expected)));
    for (const call of searches) {
      expect(call.arg, `${call.module} criteria`).toMatch(expected[call.module]);
    }
    expect(calls.filter((c) => c.kind === 'get')).toEqual([{ kind: 'get', module: 'accounts', arg: ACCOUNT }]);
  });

  it('only the authorizing Deals are exposed on the profile', async () => {
    const zoho = await import('@/lib/crm/zoho/client');
    vi.mocked(zoho.searchRecords).mockImplementationOnce(async () => [
      { id: '9001', Deal_Name: 'Our engagement', Account_Name: { id: ACCOUNT }, Growth_Proposal_Link: 'https://example.com/p' },
      { id: '9002', Deal_Name: 'Another contact’s deal', Account_Name: { id: ACCOUNT } },
    ]);
    const { getClientProfile } = await import('@/lib/portal-data/client');
    const profile = await getClientProfile(principal);
    expect(profile.deals.map((d) => d.id)).toEqual(['9001']);
    expect(profile.deals[0].proposalUrl).toBe('https://example.com/p');
  });

  it('loaders refuse a principal without a Client Relationship', async () => {
    const client = await import('@/lib/portal-data/client');
    const staffOnly: PortalPrincipal = {
      ...principal,
      relationships: [{ type: 'staff', role: 'staff-member', status: 'active', accountName: 'NairobiX' }],
    };
    for (const loader of [
      client.getClientProfile,
      client.getClientProjects,
      client.getClientInvoices,
      client.getClientOnboarding,
      client.getClientServices,
      client.getClientProposals,
      client.getClientSignatureRequests,
      client.getClientMeetings,
    ]) {
      await expect(loader(staffOnly)).rejects.toThrow(/Client Relationship/);
    }
    expect(calls).toEqual([]);
  });

  it('a failing section is reported as unavailable, not thrown', async () => {
    const { settle } = await import('@/lib/portal-data/client');
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(settle(Promise.reject(new Error('Zoho 500')))).resolves.toEqual({ ok: false });
    await expect(settle(Promise.resolve([1]))).resolves.toEqual({ ok: true, data: [1] });
    quiet.mockRestore();
  });
});
