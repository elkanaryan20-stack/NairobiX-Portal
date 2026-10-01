/**
 * Demo-only editorial content for local development. Loaded server-side and
 * only when lib/crm/mode.ts reports demo mode, so it never reaches a
 * production page or bundle.
 */

export interface ParticipantUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'achievement' | 'announcement' | 'event' | 'update';
}

export interface ParticipantInsight {
  id: string;
  title: string;
  summary: string;
  icon: 'target' | 'trending' | 'wallet';
  points: string[];
}

export interface StaffConversation {
  id: string;
  name: string;
  lastMessage: string;
  date: string;
  unread: number;
}

export const demoParticipantUpdates: ParticipantUpdate[] = [
  {
    id: 'upd1',
    title: 'New Commission Tier Unlocked',
    content: "You've reached 10 successful referrals! Your commission rate has increased to 15%.",
    date: '2024-03-15',
    type: 'achievement',
  },
  {
    id: 'upd2',
    title: 'Service Expansion Announcement',
    content: 'NairobiX is launching AI-powered analytics solutions. Early partners receive 20% bonus commissions.',
    date: '2024-03-10',
    type: 'announcement',
  },
  {
    id: 'upd3',
    title: 'Q2 Partner Summit Scheduled',
    content: 'Join us for an exclusive virtual summit on May 15th. Network with top partners and learn growth strategies.',
    date: '2024-03-08',
    type: 'event',
  },
  {
    id: 'upd4',
    title: 'Referral Resource Library Updated',
    content: 'New sales templates, pitch decks and one-pagers are now available below.',
    date: '2024-03-05',
    type: 'update',
  },
];

export const demoParticipantInsights: ParticipantInsight[] = [
  {
    id: 'ins1',
    title: 'Referral Quality Best Practices',
    summary: 'How to submit qualified leads that convert',
    icon: 'target',
    points: [
      'Focus on decision-makers in target industries',
      'Include specific business challenges in the description',
      'Provide direct contact information when possible',
    ],
  },
  {
    id: 'ins2',
    title: 'High-Converting Industries',
    summary: 'Where your referrals have the best success rate',
    icon: 'trending',
    points: ['Technology & SaaS (52% conversion)', 'Retail & E-commerce (48% conversion)', 'Financial Services (45% conversion)'],
  },
  {
    id: 'ins3',
    title: 'Commission Maximization',
    summary: 'Strategies to earn more from your referrals',
    icon: 'wallet',
    points: [
      'Bundle multiple services for higher project value',
      'Refer businesses at growth inflection points',
      'Follow up on qualified leads within 2 weeks',
    ],
  },
];

export const demoStaffConversations: StaffConversation[] = [
  { id: 'conv1', name: 'TechStart Kenya Ltd — Project Kickoff', lastMessage: 'Confirmed meeting for Monday at 2 PM', date: '2024-03-10', unread: 3 },
  { id: 'conv2', name: 'James Mwangi — New Referral Discussion', lastMessage: 'Thanks for the opportunity details', date: '2024-03-09', unread: 0 },
  { id: 'conv3', name: 'Boutique Retail Ltd — Strategy Call', lastMessage: 'Next steps for Q2 campaign', date: '2024-03-08', unread: 1 },
];
