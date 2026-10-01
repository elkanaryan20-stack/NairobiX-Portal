/**
 * Staff Command Center data: active CRM User → staff-authorized operational
 * data across Accounts. Every loader re-checks the Staff Relationship, and
 * all reads are cached staff-wide (they are not personal data of the viewer).
 */

import { listRecords, type ZohoModuleKey } from '@/lib/crm/zoho/client';
import { ZOHO_VALUES, type ZohoRecord } from '@/lib/crm/zoho/schema';
import { isDemoMode } from '@/lib/crm/mode';
import {
  mockAllPartners,
  mockClientProfile,
  mockClientProjects,
  mockClientServiceRequests,
  mockPartnerApplications,
  mockStaffMetrics,
  mockStaffNeedsAttention,
} from '@/lib/mock-data';
import type { PortalPrincipal } from '@/lib/access/types';
import type { Project, ServiceRequest } from '@/lib/types';
import { cachedCrmRead } from './cache';
import { demoStaffConversations, type StaffConversation } from './demo-content';
import {
  caseToServiceRequest,
  day,
  engagementToProject,
  invoiceToView,
  isCancelledEngagement,
  lookupId,
  lookupName,
  multiPicklist,
  num,
  picklist,
  portalCurrency,
  signDocumentToView,
  text,
} from './zoho-mappers';

function assertStaff(principal: PortalPrincipal) {
  if (!principal.relationships.some((r) => r.type === 'staff')) {
    throw new Error('Staff data requested without an authorized Staff Relationship.');
  }
}

function staffList(module: ZohoModuleKey): Promise<ZohoRecord[]> {
  return cachedCrmRead(['staff', module], () => listRecords(module));
}

export interface StaffMetrics {
  activeClients: number;
  activeParticipants: number;
  activeEngagements: number;
  openCases: number;
  applicationsInReview: number;
  unpaidInvoices: number;
}

export interface AttentionItem {
  id: string;
  type: 'request' | 'participant' | 'invoice';
  title: string;
  description: string;
  date: string;
  href: string;
}

export interface StaffAccountRow {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  phone?: string;
  status?: string;
  clientSince?: string;
  activeEngagements: number;
}

export interface StaffParticipantRow {
  id: string;
  name: string;
  email?: string;
  participantNumber?: string;
  participationTypes: string[];
  participantStatus?: string;
  portalAccessStatus?: string;
  joined?: string;
}

export interface StaffInvoiceRow {
  id: string;
  client: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  dueDate: string;
}

export interface StaffApplicationRow {
  id: string;
  name: string;
  email?: string;
  status?: string;
  applicantType?: string;
  contributionAreas: string[];
  applicationNumber?: string;
  applied: string;
}

export interface StaffTaskRow {
  id: string;
  title: string;
  status?: string;
  dueDate: string;
  relatedTo?: string;
}

export interface StaffDocumentRow {
  id: string;
  name: string;
  status?: string;
  sent: string;
  relatedTo?: string;
}

export interface StaffCampaignRow {
  id: string;
  name: string;
  type?: string;
  status?: string;
  startDate: string;
  endDate: string;
}

const ACTIVE_ENGAGEMENT = new Set<Project['status']>(['active']);
const OPEN_APPLICATION = new Set(['Submitted', 'Under Review', 'More Information Required', 'Qualified']);

function closedWonAccountIds(deals: ZohoRecord[]): Map<string, string> {
  // Account id → earliest Closed Won close date
  const accounts = new Map<string, string>();
  for (const deal of deals) {
    if (deal.Stage !== ZOHO_VALUES.dealClosedWon) continue;
    const accountId = lookupId(deal.Account_Name);
    if (!accountId) continue;
    const closed = day(deal.Closing_Date);
    const current = accounts.get(accountId);
    if (current === undefined || (closed && (!current || closed < current))) accounts.set(accountId, closed);
  }
  return accounts;
}

