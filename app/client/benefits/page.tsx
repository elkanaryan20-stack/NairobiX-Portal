'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { mockClientBenefits } from '@/lib/mock-data';

export default function ClientBenefits() {
  const playbooks = mockClientBenefits.filter((b) => b.category === 'playbook');
  const discounts = mockClientBenefits.filter((b) => b.category === 'discount');
  const strategy = mockClientBenefits.filter((b) => b.category === 'strategy');
  const earlyAccess = mockClientBenefits.filter((b) => b.category === 'early-access');

  return (
    <ClientLayout
      pageTitle="NairobiX Benefits"
      pageSubtitle="Exclusive benefits and resources for valued growth partners"
    >
      {/* Playbooks */}
      {playbooks.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            📚 Exclusive Playbooks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playbooks.map((benefit) => (
              <Card key={benefit.id} hover className="p-6">
                <h4 className="text-lg font-bold text-neutral-900 mb-2">
                  {benefit.name}
                </h4>
                <p className="text-neutral-600 mb-4">{benefit.description}</p>
                <Button variant="primary" size="sm">
                  Access Playbook
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Strategy */}
      {strategy.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            🎯 Strategy Benefits
          </h3>
          <div className="space-y-4">
            {strategy.map((benefit) => (
              <Card key={benefit.id} hover className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-neutral-900 mb-2">
                      {benefit.name}
                    </h4>
                    <p className="text-neutral-600 mb-4">{benefit.description}</p>
                  </div>
                  <Button variant="primary" size="sm" className="flex-shrink-0">
                    Schedule
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Discounts */}
      {discounts.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            🎟️ Exclusive Discounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discounts.map((benefit) => (
              <Card
                key={benefit.id}
                className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 mb-1">
                      {benefit.name}
                    </h4>
                    <p className="text-neutral-600 text-sm mb-3">
                      {benefit.description}
                    </p>
                    {benefit.value && (
                      <Badge variant="success">{benefit.value}</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Early Access */}
      {earlyAccess.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            ⚡ Early Access
          </h3>
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            {earlyAccess.map((benefit) => (
              <div key={benefit.id}>
                <h4 className="text-lg font-bold text-neutral-900 mb-2">
                  {benefit.name}
                </h4>
                <p className="text-neutral-600 mb-4">{benefit.description}</p>
                <Button variant="primary">Get Early Access</Button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Premium Positioning */}
      <Card className="p-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">
            Your Growth Partnership Includes More
          </h3>
          <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
            As a valued NairobiX partner, you have access to:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-neutral-900 font-medium">📈 Quarterly Business Reviews</p>
            </div>
            <div>
              <p className="text-neutral-900 font-medium">🤝 Dedicated Account Management</p>
            </div>
            <div>
              <p className="text-neutral-900 font-medium">💬 Priority Support</p>
            </div>
            <div>
              <p className="text-neutral-900 font-medium">🔐 VIP Resources & Training</p>
            </div>
          </div>
          <Button variant="primary">Learn More About Your Partnership</Button>
        </div>
      </Card>
    </ClientLayout>
  );
}
