'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Input, EmptyState } from '@/components/ui/Form';
import { MessageCircle, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export default function StaffCommunications() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockConversations = [
    {
      id: 'conv1',
      name: 'TechVision Ltd - Project Kickoff',
      lastMessage: 'Confirmed meeting for Monday at 2 PM',
      date: '2024-03-10',
      unread: 3,
    },
    {
      id: 'conv2',
      name: 'James Mwangi - New Referral Discussion',
      lastMessage: 'Thanks for the opportunity details',
      date: '2024-03-09',
      unread: 0,
    },
    {
      id: 'conv3',
      name: 'RetailMax Solutions - Strategy Call',
      lastMessage: 'Next steps for Q2 campaign',
      date: '2024-03-08',
      unread: 1,
    },
  ];

  return (
    <StaffLayout
      pageTitle="Communications"
      pageSubtitle="Manage client and partner communications"
    >
      <div className="mb-6">
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {mockConversations
          .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((conv) => (
          <Card key={conv.id} hover className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                  <MessageCircle size={16} />
                </div>
                <div className="min-w-0">
                  <div className="mb-0.5 flex items-center gap-2">
                    <h3 className="truncate font-medium text-neutral-900">{conv.name}</h3>
                    {conv.unread > 0 && <Badge variant="primary">{conv.unread}</Badge>}
                  </div>
                  <p className="truncate text-sm text-neutral-600">{conv.lastMessage}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{conv.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={<Send size={14} />}>
                Reply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {mockConversations.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
        <EmptyState icon={<MessageSquare />} title="No conversations found" description="Try a different search term." />
      )}
    </StaffLayout>
  );
}
