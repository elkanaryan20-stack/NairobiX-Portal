'use client';

import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  ClipboardCheck,
  CreditCard,
  FolderKanban,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Rocket,
  Settings,
  Share2,
  Wallet,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/Sidebar';
import { usePortalSession } from '@/components/portal/PortalSession';
import { RELATIONSHIP_LABELS, relationshipForPath, type ModuleIcon } from '@/lib/access/modules';
import { mockClientNotifications } from '@/lib/mock-data';
import type { NavigationItem } from '@/lib/types';
import { getInitials } from '@/lib/utils';

const MODULE_ICONS: Record<ModuleIcon, React.ReactNode> = {
  overview: <LayoutDashboard />,
  growth: <Rocket />,
  work: <Briefcase />,
  insights: <BarChart3 />,
  billing: <CreditCard />,
  support: <LifeBuoy />,
  resources: <FolderOpen />,
  onboarding: <ClipboardCheck />,
  referrals: <Share2 />,
  opportunities: <Briefcase />,
  tasks: <ListChecks />,
  earnings: <Wallet />,
  pipeline: <GitBranch />,
  accounts: <Building2 />,
  delivery: <FolderKanban />,
  reports: <BarChart3 />,
  notifications: <Bell />,
  settings: <Settings />,
};

interface PortalLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * The single authenticated NairobiX Portal shell. Replaces the former
 * per-workspace Client / Partner / Staff layouts: navigation comes from the
 * server-resolved permissions, and the header adapts to whichever
 * Relationship the current page belongs to.
 */
export function PortalLayout({ children, pageTitle, pageSubtitle, headerActions }: PortalLayoutProps) {
  const pathname = usePathname();
  const session = usePortalSession();

  const navigation: NavigationItem[] = session.navigation.map((item) => ({
    label: item.label,
    href: item.href,
    icon: MODULE_ICONS[item.icon],
    badge: item.badge,
    section: item.section,
  }));

  const context = relationshipForPath(pathname);
  const notificationsHref =
    context && context !== 'staff' && session.can(`${context}.notifications` as const)
      ? `/portal/${context}/notifications`
      : undefined;
  const settingsHref = context && session.can(`${context}.settings` as const) ? `/portal/${context}/settings` : undefined;

  const [only] = session.relationships;
  const contextLabel =
    session.relationships.length === 1 && only
      ? only.type === 'staff'
        ? 'NairobiX Staff'
        : `${RELATIONSHIP_LABELS[only.type]} · ${only.accountName}`
      : 'NairobiX Portal';

  return (
    <PageLayout
      contextLabel={contextLabel}
      navigation={navigation}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      headerActions={headerActions}
      notifications={context === 'client' ? mockClientNotifications : []}
      notificationsHref={notificationsHref}
      settingsHref={settingsHref}
      userName={session.name}
      userEmail={session.email}
      userInitials={getInitials(session.name)}
    >
      {children}
    </PageLayout>
  );
}
