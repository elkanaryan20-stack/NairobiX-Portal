'use client';

import {
  LayoutDashboard,
  ClipboardCheck,
  Share2,
  Briefcase,
  Wallet,
  Lightbulb,
  Megaphone,
  BookOpen,
  Trophy,
  FolderOpen,
  Bell,
  Settings,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockPartnerUser } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

const partnerNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/partner', icon: <LayoutDashboard />, section: 'Workspace' },
  { label: 'Onboarding', href: '/partner/onboarding', icon: <ClipboardCheck />, section: 'Workspace' },

  { label: 'Referrals', href: '/partner/referrals', icon: <Share2 />, section: 'Pipeline' },
  { label: 'Opportunities', href: '/partner/opportunities', icon: <Briefcase />, section: 'Pipeline' },
  { label: 'Commissions', href: '/partner/commissions', icon: <Wallet />, section: 'Pipeline' },

  { label: 'Insights', href: '/partner/insights', icon: <Lightbulb />, section: 'Growth' },
  { label: 'Updates', href: '/partner/updates', icon: <Megaphone />, section: 'Growth' },
  { label: 'Resources', href: '/partner/resources', icon: <BookOpen />, section: 'Growth' },
  { label: 'Rewards', href: '/partner/rewards', icon: <Trophy />, section: 'Growth' },

  { label: 'Documents', href: '/partner/documents', icon: <FolderOpen />, section: 'Account' },
  { label: 'Notifications', href: '/partner/notifications', icon: <Bell />, section: 'Account' },
  { label: 'Settings', href: '/partner/settings', icon: <Settings />, section: 'Account' },
];

interface PartnerLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
}

export function PartnerLayout({
  children,
  pageTitle,
  pageSubtitle,
  headerActions,
}: PartnerLayoutProps) {
  return (
    <PageLayout
      workspaceName="Partner Workspace"
      navigation={partnerNavigation}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      headerActions={headerActions}
      userName={mockPartnerUser.name}
      userInitials={getInitials(mockPartnerUser.name)}
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
