'use client';

import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockClientNotifications, mockCurrentUser } from '@/lib/mock-data';

const clientNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/client', icon: '📊' },
  { label: 'Growth Journey', href: '/client/growth', icon: '🚀' },
  { label: 'Projects', href: '/client/projects', icon: '📋' },
  { label: 'Services', href: '/client/services', icon: '⚙️' },
  { label: 'Performance', href: '/client/performance', icon: '📈' },
  { label: 'Insights', href: '/client/insights', icon: '💡' },
  { label: 'Reports', href: '/client/reports', icon: '📄' },
  { label: 'Documents', href: '/client/documents', icon: '📑' },
  { label: 'Requests', href: '/client/requests', icon: '✉️' },
  { label: 'Concierge', href: '/client/concierge', icon: '🎯' },
  { label: 'Billing', href: '/client/billing', icon: '💳' },
  { label: 'Benefits', href: '/client/benefits', icon: '🎁' },
  {
    label: 'Notifications',
    href: '/client/notifications',
    icon: '🔔',
    badge: mockClientNotifications.filter((n) => !n.read).length,
  },
  { label: 'Settings', href: '/client/settings', icon: '⚙️' },
];

interface ClientLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
}

export function ClientLayout({
  children,
  pageTitle,
  pageSubtitle,
  headerActions,
}: ClientLayoutProps) {
  return (
    <PageLayout
      workspaceName="Growth Workspace"
      navigation={clientNavigation}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      headerActions={headerActions}
      notifications={mockClientNotifications}
      userName={mockCurrentUser.name}
      userInitials="SJ"
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
