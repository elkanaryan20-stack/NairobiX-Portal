/**
 * Client agenda: "Needs attention", "What's next" and recent updates,
 * derived only from records already loaded for the client's Account or
 * Contact. Pure functions — no I/O — so every item can be traced to a CRM
 * record and the rules are unit-tested (tests/client-agenda.test.ts).
 *
 * Nothing here schedules, estimates or invents: an item exists only when a
 * record with the relevant status or date exists.
 */

import { formatCurrency } from '@/lib/utils';
import type { Invoice, Project, ServiceRequest } from '@/lib/types';
import type {
  ClientDealView,
  ClientMeetingView,
  ClientOnboardingView,
  ClientProposalView,
  ClientSignatureRequest,
} from './client';

export type AgendaKind = 'invoice' | 'signature' | 'proposal' | 'engagement' | 'onboarding' | 'meeting' | 'request' | 'document';

export interface AgendaItem {
  id: string;
  kind: AgendaKind;
  /** What */
  title: string;
  /** Why it matters / context */
  detail: string;
  /** When (YYYY-MM-DD or ISO date-time) */
  date?: string;
  /** How the date relates to the item, e.g. "Due", "Starts". */
  dateLabel?: string;
  /** Action */
  href?: string;
  actionLabel?: string;
}

export interface AgendaInput {
  today: string; // YYYY-MM-DD in Nairobi time
  now: string; // ISO timestamp
  deals: ClientDealView[];
  projects: (Project & { stageLabel?: string })[];
  invoices: Invoice[];
  serviceRequests: ServiceRequest[];
  proposals: ClientProposalView[];
  signatureRequests: ClientSignatureRequest[];
  onboarding: ClientOnboardingView[];
  meetings: ClientMeetingView[];
}

/** Today's date in Nairobi (EAT), as YYYY-MM-DD. */
export function nairobiToday(at: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
}

const fmtDay = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Things the client needs to act on now. */
export function deriveAttention(input: AgendaInput): AgendaItem[] {
  const items: AgendaItem[] = [];

  for (const request of input.signatureRequests.filter((s) => s.status === 'awaiting')) {
    items.push({
      id: `sign-${request.id}`,
      kind: 'signature',
      title: 'Signature requested',
      detail: `“${request.documentName}” is waiting for your signature. Open the Zoho Sign email sent to you to review and sign.`,
      date: request.sentDate,
      dateLabel: 'Sent',
      href: '/portal/client/resources',
      actionLabel: 'View documents',
    });
  }

  for (const invoice of input.invoices.filter((i) => i.status === 'overdue')) {
    items.push({
      id: `inv-${invoice.id}`,
      kind: 'invoice',
      title: `Invoice ${invoice.invoiceNumber} is overdue`,
      detail: `${formatCurrency(invoice.amount, invoice.currency)} was due${invoice.dueDate ? ` on ${fmtDay(invoice.dueDate)}` : ''}.`,
      date: invoice.dueDate || undefined,
      dateLabel: 'Was due',
      href: '/portal/client/billing',
      actionLabel: 'View billing',
    });
  }

  for (const proposal of input.proposals.filter((p) => p.stage === 'Delivered' && (!p.validTill || p.validTill >= input.today))) {
    items.push({
      id: `quote-${proposal.id}`,
      kind: 'proposal',
      title: 'Proposal awaiting your response',
      detail: `“${proposal.name}” has been sent to you for review.`,
      date: proposal.validTill,
      dateLabel: 'Valid until',
      href: '/portal/client/resources',
      actionLabel: 'View proposals',
    });
  }

  for (const project of input.projects.filter((p) => p.stageLabel === 'Awaiting Client')) {
    items.push({
      id: `eng-${project.id}`,
      kind: 'engagement',
      title: `${project.name} is waiting on your input`,
      detail: 'NairobiX needs something from your team to keep this engagement moving.',
      href: '/portal/client/work',
      actionLabel: 'View work',
    });
  }

  for (const deal of input.deals.filter((d) => d.onboardingStatus === 'Awaiting Client')) {
    items.push({
      id: `onb-${deal.id}`,
      kind: 'onboarding',
      title: 'Onboarding is waiting on your input',
      detail: `NairobiX needs information from your team to continue onboarding for ${deal.name}.`,
      href: '/portal/client/support',
      actionLabel: 'Contact NairobiX',
    });
  }

  for (const request of input.serviceRequests.filter((r) => r.status !== 'resolved' && (r.priority === 'high' || r.priority === 'urgent'))) {
    items.push({
      id: `case-${request.id}`,
      kind: 'request',
      title: request.title,
      detail: 'High-priority support request in progress with NairobiX.',
      date: request.createdDate || undefined,
      dateLabel: 'Opened',
      href: '/portal/client/support',
      actionLabel: 'View request',
    });
  }

  return items;
}

