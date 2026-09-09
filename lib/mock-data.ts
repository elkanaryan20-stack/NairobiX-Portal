import {
  ClientProfile,
  PartnerProfile,
  PartnerType,
  PartnerCapabilities,
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
  ClientCampaign,
  ClientLead,
  ClientTask,
  GrowthPhase,
  OnboardingApplication,
  PartnerApplication,
  AssessmentQuestion,
  PartnerAssessment,
  PartnerProjectAssignment,
  PartnerTaskAssignment,
  ConsultationSession,
  Deliverable,
  User,
} from './types';

// ============================================================================
// PARTNER CAPABILITY PRESETS
// ============================================================================
//
// Default capability set granted to each partner type on approval. Staff can
// still adjust an individual partner's capabilities after activation — this
// preset only seeds sensible defaults.
export const PARTNER_CAPABILITY_PRESETS: Record<PartnerType, PartnerCapabilities> = {
  'Business Consultant': {
    referrals: true,
    opportunities: true,
    projects: true,
    tasks: true,
    consultations: true,
    deliverables: true,
    commissions: true,
  },
  'Marketing Agency': {
    referrals: true,
    opportunities: true,
    projects: true,
    tasks: true,
    consultations: true,
    deliverables: true,
    commissions: true,
  },
  'Business Centre': {
    referrals: true,
    opportunities: true,
    projects: false,
    tasks: false,
    consultations: false,
    deliverables: false,
    commissions: true,
  },
  'Cyber Cafe / ICT Centre': {
    referrals: true,
    opportunities: false,
    projects: false,
    tasks: false,
    consultations: false,
    deliverables: false,
    commissions: true,
  },
  'Printing / Branding Centre': {
    referrals: true,
    opportunities: false,
    projects: true,
    tasks: true,
    consultations: false,
    deliverables: true,
    commissions: true,
  },
};

// ============================================================================
// USERS
// ============================================================================

export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: undefined,
  role: 'client',
  nairobixContactId: 'CNT-10021',
};

export const mockPartnerUser: User = {
  id: 'partner-1',
  name: 'James Mwangi',
  email: 'james@partner.com',
  avatar: undefined,
  role: 'partner',
  nairobixContactId: 'CNT-10088',
};

export const mockStaffUser: User = {
  id: 'staff-1',
  name: 'Grace Kipchoge',
  email: 'grace@nairobix.com',
  avatar: undefined,
  role: 'staff',
  nairobixContactId: 'CNT-10004',
};

// ============================================================================
// CLIENT DATA
// ============================================================================

export const mockClientProfile: ClientProfile = {
  id: 'client-1',
  nairobixAccountId: 'ACC-20031',
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
    timeline: [
      { id: 'req1-t1', title: 'Request submitted', description: 'Ticket created by Sarah Johnson', timestamp: '2024-02-20', type: 'status-change' },
      { id: 'req1-t2', title: 'Assigned to Emma Wanjiru', description: 'Routed to the web performance team', timestamp: '2024-02-21', type: 'status-change', performedBy: 'NairobiX Support' },
      { id: 'req1-t3', title: 'Diagnostics underway', description: 'Server response times and asset sizes are being audited', timestamp: '2024-02-23', type: 'update', performedBy: 'Emma Wanjiru' },
    ],
  },
  {
    id: 'req-2',
    title: 'Q1 Strategy Session',
    type: 'strategy-session',
    description: 'Request for quarterly business strategy review meeting',
    status: 'submitted',
    createdDate: '2024-02-25',
    priority: 'medium',
    timeline: [
      { id: 'req2-t1', title: 'Request submitted', description: 'Ticket created by Sarah Johnson', timestamp: '2024-02-25', type: 'status-change' },
    ],
  },
  {
    id: 'req-3',
    title: 'Reporting discrepancy on lead source',
    type: 'reporting-question',
    description: 'Lead source attribution looks off for the last two weeks of campaign data',
    status: 'resolved',
    createdDate: '2024-02-08',
    dueDate: '2024-02-12',
    priority: 'low',
    assignedTo: 'David Kiplagat',
    timeline: [
      { id: 'req3-t1', title: 'Request submitted', description: 'Ticket created by Sarah Johnson', timestamp: '2024-02-08', type: 'status-change' },
      { id: 'req3-t2', title: 'Assigned to David Kiplagat', description: 'Routed to analytics', timestamp: '2024-02-08', type: 'status-change', performedBy: 'NairobiX Support' },
      { id: 'req3-t3', title: 'Root cause found', description: 'UTM tagging gap identified on the paid social campaign', timestamp: '2024-02-10', type: 'update', performedBy: 'David Kiplagat' },
      { id: 'req3-t4', title: 'Resolved', description: 'Attribution corrected and historical data backfilled', timestamp: '2024-02-12', type: 'status-change', performedBy: 'David Kiplagat' },
    ],
  },
];

