/**
 * Canonical CRM entity contracts for the NairobiX Portal.
 *
 * These mirror the modules in NairobiX's Zoho CRM. The portal UI is built
 * against these shapes (via lib/crm/adapter.ts) rather than against
 * lib/mock-data.ts directly wherever a page needs CRM-scoped data, so that
 * swapping the adapter's implementation from mock data to a Next.js API
 * route backed by Zoho CRM requires no UI changes.
 *
 * Do not add fields here that aren't already surfaced by the portal today —
 * this file structures existing data, it does not anticipate new ones.
 */

export type NairobiXAccountId = string;
export type NairobiXContactId = string;
export type NairobiXDealId = string;

/** Account = Business. The primary boundary for authorization: every Contact resolves to exactly one Account. */
export interface Account {
  id: NairobiXAccountId;
  name: string;
  type: 'client' | 'partner';
  industry: string;
  location: string;
  phone: string;
  email: string;
  status: string;
}

/** Contact = Person / Portal user. A portal session always resolves through Contact → Account. */
export interface Contact {
  id: NairobiXContactId;
  accountId: NairobiXAccountId;
  name: string;
  email: string;
  role: 'client' | 'partner' | 'staff';
}

/** Deal = Commercial opportunity (e.g. a qualified partner referral). */
export interface Deal {
  id: NairobiXDealId;
  accountId: NairobiXAccountId;
  name: string;
  stage: string;
  amount?: number;
  closeDate?: string;
}

/** Engagement = Delivery / project relationship carried out for an Account, optionally tied to the Deal that originated it. */
export interface Engagement {
  id: string;
  accountId: NairobiXAccountId;
  dealId?: NairobiXDealId;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
}

/** Task = Action, scoped to the Engagement it belongs to. */
export interface Task {
  id: string;
  engagementId: string;
  name: string;
  status: string;
  dueDate: string;
}

/** Case = Support request raised by an Account. */
export interface Case {
  id: string;
  accountId: NairobiXAccountId;
  title: string;
  type: string;
  status: string;
  priority: string;
  createdDate: string;
  dueDate?: string;
}

/** Campaign = Marketing program. Not yet tracked by any portal workspace — reserved for future Zoho sync. */
export interface Campaign {
  id: string;
  name: string;
  status: string;
}

/** Product = A NairobiX solution delivered to an Account. */
export interface Product {
  id: string;
  accountId: NairobiXAccountId;
  name: string;
  category: string;
  status: string;
}

/** Quote = Proposal. Not yet tracked by any portal workspace — reserved for future Zoho sync. */
export interface Quote {
  id: string;
  accountId: NairobiXAccountId;
  dealId?: NairobiXDealId;
  status: string;
}

/** Sales Order = Confirmed order. Not yet tracked by any portal workspace — reserved for future Zoho sync. */
export interface SalesOrder {
  id: string;
  accountId: NairobiXAccountId;
  dealId?: NairobiXDealId;
  status: string;
}

/** Invoice = Billing record for an Account. */
export interface Invoice {
  id: string;
  accountId: NairobiXAccountId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  issueDate: string;
  dueDate: string;
}

/** Document = Business document associated with an Account. */
export interface Document {
  id: string;
  accountId: NairobiXAccountId;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  status: string;
}
