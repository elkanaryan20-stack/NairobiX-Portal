'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Button, StatusBadge, PriorityBadge } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Form';
import { mockClientServiceRequests } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Plus, Rocket, Settings2, Globe, BarChart3, Target, Calendar, User, Mail } from 'lucide-react';

const requestTypes = [
  {
    id: 'growth-initiative',
    title: 'Growth Initiative',
    description: 'Explore a new growth opportunity',
    icon: <Rocket size={18} />,
  },
  {
    id: 'system-request',
    title: 'System Request',
    description: 'Request a change or implementation',
    icon: <Settings2 size={18} />,
  },
  {
    id: 'website-request',
    title: 'Website Request',
    description: 'Request a website or landing-page update',
    icon: <Globe size={18} />,
  },
  {
    id: 'reporting-question',
    title: 'Reporting Question',
    description: 'Ask about performance data',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 'strategy-session',
    title: 'Strategy Session',
    description: 'Request time with the NairobiX team',
    icon: <Target size={18} />,
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
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            What would you like to request?
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {requestTypes.map((type) => (
              <button key={type.id} onClick={() => setShowForm(true)} className="text-left">
                <Card hover className="h-full p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                    {type.icon}
                  </div>
                  <h4 className="mb-1 font-semibold text-neutral-900">{type.title}</h4>
                  <p className="text-xs text-neutral-500">{type.description}</p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Request History */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Request History
        </h3>

        <div className="space-y-4">
          {mockClientServiceRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="mb-1 text-lg font-semibold text-neutral-900">{request.title}</h4>
                  <p className="mb-3 text-sm text-neutral-600">{request.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {formatDate(request.createdDate)}
                    </span>
                    {request.assignedTo && (
                      <span className="flex items-center gap-1.5">
                        <User size={13} /> {request.assignedTo}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                  <StatusBadge status={request.status} />
                  <PriorityBadge priority={request.priority} />
                </div>
              </div>

              {request.dueDate && (
                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-sm text-neutral-600">
                    Due: <span className="font-medium">{formatDate(request.dueDate)}</span>
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {mockClientServiceRequests.length === 0 && (
          <EmptyState
            icon={<Mail />}
            title="No requests yet"
            description="Submit your first service request to get started."
            action={{ label: 'Submit a Request', onClick: () => setShowForm(true) }}
          />
        )}
      </div>
    </ClientLayout>
  );
}
