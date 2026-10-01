'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Badge } from '@/components/ui/Card';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';
import { useState } from 'react';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { Lightbulb, FileText, FolderOpen, FolderKanban, Mail, CreditCard, Megaphone, CheckCheck } from 'lucide-react';

const typeIcon: Record<string, React.ReactNode> = {
  insight: <Lightbulb />,
  report: <FileText />,
  document: <FolderOpen />,
  project: <FolderKanban />,
  request: <Mail />,
  billing: <CreditCard />,
  announcement: <Megaphone />,
};

export function ClientNotificationsView({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);
  const displayed = activeTab === 'unread' ? unread : activeTab === 'read' ? read : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  if (initialNotifications.length === 0) {
    return (
      <PortalLayout pageTitle="Notifications" pageSubtitle="Stay updated on your relationship with NairobiX">
        <NotYetAvailable
          title="Notifications aren't available yet"
          description="Updates about your account will appear here once NairobiX notifications are connected to your Portal."
        />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      pageTitle="Notifications"
      pageSubtitle="Stay updated on your growth partnership"
      headerActions={
        unread.length > 0 ? (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        ) : undefined
      }
    >
      {/* Tabs */}
      <Tabs
        tabs={[
          { label: `All (${notifications.length})`, value: 'all' },
          { label: `Unread (${unread.length})`, value: 'unread' },
          { label: `Read (${read.length})`, value: 'read' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Notifications List */}
      <div className="space-y-3">
        {displayed.map((notification) => (
          <Card
            key={notification.id}
            className={cn('p-4', !notification.read && 'border-primary-200 bg-primary-50/40')}
          >
            <div className="flex items-start gap-3.5">
              {/* Icon */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-neutral-500 shadow-xs [&>svg]:h-4 [&>svg]:w-4">
                {typeIcon[notification.type] || <Mail />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-neutral-900">{notification.title}</h4>
                  {!notification.read && (
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  )}
                </div>

                <p className="text-neutral-600 text-sm mb-2">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">{notification.type}</Badge>
                    <p className="text-xs text-neutral-400">
                      {formatRelativeTime(notification.date)}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-primary text-xs font-medium hover:underline"
                    >
                      Mark as read
                    </button>
                  )}

                  {notification.actionUrl && (
                    <button className="text-primary text-xs font-medium hover:underline">
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {displayed.length === 0 && (
        <EmptyState
          icon={<CheckCheck />}
          title={
            activeTab === 'unread'
              ? 'All caught up'
              : activeTab === 'read'
              ? 'No read notifications'
              : 'No notifications yet'
          }
          description={
            activeTab === 'unread'
              ? 'You have no unread notifications.'
              : 'Check back soon for updates.'
          }
        />
      )}
    </PortalLayout>
  );
}
