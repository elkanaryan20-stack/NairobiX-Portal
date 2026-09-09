'use client';

import {
  LayoutDashboard,
  GitBranch,
  Building2,
  FolderKanban,
  LifeBuoy,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { NavigationItem } from '@/lib/types';
import { mockStaffUser, mockStaffNeedsAttention } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

// Seven destinations that mirror how staff actually operate the business —
// pipeline review, account management, delivery, support, billing and
// reporting — rather than one nav item per CRM module.
const staffNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/staff', icon: <LayoutDashboard /> },
  {
    label: 'Pipeline',
    href: '/staff/pipeline',
    icon: <GitBranch />,
    badge: mockStaffNeedsAttention.filter((a) => a.type === 'partner' || a.type === 'referral').length,
  },
  { label: 'Accounts', href: '/staff/accounts', icon: <Building2 /> },
  { label: 'Delivery', href: '/staff/delivery', icon: <FolderKanban /> },
  { label: 'Support', href: '/staff/support', icon: <LifeBuoy /> },
  { label: 'Billing', href: '/staff/billing', icon: <CreditCard /> },
  { label: 'Reports', href: '/staff/reports', icon: <BarChart3 /> },
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
      settingsHref="/staff/settings"
      userName={mockStaffUser.name}
      userInitials={getInitials(mockStaffUser.name)}
      onLogout={() => (window.location.href = '/')}
    >
      {children}
    </PageLayout>
  );
}
