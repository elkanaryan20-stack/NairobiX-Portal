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

export interface PartnerProfile {
  id: string;
  /** NairobiX Account ID — the CRM Account (business) this partner belongs to. */
  nairobixAccountId?: string;
  businessName: string;
  partnerType: string;
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

export interface ServiceRequest {
  id: string;
  title: string;
  type: 'growth-initiative' | 'system-request' | 'website-request' | 'reporting-question' | 'strategy-session';
  description: string;
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'completed';
  createdDate: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
}

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
export interface OnboardingStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  order: number;
}

// Partner Application Types
export interface PartnerApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  applicationDate: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  notes?: string;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  /** Groups items under a section heading in the sidebar. Items sharing a section render together. */
  section?: string;
}
