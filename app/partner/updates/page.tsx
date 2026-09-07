'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

export default function PartnerUpdates() {
  const updates = [
    {
      id: 'upd1',
      title: 'New Commission Tier Unlocked',
      content: 'You've reached 10 successful referrals! Your commission rate has increased to 15%.',
      date: '2024-03-15',
      type: 'achievement',
      icon: '🎉',
    },
    {
      id: 'upd2',
      title: 'Service Expansion Announcement',
      content: 'NairobiX is launching AI-powered analytics solutions. Early partners receive 20% bonus commissions.',
      date: '2024-03-10',
      type: 'announcement',
      icon: '📢',
    },
    {
      id: 'upd3',
      title: 'Q2 Partner Summit Scheduled',
      content: 'Join us for an exclusive virtual summit on May 15th. Network with top partners and learn growth strategies.',
      date: '2024-03-08',
      type: 'event',
      icon: '📅',
    },
    {
      id: 'upd4',
      title: 'Referral Resource Library Updated',
      content: 'New sales templates, pitch decks, and one-pagers available in your Resources section.',
      date: '2024-03-05',
      type: 'update',
      icon: '📚',
    },
  ];

  return (
    <PartnerLayout
      pageTitle="Updates"
      pageSubtitle="Latest news and announcements for partners"
    >
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} hover className="p-6">
            <div className="flex gap-4">
              <span className="text-2xl">{update.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-neutral-900">{update.title}</h3>
                  <Badge
                    variant={
                      update.type === 'achievement'
                        ? 'success'
                        : update.type === 'announcement'
                        ? 'primary'
                        : 'neutral'
                    }
                    className="text-xs"
                  >
                    {update.type}
                  </Badge>
                </div>
                <p className="text-neutral-700 text-sm mb-2">{update.content}</p>
                <p className="text-xs text-neutral-500">
                  {formatDate(update.date)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PartnerLayout>
  );
}
