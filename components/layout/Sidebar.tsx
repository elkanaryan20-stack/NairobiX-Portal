'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Bell, ChevronDown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, NavigationItem } from '@/lib/types';
import { signOut } from '@/lib/auth/actions';

interface SidebarProps {
  /** Who the Portal is showing, e.g. "Client · TechStart Kenya Ltd". */
  contextLabel: string;
  navigation: NavigationItem[];
  userInitials: string;
  userName: string;
  userEmail: string;
  settingsHref?: string;
}

function groupNavigation(navigation: NavigationItem[]) {
  const groups: { section: string | undefined; items: NavigationItem[] }[] = [];
  for (const item of navigation) {
    const last = groups[groups.length - 1];
    if (last && last.section === item.section) {
      last.items.push(item);
    } else {
      groups.push({ section: item.section, items: [item] });
    }
  }
  return groups;
}

function NavLink({ item, onClick }: { item: NavigationItem; onClick?: () => void }) {
  const pathname = usePathname();
  // A context's Overview (e.g. /portal/client) is a prefix of every page in it, so it only matches exactly.
  const isContextRoot = item.href.split('/').length <= 3;
  const isActive = pathname === item.href || (!isContextRoot && pathname.startsWith(item.href + '/'));

  return (
    <Link href={item.href} onClick={onClick}>
      <span
        className={cn(
          'group relative flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-white/[0.05] text-fg'
            : 'text-fg-secondary hover:bg-white/[0.03] hover:text-fg'
        )}
      >
        {isActive && (
          <span className="absolute -left-3 top-1/2 h-5 w-px -translate-y-1/2 bg-primary" />
        )}
        <span
          className={cn(
            'flex h-5 w-5 flex-shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]',
            isActive ? 'text-primary' : 'text-fg-tertiary group-hover:text-fg-secondary'
          )}
        >
          {item.icon}
        </span>
        <span className="flex-1 text-left truncate">{item.label}</span>
        {!!item.badge && (
          <span className="rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-primary-300">
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

function SidebarContent({
  contextLabel,
  navigation,
  userInitials,
  userName,
  userEmail,
  settingsHref,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const groups = groupNavigation(navigation);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo */}
      <div className="border-b border-line px-6 pb-5 pt-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[15px] font-semibold tracking-tight text-fg">NairobiX</span>
          <span className="ml-auto rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fg-tertiary">
            Portal
          </span>
        </div>
        <p className="mt-3 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">{contextLabel}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group, i) => (
          <div key={i}>
            {group.section && (
              <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px bg-line" />

      {/* User Profile */}
      <div className="p-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line bg-surface-3 text-xs font-semibold text-fg">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{userName}</p>
              <p className="truncate text-xs text-fg-tertiary">{userEmail}</p>
            </div>
            <ChevronDown size={14} className="flex-shrink-0 text-fg-tertiary" />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-line-strong bg-surface-2">
              {settingsHref && (
                <Link href={settingsHref} onClick={onNavigate}>
                  <span className="flex w-full items-center gap-2 border-b border-line px-4 py-2.5 text-left text-sm text-fg-secondary transition-colors hover:bg-white/[0.04] hover:text-fg">
                    <Settings size={15} />
                    Settings
                  </span>
                </Link>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-fg-secondary transition-colors hover:bg-white/[0.04] hover:text-fg"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: Omit<SidebarProps, 'notifications' | 'onNotificationClick'>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-line bg-canvas/80 px-4 py-3.5 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-fg">NairobiX</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-full border border-line p-1.5 text-fg-secondary hover:border-line-strong hover:text-fg"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop / tablet persistent sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-canvas md:flex">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!isOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/70 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[82%] max-w-xs border-r border-line bg-canvas transition-transform duration-300 ease-smooth',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="absolute right-3 top-4 rounded-sm p-1.5 text-fg-tertiary hover:bg-white/[0.05]"
          >
            <X size={20} />
          </button>
          <SidebarContent {...props} onNavigate={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  notifications?: Notification[];
  notificationsHref?: string;
}

export function Header({
  title,
  subtitle,
  actions,
  notifications = [],
  notificationsHref,
}: HeaderProps) {
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 pb-3 pt-[4.25rem] md:px-8 md:py-5">
        <div className="min-w-0">
          <h2 className="truncate font-serif text-xl font-medium tracking-tight text-fg md:text-[28px]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 hidden truncate text-sm text-fg-tertiary md:block">{subtitle}</p>}
        </div>

        <div className="flex flex-shrink-0 items-center gap-3 md:gap-5">
          {actions}

          {notificationsHref && (
            <Link
              href={notificationsHref}
              aria-label="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-fg-secondary transition-colors hover:border-primary/50 hover:text-fg"
            >
              <Bell size={17} />
              {unreadNotifications > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-canvas ring-2 ring-canvas">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

interface PageLayoutProps {
  children: React.ReactNode;
  contextLabel: string;
  navigation: NavigationItem[];
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
  notifications?: Notification[];
  notificationsHref?: string;
  settingsHref?: string;
  userName: string;
  userEmail: string;
  userInitials: string;
}

export function PageLayout({
  children,
  contextLabel,
  navigation,
  pageTitle,
  pageSubtitle,
  headerActions,
  notifications = [],
  notificationsHref,
  settingsHref,
  userName,
  userEmail,
  userInitials,
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-canvas">
      <Sidebar
        contextLabel={contextLabel}
        navigation={navigation}
        userName={userName}
        userEmail={userEmail}
        userInitials={userInitials}
        settingsHref={settingsHref}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={pageTitle}
          subtitle={pageSubtitle}
          actions={headerActions}
          notifications={notifications}
          notificationsHref={notificationsHref}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container-max px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
