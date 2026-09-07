'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge } from '@/components/ui/Card';
import { mockClientNotifications } from '@/lib/mock-data';
import { formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';
import { Tabs } from '@/components/ui/Form';

export default function ClientNotifications() {
  const [notifications, setNotifications] = useState(mockClientNotifications);
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

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      insight: '💡',
      report: '📄',
      document: '📑',
      project: '📋',
      request: '✉️',
      billing: '💳',
      announcement: '📢',
    };
    return icons[type] || '📬';
  };

  return (
    <ClientLayout
      pageTitle="Notifications"
      pageSubtitle="Stay updated on your growth partnership"
      headerActions={
        unread.length > 0 ? (
          <button
            onClick={handleClearAll}
            className="text-primary font-medium text-sm hover:underline"
          >
            Mark all as read
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
            className={`p-4 transition-colors ${
              !notification.read
                ? 'bg-orange-50 border-orange-200'
                : 'hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4
                    className={`font-semibold text-neutral-900 ${
                      !notification.read ? 'font-bold' : ''
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>

                <p className="text-neutral-700 text-sm mb-2">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" className="text-xs">
                      {notification.type}
                    </Badge>
                    <p className="text-xs text-neutral-500">
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
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">
            {activeTab === 'unread' ? '✅' : '📭'}
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {activeTab === 'unread'
              ? 'All caught up!'
              : activeTab === 'read'
              ? 'No read notifications'
              : 'No notifications yet'}
          </h3>
          <p className="text-neutral-600">
            {activeTab === 'unread'
              ? 'You have no unread notifications'
              : 'Check back soon for updates'}
          </p>
        </Card>
      )}
    </ClientLayout>
  );
}
