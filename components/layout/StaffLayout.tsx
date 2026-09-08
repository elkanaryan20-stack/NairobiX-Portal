'use client';

import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  FolderKanban,
  Inbox,
  FolderOpen,
  MessageSquare,
  Share2,
  CreditCard,
  BarChart3,
  Settings,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockStaffUser } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

const staffNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/staff', icon: <LayoutDashboard />, section: 'Workspace' },

  { label: 'Clients', href: '/staff/clients', icon: <Users />, section: 'Relationships' },
  { label: 'Partners', href: '/staff/partners', icon: <HeartHandshake />, section: 'Relationships' },
  { label: 'Referrals', href: '/staff/referrals', icon: <Share2 />, section: 'Relationships' },

  { label: 'Projects', href: '/staff/projects', icon: <FolderKanban />, section: 'Delivery' },
  { label: 'Service Requests', href: '/staff/requests', icon: <Inbox />, section: 'Delivery' },
  { label: 'Communications', href: '/staff/communications', icon: <MessageSquare />, section: 'Delivery' },

  { label: 'Documents', href: '/staff/documents', icon: <FolderOpen />, section: 'Operations' },
  { label: 'Billing', href: '/staff/billing', icon: <CreditCard />, section: 'Operations' },
  { label: 'Analytics', href: '/staff/analytics', icon: <BarChart3 />, section: 'Operations' },

  { label: 'Settings', href: '/staff/settings', icon: <Settings />, section: 'Account' },
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
      userName={mockStaffUser.name}
      userInitials={getInitials(mockStaffUser.name)}
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
