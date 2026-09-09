'use client';

import {
  LayoutDashboard,
  ClipboardCheck,
  Share2,
  Briefcase,
  ListChecks,
  Wallet,
  BookOpen,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockPartnerUser, mockPartnerProfile } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

interface PartnerLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
}

// Navigation is capability-aware: a partner only sees Opportunities and Work
// if their approved capabilities include them, and Onboarding disappears
// once they're fully active. This keeps every partner type looking at a
// nav built for what they actually do, not a fixed list of every module.
export function PartnerLayout({
  children,
  pageTitle,
  pageSubtitle,
  headerActions,
}: PartnerLayoutProps) {
  const { capabilities, partnerStatus } = mockPartnerProfile;
  const isOnboarding = partnerStatus !== 'active';
  const hasWorkAccess =
    capabilities.projects || capabilities.tasks || capabilities.consultations || capabilities.deliverables;

  const partnerNavigation: NavigationItem[] = [
    { label: 'Overview', href: '/partner', icon: <LayoutDashboard /> },
    ...(isOnboarding
      ? [{ label: 'Onboarding', href: '/partner/onboarding', icon: <ClipboardCheck /> }]
      : []),
    ...(capabilities.referrals
      ? [{ label: 'Referrals', href: '/partner/referrals', icon: <Share2 /> }]
      : []),
    ...(capabilities.opportunities
      ? [{ label: 'Opportunities', href: '/partner/opportunities', icon: <Briefcase /> }]
      : []),
    ...(hasWorkAccess ? [{ label: 'Work', href: '/partner/work', icon: <ListChecks /> }] : []),
    ...(capabilities.commissions
      ? [{ label: 'Earnings', href: '/partner/earnings', icon: <Wallet /> }]
      : []),
    { label: 'Resources', href: '/partner/resources', icon: <BookOpen /> },
  ];

  return (
    <PageLayout
      workspaceName="Partner Workspace"
      navigation={partnerNavigation}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      headerActions={headerActions}
      notificationsHref="/partner/notifications"
      settingsHref="/partner/settings"
      userName={mockPartnerUser.name}
      userInitials={getInitials(mockPartnerUser.name)}
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
