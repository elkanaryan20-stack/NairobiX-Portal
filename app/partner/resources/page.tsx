'use client';

import { BookOpen, Percent, FileStack } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { mockPartnerBenefits } from '@/lib/mock-data';

export default function PartnerResources() {
  const playbooks = mockPartnerBenefits.filter((b) => b.category === 'playbook');
  const discounts = mockPartnerBenefits.filter((b) => b.category === 'discount');

  return (
    <PartnerLayout
      pageTitle="Resources"
      pageSubtitle="Playbooks, marketing assets and commission tiers to help you refer with confidence"
    >
      <div className="mb-10">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <BookOpen size={18} className="text-neutral-400" />
          Playbooks &amp; Guides
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {playbooks.map((benefit) => (
            <Card key={benefit.id} hover className="p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <FileStack size={17} />
              </div>
              <h4 className="mb-1.5 font-semibold text-neutral-900">{benefit.name}</h4>
              <p className="mb-4 text-sm text-neutral-600">{benefit.description}</p>
              <Button variant="secondary" size="sm">
                Open
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {discounts.length > 0 && (
        <div>
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <Percent size={18} className="text-neutral-400" />
            Commission Tiers
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {discounts.map((benefit) => (
              <Card key={benefit.id} className="border-primary-200 bg-primary-50/40 p-6">
                <h4 className="mb-1.5 font-semibold text-neutral-900">{benefit.name}</h4>
                <p className="mb-3 text-sm text-neutral-600">{benefit.description}</p>
                <Badge variant="primary">Active</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PartnerLayout>
  );
}
