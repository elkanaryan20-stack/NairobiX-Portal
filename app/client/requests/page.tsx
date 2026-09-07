'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button, PriorityBadge } from '@/components/ui/Card';
import { mockClientServiceRequests } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const requestTypes = [
  {
    id: 'growth-initiative',
    title: 'Growth Initiative',
    description: 'Explore a new growth opportunity',
    icon: '🚀',
  },
  {
    id: 'system-request',
    title: 'System Request',
    description: 'Request a change or implementation',
    icon: '⚙️',
  },
  {
    id: 'website-request',
    title: 'Website Request',
    description: 'Request a website or landing-page update',
    icon: '🌐',
  },
  {
    id: 'reporting-question',
    title: 'Reporting Question',
    description: 'Ask about performance data',
    icon: '📊',
  },
  {
    id: 'strategy-session',
    title: 'Strategy Session',
    description: 'Request time with the NairobiX team',
    icon: '🎯',
  },
];

export default function ClientRequests() {
  const [showForm, setShowForm] = useState(false);

  return (
    <ClientLayout
      pageTitle="Requests"
      pageSubtitle="Submit service requests and track their status"
      headerActions={
        <Button variant="primary" icon={<Plus size={16} />}>
          New Request
        </Button>
      }
    >
      {/* Request Types */}
      {!showForm && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            What would you like to request?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {requestTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setShowForm(true)}
                className="text-left"
              >
                <Card hover className="p-4 h-full">
                  <p className="text-3xl mb-2">{type.icon}</p>
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    {type.title}
                  </h4>
                  <p className="text-xs text-neutral-600">{type.description}</p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Request History */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Request History
        </h3>

        <div className="space-y-4">
          {mockClientServiceRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-neutral-900 mb-1">
                    {request.title}
                  </h4>
                  <p className="text-neutral-600 text-sm mb-3">
                    {request.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <span>📅 {formatDate(request.createdDate)}</span>
                    {request.assignedTo && (
                      <span>👤 {request.assignedTo}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  <Badge
                    variant={
                      request.status === 'completed'
                        ? 'success'
                        : request.status === 'in-progress'
                        ? 'primary'
                        : request.status === 'acknowledged'
                        ? 'neutral'
                        : 'warning'
                    }
                  >
                    {request.status === 'submitted' && 'Submitted'}
                    {request.status === 'acknowledged' && 'Acknowledged'}
                    {request.status === 'in-progress' && 'In Progress'}
                    {request.status === 'completed' && 'Completed'}
                  </Badge>
                  <PriorityBadge priority={request.priority} />
                </div>
              </div>

              {request.dueDate && (
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600">
                    Due: <span className="font-medium">{formatDate(request.dueDate)}</span>
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {mockClientServiceRequests.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No requests yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Submit your first service request to get started
            </p>
            <Button variant="primary" icon={<Plus size={16} />}>
              Submit a Request
            </Button>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}
