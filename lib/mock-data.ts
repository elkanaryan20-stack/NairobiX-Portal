import {
  ClientProfile,
  PartnerProfile,
  Project,
  Service,
  Report,
  Document,
  Notification,
  Referral,
  Commission,
  Benefit,
  Reward,
  Invoice,
  GrowthInsight,
  PerformanceMetric,
  ServiceRequest,
  GrowthPhase,
  OnboardingStep,
  PartnerApplication,
  User,
} from './types';

// ============================================================================
// USERS
// ============================================================================

export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: undefined,
  role: 'client',
};

export const mockPartnerUser: User = {
  id: 'partner-1',
  name: 'James Mwangi',
  email: 'james@partner.com',
  avatar: undefined,
  role: 'partner',
};

export const mockStaffUser: User = {
  id: 'staff-1',
  name: 'Grace Kipchoge',
  email: 'grace@nairobix.com',
  avatar: undefined,
  role: 'staff',
};

// ============================================================================
// CLIENT DATA
// ============================================================================

export const mockClientProfile: ClientProfile = {
  id: 'client-1',
  businessName: 'TechStart Kenya Ltd',
  businessType: 'SaaS Startup',
  industry: 'Technology',
  location: 'Nairobi, Kenya',
  phone: '+254 712 345 678',
  email: 'contact@techstart.ke',
  partnershipStatus: 'active',
  partnershipStartDate: '2023-06-15',
  growthPhase: 'Conversion',
};

export const mockClientProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'CRM Implementation',
    description: 'Implement and configure Zoho CRM system for sales team',
    status: 'active',
    progress: 72,
    startDate: '2024-01-10',
    endDate: '2024-03-31',
    team: ['Alice Kariuki', 'David Kiplagat'],
    milestones: [
      { id: 'm1', name: 'Discovery', status: 'completed', dueDate: '2024-01-20' },
      { id: 'm2', name: 'Architecture', status: 'completed', dueDate: '2024-02-10' },
      { id: 'm3', name: 'Configuration', status: 'in-progress', dueDate: '2024-02-28' },
      { id: 'm4', name: 'Training', status: 'pending', dueDate: '2024-03-15' },
      { id: 'm5', name: 'Launch', status: 'pending', dueDate: '2024-03-31' },
    ],
    nextAction: 'Complete user configuration and set up custom fields',
    recentActivity: [
      {
        id: 'a1',
        title: 'Configuration Phase Started',
        description: 'System configuration begun with custom fields setup',
        timestamp: '2024-02-15',
        type: 'status-change',
        performedBy: 'Alice Kariuki',
      },
      {
        id: 'a2',
        title: 'Milestone Completed',
        description: 'Architecture phase completed successfully',
        timestamp: '2024-02-10',
        type: 'milestone',
        performedBy: 'David Kiplagat',
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Website Redesign',
    description: 'Modern, responsive website redesign with improved conversion flow',
    status: 'active',
    progress: 45,
    startDate: '2024-02-01',
    endDate: '2024-04-15',
    team: ['Emma Wanjiru'],
    milestones: [
      { id: 'm6', name: 'Design', status: 'completed', dueDate: '2024-02-15' },
      { id: 'm7', name: 'Development', status: 'in-progress', dueDate: '2024-03-20' },
      { id: 'm8', name: 'Testing', status: 'pending', dueDate: '2024-04-05' },
      { id: 'm9', name: 'Launch', status: 'pending', dueDate: '2024-04-15' },
    ],
    nextAction: 'Complete frontend development and begin integration testing',
    recentActivity: [
      {
        id: 'a3',
        title: 'Development Underway',
        description: 'Frontend development 60% complete',
        timestamp: '2024-02-28',
        type: 'update',
        performedBy: 'Emma Wanjiru',
      },
    ],
  },
  {
    id: 'proj-3',
    name: 'Marketing Automation Setup',
    description: 'Implement email marketing automation and lead nurturing workflows',
    status: 'planning',
    progress: 0,
    startDate: '2024-03-15',
    endDate: '2024-05-30',
    team: ['Robert Omondi'],
    milestones: [
      { id: 'm10', name: 'Strategy', status: 'pending', dueDate: '2024-03-20' },
      { id: 'm11', name: 'Setup', status: 'pending', dueDate: '2024-04-10' },
      { id: 'm12', name: 'Training', status: 'pending', dueDate: '2024-05-15' },
    ],
    nextAction: 'Schedule strategy workshop',
    recentActivity: [
      {
        id: 'a4',
        title: 'Project Created',
        description: 'Marketing automation project initiated',
        timestamp: '2024-02-28',
        type: 'update',
      },
    ],
  },
];

