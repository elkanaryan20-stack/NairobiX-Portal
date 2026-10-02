/**
 * Client agenda rules: every "Needs attention", "What's next" and update item
 * must come from a CRM record with the matching status or date — and nothing
 * may appear without one.
 */

import { describe, expect, it } from 'vitest';
import { deriveActivity, deriveAttention, deriveUpcoming, nairobiToday, type AgendaInput } from '@/lib/portal-data/client-agenda';
import { safeUrl } from '@/lib/portal-data/zoho-mappers';
import type { Invoice, Project, ServiceRequest } from '@/lib/types';

const TODAY = '2026-10-02';

const empty = (): AgendaInput => ({
  today: TODAY,
  now: '2026-10-02T09:00:00.000Z',
  deals: [],
  projects: [],
  invoices: [],
  serviceRequests: [],
  proposals: [],
  signatureRequests: [],
  onboarding: [],
  meetings: [],
});

const invoice = (overrides: Partial<Invoice>): Invoice => ({
  id: 'inv-1',
  invoiceNumber: 'INV-1',
  amount: 50000,
  currency: 'KES',
  status: 'sent',
  issueDate: '2026-09-01',
  dueDate: '2026-10-20',
  items: [],
  ...overrides,
});

const project = (overrides: Partial<Project & { stageLabel?: string }>): Project & { stageLabel?: string } => ({
  id: 'eng-1',
  name: 'CRM rollout',
  description: '',
  status: 'planning',
  startDate: '',
  endDate: '',
  team: [],
  milestones: [],
  recentActivity: [],
  ...overrides,
});

const deal = {
  id: 'deal-1',
  name: 'Growth engagement',
  solutionFamilies: [],
  desiredOutcomes: [],
  scopeConfirmed: false,
  billingConfirmed: true,
};

describe('no records → no agenda', () => {
  it('produces no attention, upcoming or activity items from empty data', () => {
    expect(deriveAttention(empty())).toEqual([]);
    expect(deriveUpcoming(empty())).toEqual([]);
    expect(deriveActivity({ today: TODAY, invoices: [], serviceRequests: [], projects: [], documents: [], onboarding: [] })).toEqual([]);
  });

  it('a Not Started engagement with no dates creates no agenda item', () => {
    const input = { ...empty(), projects: [project({ stageLabel: 'Not Started' })] };
    expect(deriveAttention(input)).toEqual([]);
    expect(deriveUpcoming(input)).toEqual([]);
  });

  it('deal confirmation flags alone never create attention items', () => {
    const input = { ...empty(), deals: [{ ...deal, onboardingStatus: 'Not Started' }] };
    expect(deriveAttention(input)).toEqual([]);
  });
});