export const mockClientCampaigns: ClientCampaign[] = [
  {
    id: 'camp-1',
    name: 'Q1 Paid Search — SaaS Buyers',
    channel: 'ppc',
    status: 'active',
    startDate: '2024-01-15',
    leadsGenerated: 42,
    conversionRate: 18,
  },
  {
    id: 'camp-2',
    name: 'LinkedIn Thought Leadership',
    channel: 'social',
    status: 'active',
    startDate: '2024-02-01',
    leadsGenerated: 19,
    conversionRate: 11,
  },
  {
    id: 'camp-3',
    name: 'SEO Content Sprint — H1',
    channel: 'seo',
    status: 'planning',
    startDate: '2024-03-10',
    leadsGenerated: 0,
  },
];

export const mockClientLeads: ClientLead[] = [
  { id: 'clead-1', name: 'Wanjiku Mercy', company: 'Amka Retailers', source: 'Paid Search', campaignId: 'camp-1', status: 'qualified', receivedDate: '2024-02-26', value: 180000 },
  { id: 'clead-2', name: 'Brian Otieno', company: 'Otieno & Partners', source: 'LinkedIn', campaignId: 'camp-2', status: 'contacted', receivedDate: '2024-02-24', value: 95000 },
  { id: 'clead-3', name: 'Faith Mwikali', company: 'Mwikali Logistics', source: 'Paid Search', campaignId: 'camp-1', status: 'new', receivedDate: '2024-02-28' },
  { id: 'clead-4', name: 'Kevin Njoroge', source: 'Referral form', status: 'converted', receivedDate: '2024-02-14', value: 220000 },
];

