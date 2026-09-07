'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Form';
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

      <div className="space-y-4 mt-6">
        {filtered.map((request) => (
          <Card key={request.id} hover className="p-6">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <div>
                <h3 className="font-bold text-neutral-900">
                  {request.subject}
                </h3>
                <p className="text-sm text-neutral-600">{request.clientName}</p>
                <Badge variant="neutral" className="mt-2 text-xs">
                  {request.type}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Priority</p>
                <Badge
                  variant={request.priority === 'high' ? 'warning' : 'primary'}
                  className="mt-1"
                >
                  {request.priority}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Submitted</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {new Date(request.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                {request.status === 'pending' ? (
                  <Button variant="primary" size="sm">
                    Review & Respond
                  </Button>
                ) : (
                  <Badge variant="success">Completed</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