export const mockClientServices: Service[] = [
  {
    id: 'svc-1',
    name: 'Digital Marketing',
    description: 'SEO, PPC, social media campaigns and content marketing',
    status: 'active',
    category: 'Marketing',
    currentActivity: 'Monthly SEO optimization and campaign monitoring',
    progress: 65,
    startDate: '2023-06-15',
  },
  {
    id: 'svc-2',
    name: 'CRM & Sales Systems',
    description: 'Zoho CRM implementation and sales process optimization',
    status: 'active',
    category: 'Systems',
    currentActivity: 'Configuration and user training',
    progress: 72,
  },
  {
    id: 'svc-3',
    name: 'Business Automation',
    description: 'Process automation and workflow optimization',
    status: 'active',
    category: 'Automation',
    currentActivity: 'Lead management automation setup',
    progress: 40,
  },
  {
    id: 'svc-4',
    name: 'Web Solutions',
    description: 'Website development and optimization',
    status: 'active',
    category: 'Web',
    currentActivity: 'Website redesign implementation',
    progress: 45,
  },
  {
    id: 'svc-5',
    name: 'Analytics & Insights',
    description: 'Business analytics and reporting setup',
    status: 'active',
    category: 'Analytics',
    currentActivity: 'Dashboard configuration and reporting',
    progress: 55,
  },
];

export const mockClientPerformanceMetrics: PerformanceMetric[] = [
  {
    id: 'm1',
    category: 'Acquisition',
    title: 'Total Leads',
    value: 324,
    change: 12,
    unit: 'leads',
    trend: 'up',
  },
  {
    id: 'm2',
    category: 'Acquisition',
    title: 'Lead Sources',
    value: 8,
    change: 2,
    unit: 'channels',
    trend: 'up',
  },
  {
    id: 'm3',
    category: 'Acquisition',
    title: 'Cost per Lead',
    value: 850,
    change: -5,
    unit: 'KES',
    trend: 'down',
  },
  {
    id: 'm4',
    category: 'Conversion',
    title: 'Qualified Leads',
    value: 87,
    change: 18,
    unit: 'leads',
    trend: 'up',
  },
  {
    id: 'm5',
    category: 'Conversion',
    title: 'Conversion Rate',
    value: 26.8,
    change: 3.2,
    unit: '%',
    trend: 'up',
  },
  {
    id: 'm6',
    category: 'Conversion',
    title: 'Sales Pipeline',
    value: '2.4M',
    change: 15,
    unit: 'KES',
    trend: 'up',
  },
  {
    id: 'm7',
    category: 'Digital',
    title: 'Website Traffic',
    value: 4521,
    change: 8,
    unit: 'monthly visits',
    trend: 'up',
  },
  {
    id: 'm8',
    category: 'Digital',
    title: 'Search Visibility',
    value: 234,
    change: 45,
    unit: 'keywords',
    trend: 'up',
  },
];

export const mockClientInsights: GrowthInsight[] = [
  {
    id: 'ins-1',
    title: 'Lead quality improved 24%',
    summary: 'Qualified enquiries increased 24% compared with the previous period',
    whyItMatters: 'The acquisition system is generating a stronger proportion of high-intent prospects, which should result in higher conversion rates and shorter sales cycles.',
    recommendation: 'Continue optimizing high-intent campaigns while testing additional qualified audiences. Consider increasing budget allocation to top-performing channels.',
    dataPoint: '+24% qualified leads vs previous month',
    impact: 'Higher conversion rate potential, improved sales efficiency',
    priority: 'high',
    date: '2024-02-28',
    category: 'Acquisition',
  },
  {
    id: 'ins-2',
    title: 'Website redesign showing early ROI',
    summary: 'Landing page conversions up 18% since new design launch',
    whyItMatters: 'The redesigned user experience is resonating with visitors and reducing friction in the conversion funnel.',
    recommendation: 'Conduct A/B testing on call-to-action buttons. Analyze heatmaps to identify additional optimization opportunities.',
    dataPoint: '+18% conversion rate on new pages',
    impact: 'More qualified leads from same traffic volume',
    priority: 'high',
    date: '2024-02-25',
    category: 'Digital',
  },
  {
    id: 'ins-3',
    title: 'Email engagement trending up',
    summary: 'Open rates now 32%, up from 24% baseline',
    whyItMatters: 'Improved email copy and segmentation are resonating with your audience, indicating better message-market fit.',
    recommendation: 'Implement advanced segmentation. Test behavioral triggers for personalized follow-ups.',
    dataPoint: '+8pt improvement in open rate',
    impact: 'Better lead nurturing, increased customer lifetime value',
    priority: 'medium',
    date: '2024-02-20',
    category: 'Conversion',
  },
];