describe('needs attention', () => {
  it('overdue invoice', () => {
    const items = deriveAttention({ ...empty(), invoices: [invoice({ status: 'overdue', dueDate: '2026-09-15' })] });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ kind: 'invoice', href: '/portal/client/billing', date: '2026-09-15' });
  });

  it('paid and upcoming invoices are not attention items', () => {
    expect(deriveAttention({ ...empty(), invoices: [invoice({ status: 'paid' }), invoice({ id: 'i2', status: 'sent' })] })).toEqual([]);
  });

  it('signature requests awaiting the person, but not completed or declined ones', () => {
    const items = deriveAttention({
      ...empty(),
      signatureRequests: [
        { id: 's1', documentName: 'Service agreement', status: 'awaiting', sentDate: '2026-09-30' },
        { id: 's2', documentName: 'NDA', status: 'completed' },
        { id: 's3', documentName: 'Old', status: 'declined' },
      ],
    });
    expect(items.map((i) => i.id)).toEqual(['sign-s1']);
  });

  it('delivered proposals still valid; drafts, accepted and expired ones excluded', () => {
    const base = { amount: 0, currency: 'KES' };
    const items = deriveAttention({
      ...empty(),
      proposals: [
        { ...base, id: 'q1', name: 'Proposal', stage: 'Delivered', validTill: '2026-10-30' },
        { ...base, id: 'q2', name: 'Expired', stage: 'Delivered', validTill: '2026-09-01' },
        { ...base, id: 'q3', name: 'Accepted', stage: 'Closed Won' },
      ],
    });
    expect(items.map((i) => i.id)).toEqual(['quote-q1']);
  });

  it('engagements and onboarding only when the CRM status is "Awaiting Client"', () => {
    const items = deriveAttention({
      ...empty(),
      projects: [project({ id: 'e1', stageLabel: 'Awaiting Client', status: 'active' }), project({ id: 'e2', stageLabel: 'In Progress', status: 'active' })],
      deals: [{ ...deal, onboardingStatus: 'Awaiting Client' }, { ...deal, id: 'deal-2', onboardingStatus: 'In Progress' }],
    });
    expect(items.map((i) => i.id).sort()).toEqual(['eng-e1', 'onb-deal-1']);
  });

  it('only open high-priority support requests', () => {
    const request = (id: string, overrides: Partial<ServiceRequest>): ServiceRequest => ({
      id,
      title: id,
      description: '',
      status: 'submitted',
      createdDate: '2026-09-20',
      timeline: [],
      ...overrides,
    });
    const items = deriveAttention({
      ...empty(),
      serviceRequests: [request('a', { priority: 'high' }), request('b', { priority: 'high', status: 'resolved' }), request('c', { priority: 'low' })],
    });
    expect(items.map((i) => i.id)).toEqual(['case-a']);
  });
});

describe("what's next", () => {
  it('future meetings, due invoices and engagement dates, soonest first; past items excluded', () => {
    const items = deriveUpcoming({
      ...empty(),
      meetings: [
        { id: 'm1', title: 'Kickoff', start: '2026-10-05T07:00:00.000Z' },
        { id: 'm0', title: 'Past', start: '2026-09-01T07:00:00.000Z' },
      ],
      invoices: [invoice({ id: 'i1', dueDate: '2026-10-20' }), invoice({ id: 'i0', status: 'paid', dueDate: '2026-10-10' })],
      projects: [
        project({ id: 'p1', startDate: '2026-10-12' }),
        project({ id: 'p2', status: 'active', startDate: '2026-08-01', endDate: '2026-12-01' }),
        project({ id: 'p3', status: 'completed', endDate: '2026-12-31' }),
      ],
    });
    expect(items.map((i) => i.id)).toEqual(['meet-m1', 'start-p1', 'due-i1', 'end-p2']);
  });
});

describe('activity feed', () => {
  it('only dated events up to today, newest first', () => {
    const items = deriveActivity({
      today: TODAY,
      invoices: [invoice({ id: 'i1', issueDate: '2026-09-01' }), invoice({ id: 'i2', issueDate: '2026-11-01' })],
      serviceRequests: [],
      projects: [project({ id: 'p1', startDate: '2026-09-15' })],
      documents: [{ id: 'd1', name: 'Agreement', uploadDate: '2026-09-10', completedDate: '2026-09-12' }],
      onboarding: [],
    });
    expect(items.map((i) => i.id)).toEqual(['a-eng-p1', 'a-docdone-d1', 'a-inv-i1']);
  });
});

describe('helpers', () => {
  it('nairobiToday uses East Africa Time', () => {
    expect(nairobiToday(new Date('2026-10-01T22:30:00.000Z'))).toBe('2026-10-02');
  });

  it('safeUrl only allows https links from the CRM', () => {
    expect(safeUrl('https://proposals.nairobix.com/p/1')).toBe('https://proposals.nairobix.com/p/1');
    expect(safeUrl('http://example.com')).toBeUndefined();
    expect(safeUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeUrl('not a url')).toBeUndefined();
    expect(safeUrl(null)).toBeUndefined();
  });
});
