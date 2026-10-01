/**
 * Read-only smoke test against the live NairobiX Zoho CRM.
 *
 * Verifies that every query the Portal issues is accepted by Zoho (search
 * criteria syntax, lookup filters, field lists) and that the real directory
 * resolves identities. Prints no record data or credentials. Run with
 * `npm run test:zoho-live`; it never creates, updates or deletes records.
 */

import { describe, expect, it } from 'vitest';
import { createZohoDirectory } from '@/lib/access/zoho-directory';
import { resolveAccess } from '@/lib/access/resolve';
import { criteriaValue, getRecord, listActiveUsers, listRecords, searchRecords } from '@/lib/crm/zoho/client';

const NO_SUCH_ID = '1';

describe('live Zoho CRM (read-only)', () => {
  it('lists every module the Portal reads', async () => {
    for (const module of [
      'contacts',
      'accounts',
      'deals',
      'participants',
      'applications',
      'engagements',
      'cases',
      'invoices',
      'tasks',
      'campaigns',
      'signDocuments',
    ] as const) {
      await expect(listRecords(module), module).resolves.toBeInstanceOf(Array);
    }
  });

  it('accepts every search the Portal issues', async () => {
    const id = criteriaValue(NO_SUCH_ID);
    const searches: [Parameters<typeof searchRecords>[0], string][] = [
      ['contacts', `(Email:equals:${criteriaValue('portal-smoke-test@example.invalid')})`],
      ['deals', `((Account_Name:equals:${id})and(Stage:equals:Closed Won))`],
      ['participants', `(Contact:equals:${id})`],
      ['engagements', `(Account:equals:${id})`],
      ['cases', `(Account_Name:equals:${id})`],
      ['invoices', `(Account_Name:equals:${id})`],
      ['signDocuments', `(zohosign__Account:equals:${id})`],
      ['signDocuments', `(zohosign__Contact:equals:${id})`],
    ];
    for (const [module, criteria] of searches) {
      await expect(searchRecords(module, criteria), `${module} ${criteria}`).resolves.toEqual([]);
    }
  });

  it('reads Accounts and Participants by id', async () => {
    const [account] = await listRecords('accounts');
    if (account) expect((await getRecord('accounts', account.id))?.id).toBe(account.id);
    const [participant] = await listRecords('participants');
    if (participant) expect((await getRecord('participants', participant.id))?.id).toBe(participant.id);
  });

  it('an unknown email resolves to no access', async () => {
    const result = await resolveAccess(
      { subject: 'smoke', provider: 'test', email: 'portal-smoke-test@example.invalid', emailVerified: true },
      createZohoDirectory()
    );
    expect(result.state).toBe('no-access');
  });

  it('an active CRM User resolves to Staff', async () => {
    const [user] = await listActiveUsers();
    expect(user, 'at least one active CRM user').toBeDefined();
    const result = await resolveAccess(
      { subject: 'smoke', provider: 'test', email: user.email, emailVerified: true },
      createZohoDirectory()
    );
    expect(result.state).toBe('authorized');
    if (result.state === 'authorized') {
      expect(result.principal.relationships.map((r) => r.type)).toContain('staff');
    }
  });
});
