'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ArrowRight, MessageCircle, MessageSquare, Send, Inbox } from 'lucide-react';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button, PriorityBadge, StatusBadge } from '@/components/ui/Card';
import { Input, Tabs, EmptyState } from '@/components/ui/Form';
import { mockClientServiceRequests, mockClientProfile } from '@/lib/mock-data';
import { ServiceRequest } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

const TICKETS_KEY = 'nairobix-staff-support-tickets';

const STAGE_ORDER: ServiceRequest['status'][] = ['submitted', 'assigned', 'in-progress', 'resolved'];

const STAGE_STEP_LABEL: Record<ServiceRequest['status'], string> = {
  submitted: 'Assign',
  assigned: 'Start Work',
  'in-progress': 'Resolve',
  resolved: 'Resolved',
};

function loadTickets(): ServiceRequest[] {
  if (typeof window === 'undefined') return mockClientServiceRequests;
  try {
    const raw = window.localStorage.getItem(TICKETS_KEY);
    return raw ? (JSON.parse(raw) as ServiceRequest[]) : mockClientServiceRequests;
  } catch {
    return mockClientServiceRequests;
  }
}

const mockConversations = [
  { id: 'conv1', name: 'TechStart Kenya Ltd — Project Kickoff', lastMessage: 'Confirmed meeting for Monday at 2 PM', date: '2024-03-10', unread: 3 },
  { id: 'conv2', name: 'James Mwangi — New Referral Discussion', lastMessage: 'Thanks for the opportunity details', date: '2024-03-09', unread: 0 },
  { id: 'conv3', name: 'Boutique Retail Ltd — Strategy Call', lastMessage: 'Next steps for Q2 campaign', date: '2024-03-08', unread: 1 },
];

export default function StaffSupport() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState<ServiceRequest[]>(mockClientServiceRequests);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => setTickets(loadTickets()), []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    } catch {
      // best-effort local persistence only
    }
  }, [tickets]);

  const advanceTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== id) return ticket;
        const idx = STAGE_ORDER.indexOf(ticket.status);
        const next = STAGE_ORDER[idx + 1];
        if (!next) return ticket;

        const entryCopy: Record<ServiceRequest['status'], string> = {
          submitted: '',
          assigned: 'Ticket assigned to the support team.',
          'in-progress': 'Work is now in progress on this request.',
          resolved: 'Ticket marked as resolved.',
        };

        return {
          ...ticket,
          status: next,
          timeline: [
            ...ticket.timeline,
            {
              id: `${ticket.id}-t${ticket.timeline.length + 1}`,
              title: `Status changed to ${next.replace('-', ' ')}`,
              description: entryCopy[next],
              timestamp: new Date().toISOString().slice(0, 10),
              type: 'status-change',
              performedBy: 'Grace Kipchoge',
            },
          ],
        };
      })
    );
  };

  const filteredConversations = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout pageTitle="Support" pageSubtitle="Resolve client service requests and manage communications">
      <Tabs
        tabs={[
          { label: `Service Requests (${tickets.filter((t) => t.status !== 'resolved').length} open)`, value: 'tickets' },
          { label: 'Communications', value: 'communications' },
        ]}
        activeTab={activeTab}
        onTabChange={(t) => {
          setActiveTab(t);
          setSearchTerm('');
        }}
      />

      {activeTab === 'tickets' && (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const isExpanded = expandedId === ticket.id;
            return (
              <Card key={ticket.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-neutral-900">{ticket.title}</h3>
                    <p className="text-sm text-neutral-500">{mockClientProfile.businessName}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                    {isExpanded ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-100 p-5 pt-4">
                    <p className="mb-4 text-sm text-neutral-600">{ticket.description}</p>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Activity</p>
                    <div className="mb-5 space-y-3 border-l-2 border-neutral-100 pl-4">
                      {ticket.timeline.map((entry) => (
                        <div key={entry.id}>
                          <p className="text-sm font-medium text-neutral-900">{entry.title}</p>
                          {entry.description && <p className="text-sm text-neutral-600">{entry.description}</p>}
                          <p className="text-xs text-neutral-400">
                            {formatRelativeTime(entry.timestamp)}
                            {entry.performedBy ? ` · ${entry.performedBy}` : ''}
                          </p>
                        </div>
                      ))}
                    </div>

                    {ticket.status !== 'resolved' && (
                      <Button variant="primary" size="sm" icon={<ArrowRight size={14} />} onClick={() => advanceTicket(ticket.id)}>
                        {STAGE_STEP_LABEL[ticket.status]}
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'communications' && (
        <>
          <div className="mb-6">
            <Input placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filteredConversations.map((conv) => (
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
                      <p className="mt-0.5 text-xs text-neutral-400">{formatDate(conv.date)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Send size={14} />}>
                    Reply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {filteredConversations.length === 0 && (
            <EmptyState icon={<MessageSquare />} title="No conversations found" description="Try a different search term." />
          )}
        </>
      )}

      {tickets.length === 0 && activeTab === 'tickets' && (
        <EmptyState icon={<Inbox />} title="No service requests" description="Client requests will appear here as they're submitted." />
      )}
    </StaffLayout>
  );
}
