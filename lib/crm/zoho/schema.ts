/**
 * NairobiX Zoho CRM mapping — the exact module and field API names the
 * Portal reads, as discovered from the live CRM schema. Nothing here is
 * speculative: if a field isn't listed, the Portal doesn't depend on it.
 *
 * Picklist values are matched exactly as stored in Zoho, including their
 * spelling ("Revoke" on Contacts vs "Revoked" on Participants, "Inactiv").
 */

export const ZOHO_MODULES = {
  contacts: 'Contacts',
  accounts: 'Accounts',
  deals: 'Deals',
  participants: 'Opportunity_Network_Participants',
  applications: 'Opportunity_Network_Applications',
  clientOnboardings: 'Client_Onboardings',
  engagements: 'Engagements',
  cases: 'Cases',
  invoices: 'Invoices',
  tasks: 'Tasks',
  campaigns: 'Campaigns',
  signDocuments: 'zohosign__ZohoSign_Documents',
  signRecipients: 'zohosign__ZohoSign_Recipients',
  quotes: 'Quotes',
  salesOrders: 'Sales_Orders',
  meetings: 'Events',
} as const;

/** Values used by the authorization rules. */
export const ZOHO_VALUES = {
  dealClosedWon: 'Closed Won',
  contactPortalActive: 'Active',
  contactPortalBlocked: ['Suspended', 'Revoke'],
  contactInactive: ['Inactiv', 'Inactive', 'Archived'],
  accountInactive: ['Inactive', 'Archived'],
  participantActive: 'Active',
  participantPortalActive: 'Active',
  participantBlocked: ['Suspended'],
  participantPortalBlocked: ['Suspended', 'Revoked'],
  participationTypes: ['Referral Partner', 'Expert', 'Service Partner', 'Project Partner'],
} as const;

/** Fields requested per module (Zoho's list API requires an explicit field list). */
export const ZOHO_FIELDS = {
  contacts: ['Full_Name', 'First_Name', 'Last_Name', 'Email', 'Account_Name', 'Contact_Status', 'Portal_Access_Status', 'Partnership_ID'],
  accounts: ['Account_Name', 'Account_Status', 'Industry', 'Billing_City', 'Phone', 'Website', 'Partnership_ID'],
  deals: [
    'Deal_Name', 'Account_Name', 'Contact_Name', 'Stage', 'Portal_Required', 'Primary_Contact_Confirmed', 'Closing_Date', 'Amount',
    'Onboarding_Status', 'Onboarding_Start_Date', 'Scope_Confirmed', 'Billing_Confirmed', 'Solution_Family', 'Desired_Outcomes',
    'Growth_Proposal_Link', 'Company', 'Owner',
  ],
  participants: ['Name', 'Email', 'Contact', 'Participant_Status', 'Portal_Access_Status', 'Participation_Type', 'Participant_ID', 'Created_Time'],
  applications: ['Name', 'Email', 'First_Name', 'Last_Name', 'Application_Status', 'Applicant_Type', 'Contribution_Areas', 'Application_ID', 'Created_Time'],
  clientOnboardings: ['Name', 'Account', 'Onboarding_Status', 'Readiness_Status', 'Requirements_Status', 'Access_Assets_Status', 'Start_Date', 'Completion_Date'],
  engagements: ['Name', 'Account', 'Deal', 'Engagement_Status', 'Engagement_Type', 'Delivery_Type', 'Start_Date', 'Target_End_Date', 'Delivery_Notes', 'Owner'],
  cases: [
    'Subject', 'Description', 'Type', 'Status', 'Priority', 'Case_Number', 'Case_Origin', 'Account_Name',
    'Related_To', 'Email', 'Reported_By', 'Deal_Name', 'Created_Time', 'Owner',
  ],
  invoices: ['Subject', 'Invoice_Number', 'Status', 'Grand_Total', 'Invoice_Date', 'Due_Date', 'Account_Name', 'Contact_Name'],
  tasks: ['Subject', 'Status', 'Priority', 'Due_Date', 'What_Id'],
  campaigns: ['Campaign_Name', 'Type', 'Status', 'Start_Date', 'End_Date'],
  signDocuments: ['Name', 'zohosign__Document_Status', 'zohosign__Date_Sent', 'zohosign__Date_Completed', 'zohosign__Document_Deadline', 'zohosign__Account', 'zohosign__Contact', 'Created_Time'],
  signRecipients: ['Email', 'zohosign__Recipient_Status', 'zohosign__Recipient_Type', 'zohosign__Date_Delivered', 'zohosign__ZohoSign_Document', 'Created_Time'],
  quotes: ['Subject', 'Quote_Number', 'Quote_Stage', 'Valid_Till', 'Quote_Date', 'Grand_Total', 'Solution_Summary', 'Account_Name', 'Deal_Name'],
  salesOrders: ['Subject', 'SO_Number', 'Status', 'Solution_Family', 'Solution_Summary', 'Included_Scope', 'Delivery_Type', 'Pricing_Model', 'Payment_Terms', 'Account_Name', 'Created_Time'],
  meetings: ['Event_Title', 'Start_DateTime', 'End_DateTime', 'Venue', 'What_Id', 'Who_Id'],
} as const;

/** A Zoho lookup value as returned by the API. */
export interface ZohoLookup {
  id: string;
  name?: string;
}

export interface ZohoRecord {
  id: string;
  [field: string]: unknown;
}

export interface ZohoUser {
  id: string;
  email: string;
  full_name?: string;
  status: string;
}
