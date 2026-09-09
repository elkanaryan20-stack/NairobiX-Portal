'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Form';
import { ArrowRight, Flame, BarChart3, Target, Briefcase } from 'lucide-react';
import { mockPartnerProfile } from '@/lib/mock-data';

export default function PartnerOpportunities() {
  if (!mockPartnerProfile.capabilities.opportunities) {
    return (
      <PartnerLayout pageTitle="Opportunities" pageSubtitle="High-demand services your network needs">
        <EmptyState
          icon={<Briefcase />}
          title="Not available for your partner type"
          description="Opportunity tracking isn't part of your current partner capabilities. Reach out to your NairobiX contact if this should change."
        />
      </PartnerLayout>
    );
  }

  const opportunities = [
    {
      id: 'opp1',
      service: 'E-commerce Platform Setup',
      industry: 'Retail',
      demand: 'High',
      commission: '15%',
      description: 'Complete e-commerce platform implementation with payment integration',
      status: 'active',
    },
    {
      id: 'opp2',
      service: 'Digital Marketing Campaign',
      industry: 'Technology',
      demand: 'Medium',
      commission: '12%',
      description: 'Full-funnel digital marketing strategy and execution',
      status: 'active',
    },
    {
      id: 'opp3',
      service: 'Data Analytics Setup',
      industry: 'Finance',
      demand: 'High',
      commission: '18%',
      description: 'Advanced analytics implementation and reporting setup',
      status: 'active',
    },
  ];

  return (
    <PartnerLayout
      pageTitle="Opportunities"
      pageSubtitle="High-demand services your network needs"
    >
      {/* Top Opportunities */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
          Current Demand
        </h3>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <Card key={opp.id} hover className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    {opp.service}
                  </h4>
                  <p className="text-sm text-neutral-600">{opp.description}</p>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 font-medium mb-1">
                    Industry
                  </p>
                  <Badge variant="neutral">{opp.industry}</Badge>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 font-medium mb-1">
                    Commission
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {opp.commission}
                  </p>
                  <Badge variant="success" className="mt-2">
                    {opp.demand} Demand
                  </Badge>
                </div>

                <div className="text-right">
                  <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                    Refer Business
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Industry Trends */}
      <Card className="p-6 border-blue-200 bg-blue-50/60">
        <h3 className="font-semibold text-neutral-900 mb-4">Industry Trends</h3>
        <div className="space-y-3">
          <p className="flex items-start gap-2.5 text-neutral-700 text-sm">
            <Flame size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
            <span><span className="font-medium">E-commerce</span> services are in highest demand right now</span>
          </p>
          <p className="flex items-start gap-2.5 text-neutral-700 text-sm">
            <BarChart3 size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
            <span><span className="font-medium">Analytics</span> solutions seeing strong growth in financial sector</span>
          </p>
          <p className="flex items-start gap-2.5 text-neutral-700 text-sm">
            <Target size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
            <span><span className="font-medium">Digital marketing</span> remains stable across all industries</span>
          </p>
        </div>
      </Card>
    </PartnerLayout>
  );
}
