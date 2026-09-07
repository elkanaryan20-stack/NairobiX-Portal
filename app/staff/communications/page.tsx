'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import { MessageCircle, Send } from 'lucide-react';
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

      <div className="space-y-3">
        {mockConversations.map((conv) => (
          <Card key={conv.id} hover className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle size={16} className="text-neutral-600" />
                  <h3 className="font-medium text-neutral-900">{conv.name}</h3>
                  {conv.unread > 0 && (
                    <Badge variant="primary">{conv.unread}</Badge>
                  )}
                </div>
                <p className="text-sm text-neutral-600">{conv.lastMessage}</p>
                <p className="text-xs text-neutral-500 mt-1">{conv.date}</p>
              </div>
              <Button variant="ghost" size="sm" icon={<Send size={14} />}>
                Reply
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