/** Dated upcoming items, soonest first. */
export function deriveUpcoming(input: AgendaInput): AgendaItem[] {
  const items: AgendaItem[] = [];

  for (const meeting of input.meetings.filter((m) => m.start >= input.now)) {
    items.push({
      id: `meet-${meeting.id}`,
      kind: 'meeting',
      title: meeting.title,
      detail: meeting.venue ? `Meeting · ${meeting.venue}` : 'Meeting with NairobiX',
      date: meeting.start,
      dateLabel: 'Scheduled',
    });
  }

  for (const invoice of input.invoices.filter((i) => (i.status === 'sent' || i.status === 'viewed') && i.dueDate && i.dueDate >= input.today)) {
    items.push({
      id: `due-${invoice.id}`,
      kind: 'invoice',
      title: `Invoice ${invoice.invoiceNumber} due`,
      detail: formatCurrency(invoice.amount, invoice.currency),
      date: invoice.dueDate,
      dateLabel: 'Due',
      href: '/portal/client/billing',
    });
  }

  for (const project of input.projects.filter((p) => p.status !== 'completed')) {
    if (project.startDate && project.startDate > input.today) {
      items.push({ id: `start-${project.id}`, kind: 'engagement', title: `${project.name} begins`, detail: 'Engagement start', date: project.startDate, dateLabel: 'Starts', href: '/portal/client/work' });
    } else if (project.endDate && project.endDate >= input.today) {
      items.push({ id: `end-${project.id}`, kind: 'engagement', title: project.name, detail: 'Target completion', date: project.endDate, dateLabel: 'Target', href: '/portal/client/work' });
    }
  }

  for (const deal of input.deals.filter((d) => d.onboardingStart && d.onboardingStart > input.today)) {
    items.push({ id: `onbstart-${deal.id}`, kind: 'onboarding', title: 'Onboarding begins', detail: deal.name, date: deal.onboardingStart, dateLabel: 'Starts' });
  }

  return items.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
}

export interface ActivityInput {
  today: string;
  invoices: Invoice[];
  serviceRequests: ServiceRequest[];
  projects: Project[];
  documents: { id: string; name: string; uploadDate: string; completedDate?: string }[];
  onboarding: ClientOnboardingView[];
}

/** Recent dated events on the Account, newest first (the client's update feed). */
export function deriveActivity(input: ActivityInput, limit = 30): AgendaItem[] {
  const items: AgendaItem[] = [];
  const past = (d?: string) => !!d && d.slice(0, 10) <= input.today;

  for (const invoice of input.invoices) {
    if (past(invoice.issueDate)) {
      items.push({ id: `a-inv-${invoice.id}`, kind: 'invoice', title: `Invoice ${invoice.invoiceNumber} issued`, detail: formatCurrency(invoice.amount, invoice.currency), date: invoice.issueDate, href: '/portal/client/billing' });
    }
  }
  for (const doc of input.documents) {
    if (past(doc.completedDate)) {
      items.push({ id: `a-docdone-${doc.id}`, kind: 'document', title: `Document completed`, detail: doc.name, date: doc.completedDate, href: '/portal/client/resources' });
    } else if (past(doc.uploadDate)) {
      items.push({ id: `a-doc-${doc.id}`, kind: 'document', title: `Document sent for signature`, detail: doc.name, date: doc.uploadDate, href: '/portal/client/resources' });
    }
  }
  for (const request of input.serviceRequests) {
    if (past(request.createdDate)) {
      items.push({ id: `a-case-${request.id}`, kind: 'request', title: 'Support request opened', detail: request.title, date: request.createdDate, href: '/portal/client/support' });
    }
  }
  for (const project of input.projects) {
    if (past(project.startDate)) {
      items.push({ id: `a-eng-${project.id}`, kind: 'engagement', title: 'Engagement started', detail: project.name, date: project.startDate, href: '/portal/client/work' });
    }
  }
  for (const record of input.onboarding) {
    if (past(record.completionDate)) {
      items.push({ id: `a-onbdone-${record.id}`, kind: 'onboarding', title: 'Onboarding completed', detail: record.name, date: record.completionDate });
    } else if (past(record.startDate)) {
      items.push({ id: `a-onb-${record.id}`, kind: 'onboarding', title: 'Onboarding started', detail: record.name, date: record.startDate });
    }
  }

  return items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, limit);
}
