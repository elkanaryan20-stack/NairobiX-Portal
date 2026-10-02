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
  lookupName,
  multiPicklist,
  num,
  picklist,
  portalCurrency,
  safeUrl,
  signDocumentToView,
  text,
} from './zoho-mappers';

/** A Closed Won Deal that authorizes this Client's Portal access — "what NairobiX was engaged to do". */
export interface ClientDealView {
  id: string;
  name: string;
  closedOn?: string;
  solutionFamilies: string[];
  desiredOutcomes: string[];
  onboardingStatus?: string;
  onboardingStart?: string;
  scopeConfirmed: boolean;
  billingConfirmed: boolean;
  /** https links recorded on the Deal. */
  proposalUrl?: string;
  quoteUrl?: string;
}

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
  /** The authorizing Deals only — never other Deals on the Account. */
  deals: ClientDealView[];
}

/** Client_Onboardings record for the Account. */
export interface ClientOnboardingView {
  id: string;
  name: string;
  status?: string;
  readiness?: string;
  requirements?: string;
  accessAssets?: string;
  startDate?: string;
  completionDate?: string;
}

/** Sales Order = a confirmed NairobiX service for the Account. */
export interface ClientServiceView {
  id: string;
  name: string;
  number?: string;
  status?: string;
  solutionFamily?: string;
  summary?: string;
  scope?: string;
  deliveryType?: string;
  pricingModel?: string;
  paymentTerms?: string;
  createdDate: string;
}

/** Quote = a NairobiX proposal for the Account. Drafts and lost quotes are never shown. */
export interface ClientProposalView {
  id: string;
  name: string;
  number?: string;
  stage?: string;
  validTill?: string;
  quoteDate?: string;
  amount: number;
  currency: string;
  summary?: string;
}

/** A Zoho Sign request addressed to the signed-in person. */
export interface ClientSignatureRequest {
  id: string;
  documentName: string;
  status: 'awaiting' | 'completed' | 'declined';
  sentDate?: string;
}

/** A CRM Meeting linked to the Account or Contact. */
export interface ClientMeetingView {
  id: string;
  title: string;
  start: string;
  end?: string;
  venue?: string;
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
      deals: [],
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
      deals: deals.map(
        (d): ClientDealView => ({
          id: d.id,
          name: text(d.Deal_Name) ?? 'NairobiX engagement',
          closedOn: day(d.Closing_Date) || undefined,
          solutionFamilies: multiPicklist(d.Solution_Family),
          desiredOutcomes: multiPicklist(d.Desired_Outcomes),
          onboardingStatus: picklist(d.Onboarding_Status),
          onboardingStart: day(d.Onboarding_Start_Date) || undefined,
          scopeConfirmed: d.Scope_Confirmed === true,
          billingConfirmed: d.Billing_Confirmed === true,
          proposalUrl: safeUrl(d.Growth_Proposal_Link),
          quoteUrl: safeUrl(d.Company),
        })
      ),
    };
  });

  // Only the Deals that authorize this Contact are surfaced.
  const deals = account.deals.filter((d) => dealIds.has(d.id));
  const authorizingDates = deals
    .map((d) => d.closedOn)
    .filter((d): d is string => !!d)
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
    deals,
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

export async function getClientOnboarding(principal: PortalPrincipal): Promise<ClientOnboardingView[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return [];
  return cachedCrmRead(['client', accountId, 'onboarding'], async () =>
    (await searchRecords('clientOnboardings', byAccount('Account', accountId))).map((r) => ({
      id: r.id,
      name: text(r.Onboarding_Name) ?? text(r.Name) ?? 'Client onboarding',
      status: picklist(r.Onboarding_Status),
      readiness: picklist(r.Readiness_Status),
      requirements: picklist(r.Requirements_Status),
      accessAssets: picklist(r.Access_Assets_Status),
      startDate: day(r.Start_Date) || undefined,
      completionDate: day(r.Completion_Date) || undefined,
    }))
  );
}