export const mockClientReports: Report[] = [
  {
    id: 'rep-1',
    title: 'Monthly Growth Report - February 2024',
    period: 'February 2024',
    summary:
      'Strong month for acquisition with improved lead quality. Website redesign showing positive ROI. CRM implementation on track.',
    publishedDate: '2024-02-28',
    type: 'monthly',
  },
  {
    id: 'rep-2',
    title: 'Campaign Performance Review - Q4 2023',
    period: 'Q4 2023',
    summary: 'Digital marketing campaigns delivered 156% of target lead volume. Social media engagement increased 45%.',
    publishedDate: '2024-01-15',
    type: 'campaign',
  },
  {
    id: 'rep-3',
    title: 'Strategy Review - Annual Growth Plan',
    period: '2024 Annual',
    summary: 'Comprehensive review of growth initiatives and strategic recommendations for 2024 expansion.',
    publishedDate: '2024-01-05',
    type: 'strategy',
  },
];

export const mockClientDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Business Growth Playbook 2024',
    type: 'pdf',
    category: 'strategy',
    uploadDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'doc-2',
    name: 'Partnership Agreement - Execution',
    type: 'docx',
    category: 'agreements',
    uploadDate: '2023-06-15',
    status: 'active',
  },
  {
    id: 'doc-3',
    name: 'Digital Marketing Strategy Q1 2024',
    type: 'docx',
    category: 'strategy',
    uploadDate: '2024-01-10',
    status: 'active',
  },
  {
    id: 'doc-4',
    name: 'Invoice - January 2024',
    type: 'pdf',
    category: 'financial',
    uploadDate: '2024-01-31',
    status: 'active',
  },
  {
    id: 'doc-5',
    name: 'CRM Implementation Guide',
    type: 'pdf',
    category: 'resources',
    uploadDate: '2024-02-01',
    status: 'active',
  },
];

export const mockClientNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Growth Insight',
    message: 'Lead quality improved 24% compared to previous period',
    type: 'insight',
    date: '2024-02-28',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Report Published',
    message: 'Your Monthly Growth Report for February 2024 is now available',
    type: 'report',
    date: '2024-02-28',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Project Milestone Completed',
    message: 'Architecture phase of CRM Implementation completed',
    type: 'project',
    date: '2024-02-26',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Invoice Due Soon',
    message: 'Your invoice for March services is due on March 15, 2024',
    type: 'billing',
    date: '2024-02-20',
    read: true,
  },
];

export const mockClientServiceRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    title: 'Website Performance Optimization',
    type: 'system-request',
    description: 'Request for website speed optimization and server configuration review',
    status: 'in-progress',
    createdDate: '2024-02-20',
    priority: 'high',
    assignedTo: 'Emma Wanjiru',
  },
  {
    id: 'req-2',
    title: 'Q1 Strategy Session',
    type: 'strategy-session',
    description: 'Request for quarterly business strategy review meeting',
    status: 'submitted',
    createdDate: '2024-02-25',
    priority: 'medium',
  },
];

export const mockClientBenefits: Benefit[] = [
  {
    id: 'ben-1',
    name: 'Business Growth Playbook',
    description: 'Comprehensive framework for sustainable business growth',
    category: 'playbook',
    status: 'available',
  },
  {
    id: 'ben-2',
    name: '15% Discount on Additional Services',
    description: 'Exclusive discount for active growth partnerships',
    category: 'discount',
    status: 'available',
  },
  {
    id: 'ben-3',
    name: 'Quarterly Strategy Review',
    description: 'Complimentary business strategy review session',
    category: 'strategy',
    status: 'available',
  },
  {
    id: 'ben-4',
    name: 'Early Access to AI Tools',
    description: 'Beta access to NairobiX AI automation platform',
    category: 'early-access',
    status: 'available',
  },
];

export const mockClientInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-003',
    amount: 125000,
    currency: 'KES',
    status: 'sent',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    items: [
      { id: 'i1', description: 'Digital Marketing - February', quantity: 1, unitPrice: 50000, total: 50000 },
      { id: 'i2', description: 'CRM Implementation', quantity: 1, unitPrice: 75000, total: 75000 },
    ],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    amount: 95000,
    currency: 'KES',
    status: 'paid',
    issueDate: '2024-01-01',
    dueDate: '2024-02-01',
    items: [
      { id: 'i3', description: 'Digital Marketing - January', quantity: 1, unitPrice: 50000, total: 50000 },
      { id: 'i4', description: 'Web Solutions Consultation', quantity: 1, unitPrice: 45000, total: 45000 },
    ],
  },
];

