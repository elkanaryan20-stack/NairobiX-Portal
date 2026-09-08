'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button, PriorityBadge, StatusBadge } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { Inbox } from 'lucide-react';
import { useState } from 'react';

export default function StaffRequests() {
  const [activeTab, setActiveTab] = useState('pending');

  const mockRequests = [
    {
      id: 'req1',
      clientName: 'TechVision Ltd',
      type: 'Growth Initiative',
      subject: 'Website Redesign Request',
      date: '2024-03-10',
      status: 'pending' as const,
      priority: 'high' as const,
    },
    {
      id: 'req2',
      clientName: 'RetailMax Solutions',
      type: 'Strategy Session',
      subject: 'Q2 Growth Planning',
      date: '2024-03-08',
      status: 'pending' as const,
      priority: 'medium' as const,
    },
    {
      id: 'req3',
      clientName: 'HealthTech Kenya',
      type: 'System Request',
      subject: 'API Integration Setup',
      date: '2024-03-05',
      status: 'completed' as const,
      priority: 'high' as const,
    },
  ];

  const filtered = mockRequests.filter((r) => r.status === activeTab);

  return (
    <StaffLayout
      pageTitle="Service Requests"
      pageSubtitle="Review and respond to client service requests"
    >
      <Tabs
        tabs={[
          {
            label: `Pending (${mockRequests.filter((r) => r.status === 'pending').length})`,
            value: 'pending',
          },
          {
            label: `Completed (${mockRequests.filter((r) => r.status === 'completed').length})`,
            value: 'completed',
          },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6 space-y-3">
        {filtered.map((request) => (
          <Card key={request.id} hover className="p-6">
            <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr_1fr_auto]">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {request.subject}
                </h3>
                <p className="text-sm text-neutral-500">{request.clientName}</p>
                <Badge variant="neutral" className="mt-2">
                  {request.type}
                </Badge>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Priority</p>
                <PriorityBadge priority={request.priority} />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Submitted</p>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(request.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-end">
                {request.status === 'pending' ? (
                  <Button variant="primary" size="sm">
                    Review &amp; Respond
                  </Button>
                ) : (
                  <StatusBadge status={request.status} />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={<Inbox />}
          title={`No ${activeTab} requests`}
          description="Requests will appear here as clients submit them."
        />
      )}
    </StaffLayout>
  );
}
