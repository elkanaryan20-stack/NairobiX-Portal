'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Form';
import { mockClientServices } from '@/lib/mock-data';
import { ChevronRight, Check, Rocket } from 'lucide-react';

export default function ClientServices() {
  return (
    <ClientLayout
      pageTitle="Services"
      pageSubtitle="Your active NairobiX services and solutions"
    >
      {/* Active Services */}
      <div className="mb-12">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Active Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockClientServices.map((service) => (
            <Card key={service.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900">
                    {service.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    {service.description}
                  </p>
                </div>
                <StatusBadge status={service.status} />
              </div>

              {/* Service Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Current Activity
                  </p>
                  <p className="text-sm text-neutral-600">{service.currentActivity}</p>
                </div>

                {service.progress !== undefined && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-neutral-900">
                        Progress
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {service.progress}%
                      </p>
                    </div>
                    <ProgressBar value={service.progress} showLabel={false} />
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Category
                  </p>
                  <Badge variant="neutral">{service.category}</Badge>
                </div>
              </div>

              <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                View Details <ChevronRight size={14} />
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Explore Solutions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Explore Growth Solutions
        </h3>

        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
            <Rocket size={22} />
          </div>
          <h4 className="mb-2 text-xl font-semibold text-neutral-900">
            Ready for more growth?
          </h4>
          <p className="mx-auto mb-6 max-w-md text-neutral-600">
            Discover additional NairobiX capabilities and solutions to accelerate
            your business growth
          </p>

          <div className="mb-6 inline-block space-y-2 text-left">
            {[
              'AI-Powered Analytics Platform',
              'Advanced Marketing Automation',
              'ERP System Implementation',
              'Custom App Development',
            ].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                <Check size={14} className="text-emerald-600" /> {item}
              </p>
            ))}
          </div>

          <div>
            <Button variant="primary">Request a Service</Button>
          </div>
        </Card>
      </div>
    </ClientLayout>
  );
}
