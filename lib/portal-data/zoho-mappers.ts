/**
 * Zoho CRM records → the Portal's existing view shapes (lib/types.ts).
 *
 * Only values that exist in the CRM are mapped. Fields the CRM doesn't hold
 * (project progress, milestones, ticket timelines…) are left empty rather
 * than invented; the views hide them when absent.
 */

import type { ZohoLookup, ZohoRecord } from '@/lib/crm/zoho/schema';
import type { Document, Invoice, Project, ServiceRequest } from '@/lib/types';

export function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function lookupName(value: unknown): string | undefined {
  return text((value as ZohoLookup | null | undefined)?.name);
}

export function lookupId(value: unknown): string | undefined {
  return text((value as ZohoLookup | null | undefined)?.id);
}

/** Zoho dates/datetimes → YYYY-MM-DD ('' when missing). */
export function day(value: unknown): string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '';
}

export function num(value: unknown): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(n) ? n : 0;
}

export function picklist(value: unknown): string | undefined {
  const v = text(value);
  return v && v !== '-None-' ? v : undefined;
}

export function multiPicklist(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v !== '-None-') : [];
}

const todayIso = () => new Date().toISOString().slice(0, 10);

// Engagements.Engagement_Status → Project status
const ENGAGEMENT_STATUS: Record<string, Project['status']> = {
  'Not Started': 'planning',
  Onboarding: 'planning',
  'Pending Approval': 'planning',
  'In Progress': 'active',
  'Awaiting Client': 'active',
  'On Hold': 'on-hold',
  Completed: 'completed',
};

export function engagementToProject(record: ZohoRecord): Project & { accountName?: string; accountId?: string } {
  const owner = lookupName(record.Owner);
  return {
    id: record.id,
    name: text(record.Name) ?? 'Engagement',
    description: text(record.Delivery_Notes) ?? [picklist(record.Engagement_Type), picklist(record.Delivery_Type)].filter(Boolean).join(' · '),
    status: ENGAGEMENT_STATUS[picklist(record.Engagement_Status) ?? ''] ?? 'planning',
    startDate: day(record.Start_Date),
    endDate: day(record.Target_End_Date),
    team: owner ? [owner] : [],
    milestones: [],
    recentActivity: [],
    accountName: lookupName(record.Account),
    accountId: lookupId(record.Account),
  };
}

export function isCancelledEngagement(record: ZohoRecord): boolean {
  return picklist(record.Engagement_Status) === 'Cancelled';
}

// Cases.Status → ticket status
const CASE_STATUS: Record<string, ServiceRequest['status']> = {
  New: 'submitted',
  Escalated: 'in-progress',
  'On Hold': 'on-hold',
  Closed: 'resolved',
};

const CASE_PRIORITY: Record<string, NonNullable<ServiceRequest['priority']>> = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

export function caseToServiceRequest(record: ZohoRecord): ServiceRequest & { accountName?: string } {
  return {
    id: record.id,
    title: text(record.Subject) ?? (record.Case_Number ? `Case ${record.Case_Number}` : 'Support case'),
    description: text(record.Description) ?? '',
    status: CASE_STATUS[picklist(record.Status) ?? ''] ?? 'submitted',
    createdDate: day(record.Created_Time),
    priority: CASE_PRIORITY[picklist(record.Priority) ?? ''],
    assignedTo: lookupName(record.Owner),
    timeline: [],
    accountName: lookupName(record.Account_Name),
  };
}

/** Draft ("Created") and cancelled invoices are internal and never shown to clients. */
export function isClientVisibleInvoice(record: ZohoRecord): boolean {
  const status = picklist(record.Status);
  return status !== 'Created' && status !== 'Cancelled';
}

export function portalCurrency(): string {
  return process.env.NAIROBIX_CURRENCY || 'KES';
}

export function invoiceToView(record: ZohoRecord): Invoice & { accountName?: string } {
  const status = picklist(record.Status);
  const dueDate = day(record.Due_Date);
  const paid = status === 'Paid';
  return {
    id: record.id,
    invoiceNumber: text(record.Invoice_Number) ?? text(record.Subject) ?? record.id,
    amount: num(record.Grand_Total),
    currency: portalCurrency(),
    status: paid
      ? 'paid'
      : status === 'Created'
        ? 'draft'
        : dueDate && dueDate < todayIso() && status !== 'Cancelled'
          ? 'overdue'
          : 'sent',
    issueDate: day(record.Invoice_Date),
    dueDate,
    items: [],
    accountName: lookupName(record.Account_Name),
  };
}

export function signDocumentToView(record: ZohoRecord): Document & { signingStatus?: string } {
  return {
    id: record.id,
    name: text(record.Name) ?? 'Document',
    type: 'pdf',
    category: 'agreements',
    uploadDate: day(record.zohosign__Date_Sent) || day(record.Created_Time),
    status: 'active',
    signingStatus: text(record.zohosign__Document_Status),
  };
}
