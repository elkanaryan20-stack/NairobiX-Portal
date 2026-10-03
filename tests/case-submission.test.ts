import { describe, expect, it, vi } from 'vitest';
import type { PortalPrincipal } from '@/lib/access/types';

vi.mock('@/lib/crm/zoho/client', () => ({
  criteriaValue: (value: string) => value,
  searchRecords: vi.fn(async () => []),
}));

import { CaseSubmissionError, guardAndDeduplicate, parseCaseSubmission, zohoCaseFields } from '@/lib/support/case-submission';

const principal: PortalPrincipal = {
  contactId: 'contact-1',
  name: 'Client Contact',
  email: 'client@example.test',
  relationships: [{
    type: 'client', role: 'client-contact', status: 'active', accountId: 'account-1', accountName: 'Client Account', dealIds: ['deal-1'],
  }],
  permissions: ['client.support'],
};

const validInput = {
  type: 'system-request', subject: 'Update access', description: 'Please update access for the team.', priority: 'High',
};

describe('Case submission validation and server field assembly', () => {
  it('accepts only the specified browser values and normalizes text', () => {
    expect(parseCaseSubmission({ ...validInput, subject: '  Update access  ', dealId: 'deal-1' })).toEqual({
      ...validInput, subject: 'Update access', dealId: 'deal-1',
    });
  });

  it.each([
    [{ ...validInput, Account_Name: { id: 'attacker-account' } }],
    [{ ...validInput, Owner: { id: 'attacker-owner' } }],
    [{ ...validInput, Case_Reason: 'Other' }],
    [{ ...validInput, Internal_Comments: 'forged' }],
    [{ ...validInput, type: 'toString' }],
  ])('rejects unexpected or invalid input fields', (payload) => {
    expect(() => parseCaseSubmission(payload)).toThrow(CaseSubmissionError);
  });

  it('requires valid subject, description, priority, type, and optional deal ID', () => {
    expect(() => parseCaseSubmission({ ...validInput, subject: ' ' })).toThrow(/subject/i);
    expect(() => parseCaseSubmission({ ...validInput, description: ' ' })).toThrow(/description/i);
    expect(() => parseCaseSubmission({ ...validInput, priority: 'Critical' })).toThrow(/priority/i);
    expect(() => parseCaseSubmission({ ...validInput, type: 'Unknown' })).toThrow(/type/i);
    expect(() => parseCaseSubmission({ ...validInput, dealId: 'invalid deal id' })).toThrow(/engagement/i);
  });

  it('derives identity and ownership scope server-side and omits internal fields', () => {
    const input = parseCaseSubmission({ ...validInput, dealId: 'deal-1' });
    const fields = zohoCaseFields(principal, input);
    expect(fields).toMatchObject({
      Subject: validInput.subject,
      Description: validInput.description,
      Type: 'System Request',
      Priority: 'High',
      Account_Name: { id: 'account-1' },
      Related_To: { id: 'contact-1' },
      Email: principal.email,
      Reported_By: 'Client Contact',
      Deal_Name: { id: 'deal-1' },
      Case_Origin: 'Portal',
      Status: 'New',
    });
    expect(fields).not.toHaveProperty('Owner');
    expect(fields).not.toHaveProperty('Case_Reason');
    expect(fields).not.toHaveProperty('Internal_Comments');
  });

  it('rejects a deal outside the freshly resolved client relationship', () => {
    expect(() => zohoCaseFields(principal, parseCaseSubmission({ ...validInput, dealId: 'deal-2' }))).toThrow(/not available/i);
  });

  it('deduplicates retries after a successful creation', async () => {
    const create = vi.fn(async () => ({ id: 'case-1' }));
    const input = parseCaseSubmission({ ...validInput, subject: 'retry-dedup-test' });
    await expect(guardAndDeduplicate(principal, input, create)).resolves.toMatchObject({ duplicate: false, record: { id: 'case-1' } });
    await expect(guardAndDeduplicate(principal, input, create)).resolves.toMatchObject({ duplicate: true, record: { id: 'case-1' } });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('rate limits a Client after five submissions in the window', async () => {
    const ratePrincipal: PortalPrincipal = {
      ...principal,
      contactId: 'rate-contact',
      relationships: [{ type: 'client', role: 'client-contact', status: 'active', accountId: 'rate-account', accountName: 'Rate Account' }],
    };
    const create = vi.fn(async () => ({ id: 'rate-case' }));
    for (let index = 0; index < 5; index++) {
      await guardAndDeduplicate(ratePrincipal, parseCaseSubmission({ ...validInput, subject: `rate-test-${index}` }), create);
    }
    await expect(guardAndDeduplicate(ratePrincipal, parseCaseSubmission({ ...validInput, subject: 'rate-test-over-limit' }), create))
      .rejects.toMatchObject({ status: 429 });
    expect(create).toHaveBeenCalledTimes(5);
  });
});
