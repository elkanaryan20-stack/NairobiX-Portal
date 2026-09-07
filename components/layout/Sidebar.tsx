'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/lib/types';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  workspaceName: string;
  navigation: NavigationItem[];
  notifications?: Notification[];
  userInitials?: string;
  userName?: string;
  onLogout?: () => void;
}

export function Sidebar({
  workspaceName,
  navigation,
  userInitials = 'SJ',
  userName = 'Sarah Johnson',
  onLogout,
}: Omit<SidebarProps, 'notifications' | 'onNotificationClick'>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-50">
        <div className="font-semibold text-neutral-900">NairobiX</div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-300 z-40 pt-4 lg:pt-0',
          !isOpen && 'lg:translate-x-0 -translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-6 mb-8 hidden lg:block">
          <h1 className="text-2xl font-bold text-neutral-900">NairobiX</h1>
          <p className="text-xs text-neutral-600 mt-1">{workspaceName}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors relative',
                    isActive
                      ? 'bg-orange-50 text-primary'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-neutral-200 mx-3 my-4" />

        {/* User Profile */}
        <div className="px-3 pb-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {userInitials}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900">{userName}</p>
                <p className="text-xs text-neutral-600">View Profile</p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                <Link href="/settings" className="block">
                  <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 first:rounded-t-lg">
                    <User size={16} />
                    Profile Settings
                  </button>
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 last:rounded-b-lg border-t border-neutral-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
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
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
      <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="mt-12 lg:mt-0">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-neutral-600 text-sm mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          {actions}

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={pageTitle}
          subtitle={pageSubtitle}
          actions={headerActions}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container-max py-8 px-4 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
