'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { mockClientBenefits } from '@/lib/mock-data';
import { BookOpen, Target, Ticket, Zap, BarChart3, HeartHandshake, MessageSquare, ShieldCheck } from 'lucide-react';

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
          <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <BookOpen size={15} /> Exclusive Playbooks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playbooks.map((benefit) => (
              <Card key={benefit.id} hover className="p-6">
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">
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
          <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <Target size={15} /> Strategy Benefits
          </h3>
          <div className="space-y-4">
            {strategy.map((benefit) => (
              <Card key={benefit.id} hover className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-2">
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
          <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <Ticket size={15} /> Exclusive Discounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discounts.map((benefit) => (
              <Card
                key={benefit.id}
                className="p-6 border-emerald-200 bg-emerald-50/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-1">
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
          <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <Zap size={15} /> Early Access
          </h3>
          <Card className="p-6 border-indigo-200 bg-indigo-50/60">
            {earlyAccess.map((benefit) => (
              <div key={benefit.id}>
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">
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
      <Card className="p-8 border-primary-200 bg-primary-50/40">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
            Your Growth Partnership Includes More
          </h3>
          <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
            As a valued NairobiX partner, you have access to:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6 max-w-xl mx-auto text-left">
            {[
              { icon: <BarChart3 size={16} />, label: 'Quarterly Business Reviews' },
              { icon: <HeartHandshake size={16} />, label: 'Dedicated Account Management' },
              { icon: <MessageSquare size={16} />, label: 'Priority Support' },
              { icon: <ShieldCheck size={16} />, label: 'VIP Resources & Training' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-neutral-900 font-medium">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  {item.icon}
                </span>
                {item.label}
              </div>
            ))}
          </div>
          <Button variant="primary">Learn More About Your Partnership</Button>
        </div>
      </Card>
    </ClientLayout>
  );
}
