'use client';

import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';

const partnerNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/partner', icon: '📊' },
  { label: 'Onboarding', href: '/partner/onboarding', icon: '🚀' },
  { label: 'Referrals', href: '/partner/referrals', icon: '🔗' },
  { label: 'Opportunities', href: '/partner/opportunities', icon: '💼' },
  { label: 'Commissions', href: '/partner/commissions', icon: '💰' },
  { label: 'Insights', href: '/partner/insights', icon: '💡' },
  { label: 'Updates', href: '/partner/updates', icon: '📢' },
  { label: 'Resources', href: '/partner/resources', icon: '📚' },
  { label: 'Rewards', href: '/partner/rewards', icon: '🏆' },
  { label: 'Documents', href: '/partner/documents', icon: '📑' },
  { label: 'Notifications', href: '/partner/notifications', icon: '🔔' },
  { label: 'Settings', href: '/partner/settings', icon: '⚙️' },
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
      userName="James Mwangi"
      userInitials="JM"
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
