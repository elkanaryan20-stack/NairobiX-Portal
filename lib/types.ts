import type { ReactNode } from 'react';

// User and Workspace Types
//
// A portal User always resolves to CRM Contact → Account (see lib/crm/).
// nairobixContactId / nairobixAccountId are the stable identifiers that
// resolution will use once these are backed by Zoho CRM instead of mock data.
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'partner' | 'staff';
  /** NairobiX Contact ID — this user as a CRM Contact. */
  nairobixContactId?: string;
}

export interface ClientProfile {
  id: string;
  /** NairobiX Account ID — the CRM Account (business) this client belongs to. */
  nairobixAccountId?: string;
  businessName: string;
  businessType: string;
  industry: string;
  location: string;
  phone: string;
  email: string;
  partnershipStatus: 'active' | 'inactive' | 'pending';
  partnershipStartDate: string;
  growthPhase: 'Foundation' | 'Acquisition' | 'Conversion' | 'Automation' | 'Scale';
}

// Partners are not interchangeable — a Business Consultant and a Cyber Cafe
// operator play very different roles in NairobiX's delivery model. The
// partner's type determines its default capability set (see
// PARTNER_CAPABILITY_PRESETS in mock-data.ts); capabilities can still be
// adjusted per partner by staff, which is why they are stored on the
// profile rather than re-derived from type on every read.
export type PartnerType =
  | 'Business Consultant'
  | 'Marketing Agency'
  | 'Business Centre'
  | 'Cyber Cafe / ICT Centre'
  | 'Printing / Branding Centre';

/** What a partner is approved to do inside the portal. Gates both navigation and page content. */
export interface PartnerCapabilities {
  /** Submit business referrals to NairobiX. */
  referrals: boolean;
  /** Track referrals once qualified into commercial opportunities. */
  opportunities: boolean;
  /** Participate directly in client delivery projects. */
  projects: boolean;
  /** Receive and action assigned tasks. */
  tasks: boolean;
  /** Take part in strategy / consultation sessions. */
  consultations: boolean;
  /** Submit or track delivery of work product. */
  deliverables: boolean;
  /** Earn and track referral commissions. */
  commissions: boolean;
}

export interface PartnerProfile {
  id: string;
  /** NairobiX Account ID — the CRM Account (business) this partner belongs to. */
  nairobixAccountId?: string;
  businessName: string;
  partnerType: PartnerType;
  capabilities: PartnerCapabilities;
  industry: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  partnerStatus: 'active' | 'inactive' | 'pending' | 'onboarding';
  statusReason?: string;
  joinDate: string;
  totalReferrals: number;
  totalCommissionsEarned: number;
  logo?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  milestones: Milestone[];
  nextAction: string;
  recentActivity: Activity[];
}

export interface Milestone {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  category: string;
  currentActivity: string;
  progress?: number;
  startDate?: string;
}

// A support ticket = the portal-facing view of a CRM Case. The status flow
// is deliberately linear (Submit → Assigned → In Progress → Resolved) so
// clients always know exactly where their request stands.
export interface ServiceRequest {
  id: string;
  title: string;
  type: 'growth-initiative' | 'system-request' | 'website-request' | 'reporting-question' | 'strategy-session';
  description: string;
  status: 'submitted' | 'assigned' | 'in-progress' | 'resolved';
  createdDate: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  timeline: Activity[];
}

/** Semantic alias — a ServiceRequest presented to the client as a support ticket. */
export type SupportTicket = ServiceRequest;

// Performance & Insight Types
export interface PerformanceMetric {
  id: string;
  category: string;
  title: string;
  value: string | number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface GrowthInsight {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  recommendation: string;
  dataPoint: string;
  impact: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  category: string;
}

// Campaign Types
//
// The client's view of a marketing program NairobiX is running on their
// behalf. This is the portal-facing shape of a CRM Campaign — kept
// separate from lib/crm/types.ts's internal Campaign, the same pattern
// already used for Document and Invoice.
export interface ClientCampaign {
  id: string;
  name: string;
  channel: 'seo' | 'ppc' | 'social' | 'email' | 'content';
  status: 'planning' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  leadsGenerated: number;
  conversionRate?: number;
}

// Lead Types
//
// A prospect generated for the client's business through NairobiX's
// acquisition work — distinct from a Referral (which a Partner submits
// about a prospective NairobiX client).
export interface ClientLead {
  id: string;
  name: string;
  company?: string;
  source: string;
  campaignId?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  receivedDate: string;
  value?: number;
}

// Client-facing task — an action item surfaced to the client, scoped to a
// project/engagement or campaign rather than internal to NairobiX.
export interface ClientTask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  relatedTo?: string;
  priority: 'low' | 'medium' | 'high';
}

// Report Types
export interface Report {
  id: string;
  title: string;
  period: string;
  summary: string;
  publishedDate: string;
  type: 'monthly' | 'campaign' | 'strategy' | 'performance';
  url?: string;
  downloadUrl?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'other';
  category: 'strategy' | 'reports' | 'agreements' | 'financial' | 'resources';
  uploadDate: string;
  status: 'active' | 'archived';
  url?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'insight' | 'report' | 'document' | 'project' | 'request' | 'billing' | 'announcement';
  date: string;
  read: boolean;
  actionUrl?: string;
}

