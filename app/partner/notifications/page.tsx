'use client';

import { useState } from 'react';
import { Lightbulb, FileText, CreditCard, Megaphone, Inbox, CheckCheck } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { mockPartnerNotifications } from '@/lib/mock-data';
import { formatRelativeTime, cn } from '@/lib/utils';

const typeIcon: Record<string, React.ReactNode> = {
  insight: <Lightbulb />,
  report: <FileText />,
  billing: <CreditCard />,
  announcement: <Megaphone />,
};

export default function PartnerNotifications() {
  const [notifications, setNotifications] = useState(mockPartnerNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);
  const displayed = activeTab === 'unread' ? unread : activeTab === 'read' ? read : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <PartnerLayout
      pageTitle="Notifications"
      pageSubtitle="Stay on top of your partnership activity"
      headerActions={
        unread.length > 0 ? (
          <button
            onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        ) : undefined
      }
    >
      <Tabs
        tabs={[
          { label: `All (${notifications.length})`, value: 'all' },
          { label: `Unread (${unread.length})`, value: 'unread' },
          { label: `Read (${read.length})`, value: 'read' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="space-y-3">
        {displayed.map((notification) => (
          <Card
            key={notification.id}
            className={cn('p-4', !notification.read && 'border-primary-200 bg-primary-50/40')}
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-neutral-500 shadow-xs [&>svg]:h-4 [&>svg]:w-4">
                {typeIcon[notification.type] || <Inbox />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h4 className="font-medium text-neutral-900">{notification.title}</h4>
                  {!notification.read && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mb-2 text-sm text-neutral-600">{notification.message}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">{notification.type}</Badge>
                    <p className="text-xs text-neutral-400">{formatRelativeTime(notification.date)}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {displayed.length === 0 && (
        <EmptyState
          icon={<CheckCheck />}
          title={activeTab === 'unread' ? 'All caught up' : 'No notifications yet'}
          description={
            activeTab === 'unread' ? 'You have no unread notifications.' : 'Check back soon for updates.'
          }
        />
      )}
    </PartnerLayout>
  );
}
