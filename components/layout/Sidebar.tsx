'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, NavigationItem } from '@/lib/types';

interface SidebarProps {
  workspaceName: string;
  navigation: NavigationItem[];
  userInitials?: string;
  userName?: string;
  onLogout?: () => void;
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
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link href={item.href} onClick={onClick}>
      <span
        className={cn(
          'group relative flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
        )}
        <span
          className={cn(
            'flex h-5 w-5 flex-shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]',
            isActive ? 'text-primary' : 'text-neutral-400 group-hover:text-neutral-600'
          )}
        >
          {item.icon}
        </span>
        <span className="flex-1 text-left truncate">{item.label}</span>
        {!!item.badge && (
          <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-primary-700">
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

function SidebarContent({
  workspaceName,
  navigation,
  userInitials = 'SJ',
  userName = 'Sarah Johnson',
  onLogout,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const groups = groupNavigation(navigation);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="mb-2 px-5 pt-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold tracking-wide text-neutral-900">NairobiX</span>
        </div>
        <p className="mt-1 text-xs text-neutral-500">{workspaceName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group, i) => (
          <div key={i}>
            {group.section && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
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
      <div className="mx-3 h-px bg-neutral-200" />

      {/* User Profile */}
      <div className="p-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-neutral-100"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900">{userName}</p>
              <p className="text-xs text-neutral-500">View profile</p>
            </div>
            <ChevronDown size={14} className="flex-shrink-0 text-neutral-400" />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-lg">
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <LogOut size={15} />
                Switch workspace
              </button>
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
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3.5 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-neutral-900">NairobiX</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-sm p-1.5 text-neutral-600 hover:bg-neutral-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop / tablet persistent sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-neutral-200 bg-white md:flex">
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
            'absolute inset-0 bg-ink-950/50 backdrop-blur-[2px] transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[82%] max-w-xs bg-white shadow-xl transition-transform duration-300 ease-smooth',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="absolute right-3 top-4 rounded-sm p-1.5 text-neutral-500 hover:bg-neutral-100"
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
  onNotificationClick?: () => void;
}

export function Header({
  title,
  subtitle,
  actions,
  notifications = [],
  onNotificationClick,
}: HeaderProps) {
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-5 pb-5 pt-[4.5rem] md:px-8 md:py-5">
        <div className="min-w-0">
          <h2 className="truncate font-serif text-2xl font-medium text-neutral-900 md:text-[28px]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 truncate text-sm text-neutral-500">{subtitle}</p>}
        </div>

        <div className="flex flex-shrink-0 items-center gap-3 md:gap-5">
          {actions}

          <button
            onClick={onNotificationClick}
            aria-label="Notifications"
            className="relative rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Bell size={19} />
            {unreadNotifications > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

interface PageLayoutProps {
  children: React.ReactNode;
  workspaceName: string;
  navigation: NavigationItem[];
  pageTitle: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
  notifications?: Notification[];
  userName?: string;
  userInitials?: string;
  onLogout?: () => void;
  onNotificationClick?: () => void;
}

export function PageLayout({
  children,
  workspaceName,
  navigation,
  pageTitle,
  pageSubtitle,
  headerActions,
  notifications = [],
  userName,
  userInitials,
  onLogout,
  onNotificationClick,
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar
        workspaceName={workspaceName}
        navigation={navigation}
        userName={userName}
        userInitials={userInitials}
        onLogout={onLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={pageTitle}
          subtitle={pageSubtitle}
          actions={headerActions}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container-max px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