// Referral Types
//
// A Referral is the portal-facing view of a CRM Deal (commercial opportunity).
export interface Referral {
  id: string;
  /** NairobiX Deal ID — this referral as a CRM Deal once qualified. */
  nairobixDealId?: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  industry: string;
  location: string;
  website?: string;
  businessNeed: string;
  status: 'submitted' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  referredBy: string;
  referralDate: string;
  potentialValue?: number;
  commission?: {
    amount: number;
    status: 'pending' | 'approved' | 'paid';
    paymentDate?: string;
  };
}

// Commission Types
export interface Commission {
  id: string;
  referralId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  approvedDate?: string;
  paidDate?: string;
  notes?: string;
}

// Benefit/Reward Types
export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: 'playbook' | 'discount' | 'strategy' | 'early-access' | 'appreciation';
  status: 'available' | 'used' | 'expired';
  expiryDate?: string;
  value?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: 'milestone' | 'bonus' | 'recognition' | 'training' | 'gift';
  progress?: {
    current: number;
    target: number;
  };
  earnedDate?: string;
  icon?: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Activity Types
export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'update' | 'milestone' | 'comment' | 'status-change';
  performedBy?: string;
}

// Dashboard Card Types
export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  actionUrl?: string;
}

// Growth Journey Types
export interface GrowthPhase {
  id: string;
  name: 'Foundation' | 'Acquisition' | 'Conversion' | 'Automation' | 'Scale';
  status: 'pending' | 'current' | 'completed';
  objective: string;
  initiatives: string[];
  completedWork: string[];
  performance: string;
  recommendations: string[];
  nextMilestone: string;
}

// Onboarding Types
//
// A partner is never asked for payment/commission details until every prior
// stage is complete — that step is intentionally last in `steps`. Staff
// review the application (below) once `steps` reaches 'submitted-for-review'.
export type OnboardingStepId =
  | 'partner-details'
  | 'business-info'
  | 'location'
  | 'experience'
  | 'documents'
  | 'verification'
  | 'agreement'
  | 'assessment'
  | 'review'
  | 'payment-setup';

export interface OnboardingStep {
  id: OnboardingStepId;
  name: string;
  status: 'locked' | 'pending' | 'in-progress' | 'completed';
  order: number;
}

export interface OnboardingDocument {
  id: string;
  name: string;
  requirement: 'id' | 'business-registration' | 'portfolio' | 'cv' | 'other';
  status: 'not-uploaded' | 'uploaded' | 'verified' | 'rejected';
  uploadedDate?: string;
}

export interface OnboardingApplication {
  id: string;
  partnerType: PartnerType;
  currentStepId: OnboardingStepId;
  steps: OnboardingStep[];
  partnerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  businessInfo: {
    businessName: string;
    businessDescription: string;
    website?: string;
  };
  location: {
    city: string;
    address: string;
  };
  experience: {
    yearsExperience: number;
    background: string;
    clientNetwork: string;
  };
  documents: OnboardingDocument[];
  verificationStatus: 'not-started' | 'pending' | 'verified' | 'rejected';
  agreementAccepted: boolean;
  agreementAcceptedDate?: string;
  assessmentId?: string;
  reviewStatus: 'not-submitted' | 'in-review' | 'approved' | 'rejected';
  reviewNotes?: string;
  paymentSetupComplete: boolean;
  lastSavedDate: string;
}

// Partner Assessment Types
//
// A structured qualification process, not a quiz — staff review the
// submitted responses (architecture only; the review UI lives in the
// Command Center) before a partner can be approved.
export interface AssessmentQuestion {
  id: string;
  category: 'Experience' | 'Network & Reach' | 'Service Capability' | 'NairobiX Fit';
  question: string;
  helperText?: string;
  type: 'scale' | 'text' | 'choice';
  options?: string[];
}

export interface AssessmentResponse {
  questionId: string;
  value: string | number;
}

export interface PartnerAssessment {
  id: string;
  partnerApplicationId: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'reviewed';
  responses: AssessmentResponse[];
  score?: number;
  submittedDate?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  recommendation?: 'approve' | 'conditional' | 'decline';
}

// Partner Application Types
//
// The staff-facing pipeline record for a partner's application, spanning
// from first submission through activation. `onboardingApplicationId` and
// `assessmentId` link to the partner's own onboarding progress.
export interface PartnerApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  partnerType: PartnerType;
  applicationDate: string;
  status: 'submitted' | 'under-review' | 'assessment' | 'verification' | 'approved' | 'rejected' | 'active';
  onboardingApplicationId?: string;
  assessmentId?: string;
  reviewedBy?: string;
  notes?: string;
}

// Partner Work Types
//
// Surfaced only to partners whose capabilities include the matching flag
// (see PartnerCapabilities). A partner without `projects` never sees
// PartnerProjectAssignment data, regardless of what exists in mock data.
export interface PartnerProjectAssignment {
  id: string;
  projectName: string;
  clientName: string;
  role: string;
  status: 'active' | 'completed';
  startDate: string;
}

export interface PartnerTaskAssignment {
  id: string;
  title: string;
  projectName?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ConsultationSession {
  id: string;
  topic: string;
  clientName?: string;
  scheduledDate: string;
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  projectName?: string;
  status: 'in-progress' | 'submitted' | 'approved' | 'revision-requested';
  dueDate: string;
  submittedDate?: string;
}

// Delivery journey stage — purely descriptive, used to render the
// Referral → ... → Completed Work timeline for capability-eligible partners.
export type DeliveryStage =
  | 'referral'
  | 'lead'
  | 'qualified'
  | 'client'
  | 'engagement'
  | 'tasks'
  | 'consultation'
  | 'deliverables'
  | 'completed';

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  /** Groups items under a section heading in the sidebar. Items sharing a section render together. */
  section?: string;
}
