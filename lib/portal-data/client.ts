/**
 * Client workspace data: Contact → Account → Account-scoped CRM records.
 *
 * Every read is keyed by the Account of the principal's server-resolved
 * Client Relationship — never by anything from the request — so one client
 * can never load another's records. Sections with no authoritative CRM
 * source are returned empty in production and render a not-yet-available
 * state; the demo values exist only in local development.
 */

import { criteriaValue, getRecord, searchRecords } from '@/lib/crm/zoho/client';
import { ZOHO_VALUES } from '@/lib/crm/zoho/schema';
import { isDemoMode } from '@/lib/crm/mode';
import {
  mockClientBenefits,
  mockClientCampaigns,
  mockClientDocuments,
  mockClientInsights,
  mockClientInvoices,
  mockClientLeads,
  mockClientNotifications,
  mockClientPerformanceMetrics,
  mockClientProfile,
  mockClientProjects,
  mockClientReports,
  mockClientServiceRequests,
  mockClientTasks,
  mockGrowthPhases,
} from '@/lib/mock-data';
import type { PortalPrincipal, Relationship } from '@/lib/access/types';
import type {
  Benefit,
  ClientCampaign,
  ClientLead,
  ClientTask,
  Document,
  GrowthInsight,
  GrowthPhase,
  Invoice,
  Notification,
  PerformanceMetric,
  Project,
  Report,
  ServiceRequest,
} from '@/lib/types';
import { cachedCrmRead } from './cache';
import {
  caseToServiceRequest,
  day,
  engagementToProject,
  invoiceToView,
  isCancelledEngagement,
  isClientVisibleInvoice,
  picklist,
  signDocumentToView,
  text,
} from './zoho-mappers';

export interface ClientProfileView {
  accountId: string;
  businessName: string;
  industry?: string;
  location?: string;
  phone?: string;
  website?: string;
  /** Close date of the earliest Closed Won Deal that authorizes this Client. */
  clientSince?: string;
  contactId?: string;
  contactName: string;
  contactEmail: string;
}

/** Client sections with no authoritative CRM source yet: always empty in production. */
export interface ClientUnsourcedData {
  tasks: ClientTask[];
  campaigns: ClientCampaign[];
  leads: ClientLead[];
  insights: GrowthInsight[];
  metrics: PerformanceMetric[];
  reports: Report[];
  growthPhases: GrowthPhase[];
  notifications: Notification[];
  benefits: Benefit[];
  /** Demo-only narrative status. */
  growthPulse?: string;
}

function clientRelationship(principal: PortalPrincipal): Relationship & { accountId: string } {
  const relationship = principal.relationships.find((r) => r.type === 'client' && r.accountId);
  if (!relationship?.accountId) throw new Error('Client data requested without an authorized Client Relationship.');
  return relationship as Relationship & { accountId: string };
}

function byAccount(field: string, accountId: string) {
  return `(${field}:equals:${criteriaValue(accountId)})`;
}

export async function getClientProfile(principal: PortalPrincipal): Promise<ClientProfileView> {
  const relationship = clientRelationship(principal);

  if (isDemoMode()) {
    return {
      accountId: relationship.accountId,
      businessName: mockClientProfile.businessName,
      industry: mockClientProfile.industry,
      location: mockClientProfile.location,
      phone: mockClientProfile.phone,
      clientSince: mockClientProfile.partnershipStartDate,
      contactId: principal.contactId,
      contactName: principal.name,
      contactEmail: principal.email,
    };
  }

  const { accountId } = relationship;
  const dealIds = new Set(relationship.dealIds ?? []);
  const account = await cachedCrmRead(['client', accountId, 'account'], async () => {
    const [record, deals] = await Promise.all([
      getRecord('accounts', accountId),
      searchRecords(
        'deals',
        `(${byAccount('Account_Name', accountId)}and(Stage:equals:${criteriaValue(ZOHO_VALUES.dealClosedWon)}))`
      ),
    ]);
    return {
      name: text(record?.Account_Name),
      industry: picklist(record?.Industry),
      location: text(record?.Billing_City),
      phone: text(record?.Phone),
      website: text(record?.Website),
      deals: deals.map((d) => ({ id: d.id, closingDate: day(d.Closing_Date) })),
    };
  });

  const authorizingDates = account.deals
    .filter((d) => dealIds.has(d.id) && d.closingDate)
    .map((d) => d.closingDate)
    .sort();

  return {
    accountId,
    businessName: account.name ?? relationship.accountName,
    industry: account.industry,
    location: account.location,
    phone: account.phone,
    website: account.website,
    clientSince: authorizingDates[0],
    contactId: principal.contactId,
    contactName: principal.name,
    contactEmail: principal.email,
  };
}

export async function getClientProjects(principal: PortalPrincipal): Promise<Project[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return mockClientProjects;
  return cachedCrmRead(['client', accountId, 'engagements'], async () =>
    (await searchRecords('engagements', byAccount('Account', accountId)))
      .filter((r) => !isCancelledEngagement(r))
      .map(engagementToProject)
  );
}

export async function getClientInvoices(principal: PortalPrincipal): Promise<Invoice[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return mockClientInvoices;
  return cachedCrmRead(['client', accountId, 'invoices'], async () =>
    (await searchRecords('invoices', byAccount('Account_Name', accountId)))
      .filter(isClientVisibleInvoice)
      .map(invoiceToView)
      .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
  );
}

export async function getClientServiceRequests(principal: PortalPrincipal): Promise<ServiceRequest[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return mockClientServiceRequests;
  return cachedCrmRead(['client', accountId, 'cases'], async () =>
    (await searchRecords('cases', byAccount('Account_Name', accountId)))
      .map(caseToServiceRequest)
      .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
  );
}

export async function getClientDocuments(principal: PortalPrincipal): Promise<Document[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return mockClientDocuments;
  return cachedCrmRead(['client', accountId, 'documents'], async () =>
    (await searchRecords('signDocuments', byAccount('zohosign__Account', accountId))).map(signDocumentToView)
  );
}

export function getClientUnsourced(principal: PortalPrincipal): ClientUnsourcedData {
  clientRelationship(principal);
  if (!isDemoMode()) {
    return {
      tasks: [],
      campaigns: [],
      leads: [],
      insights: [],
      metrics: [],
      reports: [],
      growthPhases: [],
      notifications: [],
      benefits: [],
    };
  }
  return {
    tasks: mockClientTasks,
    campaigns: mockClientCampaigns,
    leads: mockClientLeads,
    insights: mockClientInsights,
    metrics: mockClientPerformanceMetrics,
    reports: mockClientReports,
    growthPhases: mockGrowthPhases,
    notifications: mockClientNotifications,
    benefits: mockClientBenefits,
    growthPulse:
      'Your current growth initiatives are progressing according to plan. CRM implementation is 72% complete, and lead quality has improved 24%.',
  };
}