export const mockGrowthPhases: GrowthPhase[] = [
  {
    id: 'phase-1',
    name: 'Foundation',
    status: 'completed',
    objective: 'Establish business fundamentals and systems',
    initiatives: ['Business registration', 'Website creation', 'Social media setup'],
    completedWork: ['Registered business entity', 'Launched website', 'Set up social channels'],
    performance: 'Completed on schedule',
    recommendations: [],
    nextMilestone: 'Move to Acquisition phase',
  },
  {
    id: 'phase-2',
    name: 'Acquisition',
    status: 'completed',
    objective: 'Build reliable lead generation system',
    initiatives: ['Digital marketing setup', 'Content marketing', 'Lead capture system'],
    completedWork: ['Launched digital campaigns', 'Content calendar created', 'CRM implemented'],
    performance: 'Exceeded lead targets by 32%',
    recommendations: ['Optimize high-performing channels', 'Test new audience segments'],
    nextMilestone: 'Scale to Conversion phase',
  },
  {
    id: 'phase-3',
    name: 'Conversion',
    status: 'current',
    objective: 'Optimize sales process and close rates',
    initiatives: ['Sales automation', 'Email nurturing', 'Website optimization'],
    completedWork: ['Sales team training', 'Automation workflows setup', 'Website redesign initiated'],
    performance: 'Conversion rate improved 18% YTD',
    recommendations: ['Implement behavioral triggers', 'A/B test landing pages', 'Analyze sales cycle stages'],
    nextMilestone: 'Automation phase optimization',
  },
  {
    id: 'phase-4',
    name: 'Automation',
    status: 'pending',
    objective: 'Automate key business processes',
    initiatives: ['Process automation', 'Workflow optimization', 'System integration'],
    completedWork: [],
    performance: 'Pending',
    recommendations: [],
    nextMilestone: 'Scale phase preparation',
  },
  {
    id: 'phase-5',
    name: 'Scale',
    status: 'pending',
    objective: 'Scale systems for growth',
    initiatives: ['Team expansion', 'System scaling', 'Market expansion'],
    completedWork: [],
    performance: 'Pending',
    recommendations: [],
    nextMilestone: 'Market leadership',
  },
];

// ============================================================================
// PARTNER DATA
// ============================================================================

export const mockPartnerProfile: PartnerProfile = {
  id: 'partner-1',
  businessName: 'Mwangi Business Solutions',
  partnerType: 'Business Consultant',
  industry: 'Business Consulting',
  location: 'Nairobi, Kenya',
  phone: '+254 722 987 654',
  email: 'james@mbsolutions.co.ke',
  website: 'www.mbsolutions.co.ke',
  partnerStatus: 'active',
  joinDate: '2023-09-20',
  totalReferrals: 12,
  totalCommissionsEarned: 450000,
};

export const mockPartnerReferrals: Referral[] = [
  {
    id: 'ref-1',
    businessName: 'Boutique Retail Ltd',
    contactPerson: 'Catherine Kiplagat',
    phone: '+254 712 555 666',
    email: 'catherine@boutique.ke',
    industry: 'Retail',
    location: 'Nairobi',
    businessNeed: 'Digital transformation and e-commerce setup',
    status: 'won',
    referredBy: 'James Mwangi',
    referralDate: '2024-01-15',
    potentialValue: 500000,
    commission: {
      amount: 50000,
      status: 'paid',
      paymentDate: '2024-02-15',
    },
  },
  {
    id: 'ref-2',
    businessName: 'HealthFirst Clinic',
    contactPerson: 'Dr. Peter Otieno',
    phone: '+254 712 777 888',
    email: 'peter@healthfirst.ke',
    industry: 'Healthcare',
    location: 'Nairobi',
    businessNeed: 'CRM and appointment system',
    status: 'proposal',
    referredBy: 'James Mwangi',
    referralDate: '2024-02-01',
    potentialValue: 300000,
  },
  {
    id: 'ref-3',
    businessName: 'Marketing Hub Africa',
    contactPerson: 'Grace Kimani',
    phone: '+254 712 333 444',
    email: 'grace@mhub.co.ke',
    industry: 'Marketing Agency',
    location: 'Nairobi',
    businessNeed: 'AI-powered analytics platform',
    status: 'contacted',
    referredBy: 'James Mwangi',
    referralDate: '2024-02-10',
    potentialValue: 400000,
  },
];

