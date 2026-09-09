/**
 * Data-access seam between the portal UI and CRM data.
 *
 * Every function below currently reads from lib/mock-data.ts. When NairobiX
 * CRM (Zoho) is wired up, each implementation moves behind a Next.js API
 * route and reads from Zoho instead:
 *
 *   Portal → Mock Data                Portal → Next.js API → Zoho CRM
 *
 * The function signatures and return shapes (lib/crm/types.ts) are the
 * contract — pages call these functions, never lib/mock-data.ts directly,
 * so the swap needs no UI changes.
 *
 * The portal is single-tenant in its current mock form (one demo client,
 * one demo partner), so the filtering below is a no-op today. It is written
 * as real filtering — not just returned as-is — so the seam behaves
 * correctly once multiple Accounts exist behind the API.
 */

import {
  mockClientProfile,
  mockPartnerProfile,
  mockAllPartners,
  mockCurrentUser,
  mockPartnerUser,
  mockStaffUser,
  mockClientProjects,
  mockClientServices,
  mockClientDocuments,
  mockClientInvoices,
  mockClientServiceRequests,
  mockPartnerReferrals,
} from '@/lib/mock-data';
import type { PartnerCapabilities } from '@/lib/types';
import type {
  Account,
  Campaign,
  Case,
  Contact,
  Deal,
  Document,
  Engagement,
  Invoice,
  Product,
  Quote,
  SalesOrder,
  Task,
} from './types';

function accountFromClientProfile(): Account {
  return {
    id: mockClientProfile.nairobixAccountId!,
    name: mockClientProfile.businessName,
    type: 'client',
    industry: mockClientProfile.industry,
    location: mockClientProfile.location,
    phone: mockClientProfile.phone,
    email: mockClientProfile.email,
    status: mockClientProfile.partnershipStatus,
  };
}

function accountFromPartnerProfile(): Account {
  return {
    id: mockPartnerProfile.nairobixAccountId!,
    name: mockPartnerProfile.businessName,
    type: 'partner',
    industry: mockPartnerProfile.industry,
    location: mockPartnerProfile.location,
    phone: mockPartnerProfile.phone,
    email: mockPartnerProfile.email,
    status: mockPartnerProfile.partnerStatus,
  };
}

/**
 * Resolves the Account a Contact belongs to — the authorization boundary
 * every portal session must cross before it can see business data.
 * Staff Contacts are NairobiX-internal and don't resolve to a single
 * Account; staff pages query across Accounts instead.
 */
export function getAccountByContactId(contactId: string): Account | undefined {
  if (contactId === mockCurrentUser.nairobixContactId) return accountFromClientProfile();
  if (contactId === mockPartnerUser.nairobixContactId) return accountFromPartnerProfile();
  return undefined;
}

/**
 * What a partner Account is approved to do inside the portal. Every partner
 * page that conditionally renders a section (Work, Opportunities, Earnings)
 * reads this rather than checking partnerType directly, so the capability
 * model can be adjusted per-partner by staff without touching the UI.
 */
export function getPartnerCapabilities(accountId: string): PartnerCapabilities | undefined {
  return mockAllPartners.find((partner) => partner.nairobixAccountId === accountId)?.capabilities;
}

export function getContactById(contactId: string): Contact | undefined {
  const match = [mockCurrentUser, mockPartnerUser, mockStaffUser].find(
    (user) => user.nairobixContactId === contactId
  );
  if (!match) return undefined;

  const account = getAccountByContactId(contactId);
  return {
    id: match.nairobixContactId!,
    accountId: account?.id ?? '',
    name: match.name,
    email: match.email,
    role: match.role,
  };
}

export function getDealsForAccount(accountId: string): Deal[] {
  if (accountId !== mockPartnerProfile.nairobixAccountId) return [];

  return mockPartnerReferrals.map((referral) => ({
    id: referral.nairobixDealId ?? referral.id,
    accountId,
    name: referral.businessName,
    stage: referral.status,
    amount: referral.potentialValue,
  }));
}

export function getEngagementsForAccount(accountId: string): Engagement[] {
  if (accountId !== mockClientProfile.nairobixAccountId) return [];

  return mockClientProjects.map((project) => ({
    id: project.id,
    accountId,
    name: project.name,
    status: project.status,
    progress: project.progress,
    startDate: project.startDate,
    endDate: project.endDate,
  }));
}

export function getTasksForEngagement(engagementId: string): Task[] {
  const project = mockClientProjects.find((p) => p.id === engagementId);
  if (!project) return [];

  return project.milestones.map((milestone) => ({
    id: milestone.id,
    engagementId,
    name: milestone.name,
    status: milestone.status,
    dueDate: milestone.dueDate,
  }));
}

export function getCasesForAccount(accountId: string): Case[] {
  if (accountId !== mockClientProfile.nairobixAccountId) return [];

  return mockClientServiceRequests.map((request) => ({
    id: request.id,
    accountId,
    title: request.title,
    type: request.type,
    status: request.status,
    priority: request.priority,
    createdDate: request.createdDate,
    dueDate: request.dueDate,
  }));
}

export function getProductsForAccount(accountId: string): Product[] {
  if (accountId !== mockClientProfile.nairobixAccountId) return [];

  return mockClientServices.map((service) => ({
    id: service.id,
    accountId,
    name: service.name,
    category: service.category,
    status: service.status,
  }));
}

export function getInvoicesForAccount(accountId: string): Invoice[] {
  if (accountId !== mockClientProfile.nairobixAccountId) return [];

  return mockClientInvoices.map((invoice) => ({
    id: invoice.id,
    accountId,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
  }));
}

export function getDocumentsForAccount(accountId: string): Document[] {
  if (accountId !== mockClientProfile.nairobixAccountId) return [];

  return mockClientDocuments.map((document) => ({
    id: document.id,
    accountId,
    name: document.name,
    type: document.type,
    category: document.category,
    uploadDate: document.uploadDate,
    status: document.status,
  }));
}

// No portal workspace surfaces these yet — the seam is ready for when a
// Zoho-backed marketing, quoting or order-confirmation view is needed.
export function getCampaigns(): Campaign[] {
  return [];
}

export function getQuotesForAccount(_accountId: string): Quote[] {
  return [];
}

export function getSalesOrdersForAccount(_accountId: string): SalesOrder[] {
  return [];
}