export async function getClientServices(principal: PortalPrincipal): Promise<ClientServiceView[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return [];
  return cachedCrmRead(['client', accountId, 'services'], async () =>
    (await searchRecords('salesOrders', byAccount('Account_Name', accountId)))
      .filter((r) => picklist(r.Status) !== 'Cancelled')
      .map((r) => ({
        id: r.id,
        name: text(r.Subject) ?? 'NairobiX service',
        number: text(String(r.SO_Number ?? '')),
        status: picklist(r.Status),
        solutionFamily: picklist(r.Solution_Family),
        summary: text(r.Solution_Summary),
        scope: text(r.Included_Scope),
        deliveryType: picklist(r.Delivery_Type),
        pricingModel: picklist(r.Pricing_Model),
        paymentTerms: picklist(r.Payment_Terms),
        createdDate: day(r.Created_Time),
      }))
      .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
  );
}

const VISIBLE_QUOTE_STAGES = new Set(['Negotiation', 'Delivered', 'On Hold', 'Confirmed', 'Closed Won']);

export async function getClientProposals(principal: PortalPrincipal): Promise<ClientProposalView[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return [];
  return cachedCrmRead(['client', accountId, 'proposals'], async () =>
    (await searchRecords('quotes', byAccount('Account_Name', accountId)))
      .filter((r) => VISIBLE_QUOTE_STAGES.has(picklist(r.Quote_Stage) ?? ''))
      .map((r) => ({
        id: r.id,
        name: text(r.Subject) ?? 'NairobiX proposal',
        number: text(String(r.Quote_Number ?? '')),
        stage: picklist(r.Quote_Stage),
        validTill: day(r.Valid_Till) || undefined,
        quoteDate: day(r.Quote_Date) || undefined,
        amount: num(r.Grand_Total),
        currency: portalCurrency(),
        summary: text(r.Solution_Summary),
      }))
  );
}

const RECIPIENT_STATUS: Record<string, ClientSignatureRequest['status']> = {
  Sent: 'awaiting',
  Delivered: 'awaiting',
  Completed: 'completed',
  Declined: 'declined',
};

/** Zoho Sign requests addressed to the signed-in person's verified email. */
export async function getClientSignatureRequests(principal: PortalPrincipal): Promise<ClientSignatureRequest[]> {
  clientRelationship(principal);
  if (isDemoMode()) return [];
  const email = principal.email.trim().toLowerCase();
  return cachedCrmRead(['client', 'recipient', email, 'signatures'], async () =>
    (await searchRecords('signRecipients', `(Email:equals:${criteriaValue(email)})`))
      .filter((r) => text(r.Email)?.toLowerCase() === email && picklist(r.zohosign__Recipient_Type) !== 'CC')
      .flatMap((r) => {
        const status = RECIPIENT_STATUS[picklist(r.zohosign__Recipient_Status) ?? ''];
        if (!status) return [];
        return [
          {
            id: r.id,
            documentName: lookupName(r.zohosign__ZohoSign_Document) ?? 'Document',
            status,
            sentDate: day(r.zohosign__Date_Delivered) || day(r.Created_Time) || undefined,
          },
        ];
      })
  );
}

/** Meetings linked to the client's Account or to the signed-in Contact. */
export async function getClientMeetings(principal: PortalPrincipal): Promise<ClientMeetingView[]> {
  const { accountId } = clientRelationship(principal);
  if (isDemoMode()) return [];
  const contactId = principal.contactId;
  return cachedCrmRead(['client', accountId, contactId ?? '', 'meetings'], async () => {
    const [byAccountRecords, byContact] = await Promise.all([
      searchRecords('meetings', `(What_Id:equals:${criteriaValue(accountId)})`),
      contactId ? searchRecords('meetings', `(Who_Id:equals:${criteriaValue(contactId)})`) : Promise.resolve([]),
    ]);
    const seen = new Set<string>();
    return [...byAccountRecords, ...byContact]
      .filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
      .flatMap((r) => {
        const start = text(r.Start_DateTime);
        if (!start) return [];
        return [{ id: r.id, title: text(r.Event_Title) ?? 'Meeting with NairobiX', start, end: text(r.End_DateTime), venue: text(r.Venue) }];
      })
      .sort((a, b) => a.start.localeCompare(b.start));
  });
}

/** Resolves a section's data without letting one CRM source take down the whole page. */
export type Loaded<T> = { ok: true; data: T } | { ok: false };

export async function settle<T>(promise: Promise<T>): Promise<Loaded<T>> {
  try {
    return { ok: true, data: await promise };
  } catch (error) {
    console.error('[portal] A CRM section failed to load:', (error as Error).message);
    return { ok: false };
  }
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
