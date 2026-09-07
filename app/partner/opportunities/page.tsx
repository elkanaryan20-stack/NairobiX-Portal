'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Form';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function PartnerOpportunities() {
  const [activeTab, setActiveTab] = useState('active');

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
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Current Demand
        </h3>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <Card key={opp.id} hover className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <h4 className="font-bold text-neutral-900 mb-2">
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
                  <p className="text-lg font-bold text-primary">
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
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-neutral-900 mb-4">Industry Trends</h3>
        <div className="space-y-3">
          <p className="text-neutral-700 text-sm">
            🔥 <span className="font-medium">E-commerce</span> services are in highest demand right now
          </p>
          <p className="text-neutral-700 text-sm">
            📊 <span className="font-medium">Analytics</span> solutions seeing strong growth in financial sector
          </p>
          <p className="text-neutral-700 text-sm">
            🎯 <span className="font-medium">Digital marketing</span> remains stable across all industries
          </p>
        </div>
      </Card>
    </PartnerLayout>
  );
}