export const mockPartnerCommissions: Commission[] = [
  {
    id: 'comm-1',
    referralId: 'ref-1',
    amount: 50000,
    status: 'paid',
    approvedDate: '2024-02-01',
    paidDate: '2024-02-15',
    notes: 'Boutique Retail Ltd - Contract signed',
  },
  {
    id: 'comm-2',
    referralId: 'ref-2',
    amount: 30000,
    status: 'approved',
    approvedDate: '2024-02-20',
    notes: 'HealthFirst Clinic - Proposal sent',
  },
  {
    id: 'comm-3',
    referralId: 'ref-3',
    amount: 40000,
    status: 'pending',
    notes: 'Marketing Hub Africa - Under review',
  },
];

export const mockPartnerOnboarding: OnboardingStep[] = [
  { id: 'step-1', name: 'Application Submitted', status: 'completed', order: 1 },
  { id: 'step-2', name: 'Application Review', status: 'completed', order: 2 },
  { id: 'step-3', name: 'Partner Agreement', status: 'completed', order: 3 },
  { id: 'step-4', name: 'Profile Completion', status: 'completed', order: 4 },
  { id: 'step-5', name: 'Orientation', status: 'in-progress', order: 5 },
  { id: 'step-6', name: 'Partner Activation', status: 'pending', order: 6 },
];

export const mockPartnerRewards: Reward[] = [
  {
    id: 'reward-1',
    name: 'First Referral',
    description: 'Successfully referred first business to NairobiX',
    category: 'milestone',
    earnedDate: '2024-01-15',
  },
  {
    id: 'reward-2',
    name: '5 Successful Referrals',
    description: 'Milestone recognition for 5 converted referrals',
    category: 'milestone',
    progress: { current: 2, target: 5 },
  },
  {
    id: 'reward-3',
    name: 'Commission Bonus - 100K+',
    description: 'Bonus for earning 100,000+ in commissions',
    category: 'bonus',
    progress: { current: 120, target: 100 },
    earnedDate: '2024-02-20',
  },
];

export const mockPartnerBenefits: Benefit[] = [
  {
    id: 'pben-1',
    name: 'Referral Conversation Guide',
    description: 'How to effectively identify and present NairobiX opportunities',
    category: 'playbook',
    status: 'available',
  },
  {
    id: 'pben-2',
    name: 'NairobiX Service Guide',
    description: 'Complete overview of all NairobiX services and solutions',
    category: 'playbook',
    status: 'available',
  },
  {
    id: 'pben-3',
    name: 'Partner Marketing Assets',
    description: 'Email templates, social media content, and promotional materials',
    category: 'playbook',
    status: 'available',
  },
  {
    id: 'pben-4',
    name: '20% Additional Commission for Top Referrers',
    description: 'Bonus commission tier for high-performing partners',
    category: 'discount',
    status: 'available',
  },
];

// ============================================================================
// STAFF DATA
// ============================================================================

export const mockPartnerApplications: PartnerApplication[] = [
  {
    id: 'papp-1',
    businessName: 'Tech Innovations Ltd',
    contactPerson: 'John Kimani',
    email: 'john@techinnovations.ke',
    phone: '+254 712 999 000',
    industry: 'Technology',
    applicationDate: '2024-02-25',
    status: 'under-review',
    notes: 'Strong background in tech sector, good network',
  },
  {
    id: 'papp-2',
    businessName: 'Strategy Partners',
    contactPerson: 'Lisa Omondi',
    email: 'lisa@strategypartners.ke',
    phone: '+254 712 555 999',
    industry: 'Business Consulting',
    applicationDate: '2024-02-20',
    status: 'submitted',
  },
];

// ============================================================================
// DASHBOARD SUMMARY DATA
// ============================================================================

export const mockStaffMetrics = {
  activeClients: 24,
  activePartners: 8,
  activeProjects: 31,
  openRequests: 5,
  newReferrals: 2,
  pendingInvoices: 3,
};

export const mockStaffNeedsAttention = [
  {
    id: 'att-1',
    type: 'request',
    title: 'New Service Request - TechStart Kenya',
    description: 'Website Performance Optimization - High Priority',
    date: '2024-02-27',
  },
  {
    id: 'att-2',
    type: 'partner',
    title: 'Partner Application Under Review',
    description: 'Tech Innovations Ltd - Review and approval needed',
    date: '2024-02-25',
  },
  {
    id: 'att-3',
    type: 'referral',
    title: 'New Referral Submitted',
    description: 'HealthFirst Clinic - Pending qualification review',
    date: '2024-02-24',
  },
  {
    id: 'att-4',
    type: 'invoice',
    title: 'Invoice Overdue',
    description: 'INV-2024-001 - Follow-up payment required',
    date: '2024-02-20',
  },
];