export async function getStaffOverview(principal: PortalPrincipal): Promise<{ metrics: StaffMetrics; attention: AttentionItem[] }> {
  assertStaff(principal);

  if (isDemoMode()) {
    const links: Record<string, string> = {
      request: '/portal/staff/support',
      partner: '/portal/staff/pipeline',
      referral: '/portal/staff/pipeline',
      invoice: '/portal/staff/billing',
    };
    return {
      metrics: {
        activeClients: mockStaffMetrics.activeClients,
        activeParticipants: mockStaffMetrics.activePartners,
        activeEngagements: mockStaffMetrics.activeProjects,
        openCases: mockStaffMetrics.openRequests,
        applicationsInReview: mockStaffMetrics.newReferrals,
        unpaidInvoices: mockStaffMetrics.pendingInvoices,
      },
      attention: mockStaffNeedsAttention.map((a) => ({
        id: a.id,
        type: a.type === 'invoice' ? 'invoice' : a.type === 'request' ? 'request' : 'participant',
        title: a.title,
        description: a.description,
        date: a.date,
        href: links[a.type] ?? '/portal/staff',
      })),
    };
  }

  const [deals, participants, engagements, cases, applications, invoices] = await Promise.all([
    staffList('deals'),
    staffList('participants'),
    staffList('engagements'),
    staffList('cases'),
    staffList('applications'),
    staffList('invoices'),
  ]);

  const caseViews = cases.map(caseToServiceRequest);
  const invoiceViews = invoices.filter((i) => picklist(i.Status) !== 'Cancelled').map(invoiceToView);
  const openApplications = applications.filter((a) => OPEN_APPLICATION.has(picklist(a.Application_Status) ?? ''));

  const attention: AttentionItem[] = [
    ...caseViews
      .filter((c) => c.status !== 'resolved' && (c.priority === 'high' || c.status === 'in-progress'))
      .map((c) => ({
        id: `case-${c.id}`,
        type: 'request' as const,
        title: c.title,
        description: [c.accountName, c.priority ? `${c.priority} priority` : undefined].filter(Boolean).join(' · '),
        date: c.createdDate,
        href: '/portal/staff/support',
      })),
    ...openApplications.map((a) => ({
      id: `app-${a.id}`,
      type: 'participant' as const,
      title: `Opportunity Network application · ${picklist(a.Application_Status)}`,
      description: text(a.Name) ?? [text(a.First_Name), text(a.Last_Name)].filter(Boolean).join(' '),
      date: day(a.Created_Time),
      href: '/portal/staff/pipeline',
    })),
    ...invoiceViews
      .filter((i) => i.status === 'overdue')
      .map((i) => ({
        id: `inv-${i.id}`,
        type: 'invoice' as const,
        title: `Invoice ${i.invoiceNumber} overdue`,
        description: i.accountName ?? '',
        date: i.dueDate,
        href: '/portal/staff/billing',
      })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return {
    metrics: {
      activeClients: closedWonAccountIds(deals).size,
      activeParticipants: participants.filter((p) => p.Participant_Status === ZOHO_VALUES.participantActive).length,
      activeEngagements: engagements.map(engagementToProject).filter((e) => ACTIVE_ENGAGEMENT.has(e.status)).length,
      openCases: caseViews.filter((c) => c.status !== 'resolved').length,
      applicationsInReview: openApplications.length,
      unpaidInvoices: invoiceViews.filter((i) => i.status !== 'paid' && i.status !== 'draft').length,
    },
    attention,
  };
}

export async function getStaffAccounts(
  principal: PortalPrincipal
): Promise<{ clients: StaffAccountRow[]; participants: StaffParticipantRow[] }> {
  assertStaff(principal);

  if (isDemoMode()) {
    return {
      clients: [
        {
          id: mockClientProfile.id,
          name: mockClientProfile.businessName,
          industry: mockClientProfile.industry,
          location: mockClientProfile.location,
          phone: mockClientProfile.phone,
          status: mockClientProfile.partnershipStatus,
          clientSince: mockClientProfile.partnershipStartDate,
          activeEngagements: mockClientProjects.filter((p) => p.status === 'active').length,
        },
      ],
      participants: mockAllPartners.map((p) => ({
        id: p.id,
        name: p.businessName,
        email: p.email,
        participationTypes: [p.partnerType],
        participantStatus: p.partnerStatus,
        joined: p.joinDate,
      })),
    };
  }

  const [accounts, deals, engagements, participants] = await Promise.all([
    staffList('accounts'),
    staffList('deals'),
    staffList('engagements'),
    staffList('participants'),
  ]);

  const clientAccounts = closedWonAccountIds(deals);
  const activeByAccount = new Map<string, number>();
  for (const e of engagements) {
    const accountId = lookupId(e.Account);
    if (accountId && !isCancelledEngagement(e) && engagementToProject(e).status === 'active') {
      activeByAccount.set(accountId, (activeByAccount.get(accountId) ?? 0) + 1);
    }
  }

  return {
    clients: accounts
      .filter((a) => clientAccounts.has(a.id))
      .map((a) => ({
        id: a.id,
        name: text(a.Account_Name) ?? 'Account',
        industry: picklist(a.Industry),
        location: text(a.Billing_City),
        phone: text(a.Phone),
        status: picklist(a.Account_Status),
        clientSince: clientAccounts.get(a.id) || undefined,
        activeEngagements: activeByAccount.get(a.id) ?? 0,
      })),
    participants: participants.map((p) => ({
      id: p.id,
      name: text(p.Name) ?? lookupName(p.Contact) ?? 'Participant',
      email: text(p.Email),
      participantNumber: text(String(p.Participant_ID ?? '')),
      participationTypes: multiPicklist(p.Participation_Type),
      participantStatus: picklist(p.Participant_Status),
      portalAccessStatus: picklist(p.Portal_Access_Status),
      joined: day(p.Created_Time) || undefined,
    })),
  };
}

export async function getStaffEngagements(principal: PortalPrincipal): Promise<(Project & { accountName?: string })[]> {
  assertStaff(principal);
  if (isDemoMode()) return mockClientProjects.map((p) => ({ ...p, accountName: mockClientProfile.businessName }));
  return (await staffList('engagements')).filter((e) => !isCancelledEngagement(e)).map(engagementToProject);
}

export async function getStaffTasks(principal: PortalPrincipal): Promise<StaffTaskRow[]> {
  assertStaff(principal);
  if (isDemoMode()) {
    return mockClientProjects.flatMap((p) =>
      p.milestones.map((m) => ({ id: m.id, title: m.name, status: m.status, dueDate: m.dueDate, relatedTo: p.name }))
    );
  }
  return (await staffList('tasks')).map((t) => ({
    id: t.id,
    title: text(t.Subject) ?? 'Task',
    status: picklist(t.Status),
    dueDate: day(t.Due_Date),
    relatedTo: lookupName(t.What_Id),
  }));
}

export async function getStaffCases(principal: PortalPrincipal): Promise<(ServiceRequest & { accountName?: string })[]> {
  assertStaff(principal);
  if (isDemoMode()) return mockClientServiceRequests.map((r) => ({ ...r, accountName: mockClientProfile.businessName }));
  return (await staffList('cases')).map(caseToServiceRequest).sort((a, b) => b.createdDate.localeCompare(a.createdDate));
}

export async function getStaffInvoices(principal: PortalPrincipal): Promise<StaffInvoiceRow[]> {
  assertStaff(principal);
  if (isDemoMode()) {
    return [
      { id: 'inv1', client: 'TechVision Ltd', invoiceNumber: 'INV-inv1', amount: 450000, currency: 'KES', status: 'paid', date: '2024-02-15', dueDate: '2024-03-15' },
      { id: 'inv2', client: 'RetailMax Solutions', invoiceNumber: 'INV-inv2', amount: 320000, currency: 'KES', status: 'pending', date: '2024-03-01', dueDate: '2024-04-01' },
      { id: 'inv3', client: 'HealthTech Kenya', invoiceNumber: 'INV-inv3', amount: 280000, currency: 'KES', status: 'overdue', date: '2024-01-15', dueDate: '2024-02-15' },
    ];
  }
  return (await staffList('invoices'))
    .filter((i) => picklist(i.Status) !== 'Cancelled')
    .map(invoiceToView)
    .map((i) => ({
      id: i.id,
      client: i.accountName ?? '—',
      invoiceNumber: i.invoiceNumber,
      amount: i.amount,
      currency: i.currency,
      status: i.status,
      date: i.issueDate,
      dueDate: i.dueDate,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getStaffApplications(principal: PortalPrincipal): Promise<StaffApplicationRow[]> {
  assertStaff(principal);
  if (isDemoMode()) {
    return mockPartnerApplications.map((a) => ({
      id: a.id,
      name: a.businessName,
      email: a.email,
      status: a.status,
      applicantType: a.partnerType,
      contributionAreas: [],
      applied: a.applicationDate,
    }));
  }
  return (await staffList('applications'))
    .map((a) => ({
      id: a.id,
      name: text(a.Name) ?? ([text(a.First_Name), text(a.Last_Name)].filter(Boolean).join(' ') || 'Application'),
      email: text(a.Email),
      status: picklist(a.Application_Status),
      applicantType: picklist(a.Applicant_Type),
      contributionAreas: multiPicklist(a.Contribution_Areas),
      applicationNumber: text(String(a.Application_ID ?? '')),
      applied: day(a.Created_Time),
    }))
    .sort((a, b) => b.applied.localeCompare(a.applied));
}

export async function getStaffDocuments(principal: PortalPrincipal): Promise<StaffDocumentRow[]> {
  assertStaff(principal);
  if (isDemoMode()) return [];
  return (await staffList('signDocuments')).map((d) => {
    const view = signDocumentToView(d);
    return {
      id: view.id,
      name: view.name,
      status: view.signingStatus,
      sent: view.uploadDate,
      relatedTo: lookupName(d.zohosign__Account) ?? lookupName(d.zohosign__Contact),
    };
  });
}

export async function getStaffCampaigns(principal: PortalPrincipal): Promise<StaffCampaignRow[]> {
  assertStaff(principal);
  if (isDemoMode()) return [];
  return (await staffList('campaigns')).map((c) => ({
    id: c.id,
    name: text(c.Campaign_Name) ?? 'Campaign',
    type: picklist(c.Type),
    status: picklist(c.Status),
    startDate: day(c.Start_Date),
    endDate: day(c.End_Date),
  }));
}

/** Demo only: no messaging source exists in the CRM. */
export function getStaffConversations(principal: PortalPrincipal): StaffConversation[] {
  assertStaff(principal);
  return isDemoMode() ? demoStaffConversations : [];
}

export interface StaffReportMetrics {
  closedWonValue: number;
  closedWonDeals: number;
  paidInvoices: number;
  outstandingInvoices: number;
  activeEngagements: number;
  activeParticipants: number;
  currency: string;
}

export async function getStaffReportMetrics(principal: PortalPrincipal): Promise<StaffReportMetrics | null> {
  assertStaff(principal);
  if (isDemoMode()) return null;
  const [deals, invoices, engagements, participants] = await Promise.all([
    staffList('deals'),
    staffList('invoices'),
    staffList('engagements'),
    staffList('participants'),
  ]);
  const won = deals.filter((d) => d.Stage === ZOHO_VALUES.dealClosedWon);
  const invoiceViews = invoices.filter((i) => picklist(i.Status) !== 'Cancelled' && picklist(i.Status) !== 'Created').map(invoiceToView);
  return {
    closedWonValue: won.reduce((sum, d) => sum + num(d.Amount), 0),
    closedWonDeals: won.length,
    paidInvoices: invoiceViews.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    outstandingInvoices: invoiceViews.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0),
    activeEngagements: engagements.map(engagementToProject).filter((e) => e.status === 'active').length,
    activeParticipants: participants.filter((p) => p.Participant_Status === ZOHO_VALUES.participantActive).length,
    currency: portalCurrency(),
  };
}

