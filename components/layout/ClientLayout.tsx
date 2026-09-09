'use client';

import {
  LayoutDashboard,
  Rocket,
  Briefcase,
  BarChart3,
  CreditCard,
  LifeBuoy,
  FolderOpen,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockClientNotifications, mockCurrentUser, mockClientServiceRequests } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

// Six concise destinations that answer what the client actually comes to
// the portal to do — not a page per CRM module. Settings and Notifications
// live in the user menu / header bell instead of taking a nav slot.
const clientNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/client', icon: <LayoutDashboard /> },
  { label: 'Growth', href: '/client/growth', icon: <Rocket /> },
  { label: 'Work', href: '/client/work', icon: <Briefcase /> },
  { label: 'Insights', href: '/client/insights', icon: <BarChart3 /> },
  { label: 'Billing', href: '/client/billing', icon: <CreditCard /> },
  {
    label: 'Support',
    href: '/client/support',
    icon: <LifeBuoy />,
    badge: mockClientServiceRequests.filter((r) => r.status !== 'resolved').length,
  },
  { label: 'Resources', href: '/client/resources', icon: <FolderOpen /> },
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
      notificationsHref="/client/notifications"
      settingsHref="/client/settings"
      userName={mockCurrentUser.name}
      userInitials={getInitials(mockCurrentUser.name)}
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