export const mockClientTasks: ClientTask[] = [
  { id: 'ctask-1', title: 'Approve homepage redesign mockups', status: 'pending', dueDate: '2024-03-05', relatedTo: 'Website Redesign', priority: 'high' },
  { id: 'ctask-2', title: 'Provide brand assets for campaign creative', status: 'in-progress', dueDate: '2024-03-08', relatedTo: 'Q1 Paid Search', priority: 'medium' },
  { id: 'ctask-3', title: 'Confirm CRM user list for training', status: 'pending', dueDate: '2024-03-10', relatedTo: 'CRM Implementation', priority: 'medium' },
  { id: 'ctask-4', title: 'Sign off on Q4 strategy review notes', status: 'completed', dueDate: '2024-02-20', relatedTo: 'Strategy Review', priority: 'low' },
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
  nairobixAccountId: 'ACC-20077',
  businessName: 'Mwangi Business Solutions',
  partnerType: 'Business Consultant',
  capabilities: PARTNER_CAPABILITY_PRESETS['Business Consultant'],
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

// Roster used by the Staff Command Center to demonstrate the capability
// system across different partner types (the logged-in demo partner above
// is one of these — Business Consultant).
export const mockAllPartners: PartnerProfile[] = [
  mockPartnerProfile,
  {
    id: 'partner-2',
    nairobixAccountId: 'ACC-20081',
    businessName: 'Nova Digital Marketing',
    partnerType: 'Marketing Agency',
    capabilities: PARTNER_CAPABILITY_PRESETS['Marketing Agency'],
    industry: 'Marketing & Advertising',
    location: 'Nairobi, Kenya',
    phone: '+254 733 221 456',
    email: 'hello@novadigital.co.ke',
    website: 'www.novadigital.co.ke',
    partnerStatus: 'active',
    joinDate: '2023-11-02',
    totalReferrals: 7,
    totalCommissionsEarned: 210000,
  },
  {
    id: 'partner-3',
    nairobixAccountId: 'ACC-20094',
    businessName: 'Ngong Road Business Centre',
    partnerType: 'Business Centre',
    capabilities: PARTNER_CAPABILITY_PRESETS['Business Centre'],
    industry: 'Business Services',
    location: 'Ngong Road, Nairobi',
    phone: '+254 701 445 998',
    email: 'info@ngongbc.co.ke',
    partnerStatus: 'active',
    joinDate: '2024-01-10',
    totalReferrals: 4,
    totalCommissionsEarned: 60000,
  },
  {
    id: 'partner-4',
    nairobixAccountId: 'ACC-20101',
    businessName: 'Kilimani CyberPoint',
    partnerType: 'Cyber Cafe / ICT Centre',
    capabilities: PARTNER_CAPABILITY_PRESETS['Cyber Cafe / ICT Centre'],
    industry: 'ICT Services',
    location: 'Kilimani, Nairobi',
    phone: '+254 700 112 233',
    email: 'kilimanicyberpoint@gmail.com',
    partnerStatus: 'active',
    joinDate: '2024-02-01',
    totalReferrals: 2,
    totalCommissionsEarned: 20000,
  },
  {
    id: 'partner-5',
    nairobixAccountId: 'ACC-20112',
    businessName: 'PrintCraft Branding Studio',
    partnerType: 'Printing / Branding Centre',
    capabilities: PARTNER_CAPABILITY_PRESETS['Printing / Branding Centre'],
    industry: 'Printing & Branding',
    location: 'Industrial Area, Nairobi',
    phone: '+254 720 556 331',
    email: 'orders@printcraft.co.ke',
    partnerStatus: 'onboarding',
    joinDate: '2024-02-20',
    totalReferrals: 0,
    totalCommissionsEarned: 0,
  },
];

export const mockPartnerReferrals: Referral[] = [
  {
    id: 'ref-1',
    nairobixDealId: 'DEAL-30145',
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
    nairobixDealId: 'DEAL-30146',
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
    nairobixDealId: 'DEAL-30147',
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

// The full 10-stage onboarding wizard state for PrintCraft Branding Studio
// (partner-5), the one partner currently mid-onboarding. Payment/commission
// setup is intentionally last and stays locked until review is approved.
export const mockOnboardingApplication: OnboardingApplication = {
  id: 'onb-5',
  partnerType: 'Printing / Branding Centre',
  currentStepId: 'verification',
  steps: [
    { id: 'partner-details', name: 'Partner Details', status: 'completed', order: 1 },
    { id: 'business-info', name: 'Business Information', status: 'completed', order: 2 },
    { id: 'location', name: 'Location', status: 'completed', order: 3 },
    { id: 'experience', name: 'Experience & Background', status: 'completed', order: 4 },
    { id: 'documents', name: 'Supporting Documents', status: 'completed', order: 5 },
    { id: 'verification', name: 'Verification', status: 'in-progress', order: 6 },
    { id: 'agreement', name: 'Partnership Agreement', status: 'pending', order: 7 },
    { id: 'assessment', name: 'Partner Assessment', status: 'pending', order: 8 },
    { id: 'review', name: 'Review & Approval', status: 'pending', order: 9 },
    { id: 'payment-setup', name: 'Payment & Commission Setup', status: 'locked', order: 10 },
  ],
  partnerDetails: {
    fullName: 'Daniel Mutiso',
    email: 'orders@printcraft.co.ke',
    phone: '+254 720 556 331',
  },
  businessInfo: {
    businessName: 'PrintCraft Branding Studio',
    businessDescription: 'Commercial printing, signage and branded merchandise for SMEs across Nairobi.',
    website: 'www.printcraftstudio.co.ke',
  },
  location: {
    city: 'Nairobi',
    address: 'Enterprise Road, Industrial Area',
  },
  experience: {
    yearsExperience: 6,
    background: 'Six years running a print production studio serving retail and hospitality clients, with an in-house design team.',
    clientNetwork: 'Active relationships with roughly 40 SMEs across retail, hospitality and events.',
  },
  documents: [
    { id: 'odoc-1', name: 'National ID', requirement: 'id', status: 'verified', uploadedDate: '2024-02-21' },
    { id: 'odoc-2', name: 'Business Registration Certificate', requirement: 'business-registration', status: 'uploaded', uploadedDate: '2024-02-21' },
    { id: 'odoc-3', name: 'Portfolio — recent branding work', requirement: 'portfolio', status: 'uploaded', uploadedDate: '2024-02-22' },
  ],
  verificationStatus: 'pending',
  agreementAccepted: false,
  assessmentId: 'assess-5',
  reviewStatus: 'not-submitted',
  paymentSetupComplete: false,
  lastSavedDate: '2024-02-22',
};

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

// Partner Work — only rendered for partners whose capabilities enable each
// area (projects/tasks/consultations/deliverables). The logged-in demo
// partner (Business Consultant) has all four enabled.
export const mockPartnerProjectAssignments: PartnerProjectAssignment[] = [
  { id: 'passign-1', projectName: 'CRM Implementation', clientName: 'TechStart Kenya Ltd', role: 'Delivery Consultant', status: 'active', startDate: '2024-01-15' },
  { id: 'passign-2', projectName: 'Retail Digital Transformation', clientName: 'Boutique Retail Ltd', role: 'Strategy Advisor', status: 'active', startDate: '2024-02-01' },
];

export const mockPartnerTaskAssignments: PartnerTaskAssignment[] = [
  { id: 'ptask-1', title: 'Review CRM field mapping proposal', projectName: 'CRM Implementation', status: 'pending', dueDate: '2024-03-06', priority: 'high' },
  { id: 'ptask-2', title: 'Draft go-to-market notes for retail rollout', projectName: 'Retail Digital Transformation', status: 'in-progress', dueDate: '2024-03-10', priority: 'medium' },
  { id: 'ptask-3', title: 'Share client intro deck template', status: 'completed', dueDate: '2024-02-18', priority: 'low' },
];

export const mockConsultationSessions: ConsultationSession[] = [
  { id: 'cons-1', topic: 'Growth strategy alignment — TechStart Kenya', clientName: 'TechStart Kenya Ltd', scheduledDate: '2024-03-07', status: 'scheduled' },
  { id: 'cons-2', topic: 'Retail rollout kickoff', clientName: 'Boutique Retail Ltd', scheduledDate: '2024-02-22', status: 'completed', notes: 'Agreed phased rollout starting with two flagship stores.' },
];

export const mockDeliverables: Deliverable[] = [
  { id: 'deliv-1', title: 'CRM field-mapping recommendation', projectName: 'CRM Implementation', status: 'in-progress', dueDate: '2024-03-08' },
  { id: 'deliv-2', title: 'Retail rollout readiness checklist', projectName: 'Retail Digital Transformation', status: 'submitted', dueDate: '2024-02-28', submittedDate: '2024-02-27' },
  { id: 'deliv-3', title: 'Client intro deck template', status: 'approved', dueDate: '2024-02-15', submittedDate: '2024-02-14' },
];

export const mockPartnerDocuments: Document[] = [
  {
    id: 'pdoc-1',
    name: 'Partner Agreement 2023',
    type: 'pdf',
    category: 'agreements',
    uploadDate: '2023-09-20',
    status: 'active',
  },
  {
    id: 'pdoc-2',
    name: 'Commission Statement - February 2024',
    type: 'pdf',
    category: 'financial',
    uploadDate: '2024-02-28',
    status: 'active',
  },
  {
    id: 'pdoc-3',
    name: 'NairobiX Brand Guidelines',
    type: 'pdf',
    category: 'resources',
    uploadDate: '2023-10-05',
    status: 'active',
  },
];

export const mockPartnerNotifications: Notification[] = [
  {
    id: 'pnotif-1',
    title: 'Commission Approved',
    message: 'Your commission for HealthFirst Clinic has been approved',
    type: 'billing',
    date: '2024-02-20',
    read: false,
  },
  {
    id: 'pnotif-2',
    title: 'Referral Status Updated',
    message: 'Marketing Hub Africa moved to Contacted',
    type: 'report',
    date: '2024-02-10',
    read: false,
  },
  {
    id: 'pnotif-3',
    title: 'New Reward Unlocked',
    message: 'You earned the Commission Bonus - 100K+ reward',
    type: 'announcement',
    date: '2024-02-20',
    read: true,
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
    partnerType: 'Business Consultant',
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
    partnerType: 'Business Consultant',
    applicationDate: '2024-02-20',
    status: 'submitted',
  },
  {
    id: 'papp-3',
    businessName: 'PrintCraft Branding Studio',
    contactPerson: 'Daniel Mutiso',
    email: 'orders@printcraft.co.ke',
    phone: '+254 720 556 331',
    industry: 'Printing & Branding',
    partnerType: 'Printing / Branding Centre',
    applicationDate: '2024-02-20',
    status: 'verification',
    onboardingApplicationId: 'onb-5',
    notes: 'Strong portfolio, ID and business registration submitted — awaiting document verification.',
  },
];

// ============================================================================
// PARTNER ASSESSMENT
// ============================================================================

export const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'aq-1',
    category: 'Experience',
    question: 'How many years has your business been operating?',
    type: 'choice',
    options: ['Less than 1 year', '1–3 years', '3–5 years', '5+ years'],
  },
  {
    id: 'aq-2',
    category: 'Experience',
    question: 'Describe the type of work you or your business are best known for.',
    type: 'text',
    helperText: 'A short description helps NairobiX match the right opportunities to you.',
  },
  {
    id: 'aq-3',
    category: 'Network & Reach',
    question: 'Roughly how many active business clients or contacts do you engage with regularly?',
    type: 'choice',
    options: ['Fewer than 10', '10–40', '40–100', '100+'],
  },
  {
    id: 'aq-4',
    category: 'Network & Reach',
    question: 'How confident are you in identifying businesses that need growth or digital transformation support?',
    type: 'scale',
    helperText: '1 = Not confident, 5 = Very confident',
  },
  {
    id: 'aq-5',
    category: 'Service Capability',
    question: 'What services could you directly support or deliver as part of a NairobiX engagement?',
    type: 'text',
  },
  {
    id: 'aq-6',
    category: 'Service Capability',
    question: 'How would you rate your capacity to take on new client work in the next 3 months?',
    type: 'scale',
    helperText: '1 = Very limited, 5 = High capacity',
  },
  {
    id: 'aq-7',
    category: 'NairobiX Fit',
    question: 'What does "business growth partner" mean to you in the context of NairobiX?',
    type: 'text',
  },
  {
    id: 'aq-8',
    category: 'NairobiX Fit',
    question: 'How aligned do you feel your business values are with a premium, consultative growth partner?',
    type: 'scale',
    helperText: '1 = Not aligned, 5 = Strongly aligned',
  },
];

export const mockPartnerAssessment: PartnerAssessment = {
  id: 'assess-5',
  partnerApplicationId: 'papp-3',
  status: 'not-started',
  responses: [],
};

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
