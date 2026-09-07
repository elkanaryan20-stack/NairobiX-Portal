'use client';

import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';

const staffNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/staff', icon: '📊' },
  { label: 'Clients', href: '/staff/clients', icon: '👥' },
  { label: 'Partners', href: '/staff/partners', icon: '🤝' },
  { label: 'Projects', href: '/staff/projects', icon: '📋' },
  { label: 'Service Requests', href: '/staff/requests', icon: '✉️' },
  { label: 'Documents', href: '/staff/documents', icon: '📑' },
  { label: 'Communications', href: '/staff/communications', icon: '💬' },
  { label: 'Referrals', href: '/staff/referrals', icon: '🔗' },
  { label: 'Billing', href: '/staff/billing', icon: '💳' },
  { label: 'Analytics', href: '/staff/analytics', icon: '📈' },
  { label: 'Settings', href: '/staff/settings', icon: '⚙️' },
];

interface StaffLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
}

export function StaffLayout({
  children,
  pageTitle,
  pageSubtitle,
  headerActions,
}: StaffLayoutProps) {
  return (
    <PageLayout
      workspaceName="Command Center"
      navigation={staffNavigation}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      headerActions={headerActions}
      userName="Grace Kipchoge"
      userInitials="GK"
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
