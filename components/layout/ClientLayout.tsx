'use client';

import {
  LayoutDashboard,
  Rocket,
  FolderKanban,
  Layers,
  BarChart3,
  Lightbulb,
  FileText,
  FolderOpen,
  Mail,
  Compass,
  CreditCard,
  Gift,
  Bell,
  Settings,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockClientNotifications, mockCurrentUser } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

const clientNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/client', icon: <LayoutDashboard />, section: 'Workspace' },
  { label: 'Growth Journey', href: '/client/growth', icon: <Rocket />, section: 'Workspace' },

  { label: 'Projects', href: '/client/projects', icon: <FolderKanban />, section: 'Delivery' },
  { label: 'Services', href: '/client/services', icon: <Layers />, section: 'Delivery' },
  { label: 'Performance', href: '/client/performance', icon: <BarChart3 />, section: 'Delivery' },
  { label: 'Insights', href: '/client/insights', icon: <Lightbulb />, section: 'Delivery' },
  { label: 'Reports', href: '/client/reports', icon: <FileText />, section: 'Delivery' },

  { label: 'Documents', href: '/client/documents', icon: <FolderOpen />, section: 'Account' },
  { label: 'Requests', href: '/client/requests', icon: <Mail />, section: 'Account' },
  { label: 'Concierge', href: '/client/concierge', icon: <Compass />, section: 'Account' },
  { label: 'Billing', href: '/client/billing', icon: <CreditCard />, section: 'Account' },
  { label: 'Benefits', href: '/client/benefits', icon: <Gift />, section: 'Account' },

  {
    label: 'Notifications',
    href: '/client/notifications',
    icon: <Bell />,
    badge: mockClientNotifications.filter((n) => !n.read).length,
    section: 'Settings',
  },
  { label: 'Settings', href: '/client/settings', icon: <Settings />, section: 'Settings' },
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
      userInitials={getInitials(mockCurrentUser.name)}
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
