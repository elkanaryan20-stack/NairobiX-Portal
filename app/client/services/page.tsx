'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Form';
import { mockClientServices } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';

export default function ClientServices() {
  return (
    <ClientLayout
      pageTitle="Services"
      pageSubtitle="Your active NairobiX services and solutions"
    >
      {/* Active Services */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Active Services</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockClientServices.map((service) => (
            <Card key={service.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-neutral-900">
                    {service.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    {service.description}
                  </p>
                </div>
                <Badge
                  variant={
                    service.status === 'active'
                      ? 'success'
                      : service.status === 'paused'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {service.status}
                </Badge>
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
                      <p className="text-sm font-bold text-primary">
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
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">
          Explore Growth Solutions
        </h3>

        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h4 className="text-xl font-bold text-neutral-900 mb-2">
            Ready for more growth?
          </h4>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            Discover additional NairobiX capabilities and solutions to accelerate
            your business growth
          </p>

          <div className="space-y-3 mb-6">
            <div className="inline-block text-left">
              <p className="text-sm text-neutral-700 mb-2">
                ✓ AI-Powered Analytics Platform
              </p>
              <p className="text-sm text-neutral-700 mb-2">
                ✓ Advanced Marketing Automation
              </p>
              <p className="text-sm text-neutral-700 mb-2">
                ✓ ERP System Implementation
              </p>
              <p className="text-sm text-neutral-700">
                ✓ Custom App Development
              </p>
            </div>
          </div>

          <Button variant="primary">Request a Service</Button>
        </Card>
      </div>
    </ClientLayout>
  );
}
