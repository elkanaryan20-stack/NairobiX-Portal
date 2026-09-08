'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card } from '@/components/ui/Card';
import { Target, TrendingUp, Wallet } from 'lucide-react';

export default function PartnerInsights() {
  const insights = [
    {
      id: 'ins1',
      title: 'Referral Quality Best Practices',
      summary: 'How to submit qualified leads that convert',
      icon: <Target size={20} />,
      points: [
        'Focus on decision-makers in target industries',
        'Include specific business challenges in description',
        'Provide direct contact information when possible',
      ],
    },
    {
      id: 'ins2',
      title: 'High-Converting Industries',
      summary: 'Where your referrals have the best success rate',
      icon: <TrendingUp size={20} />,
      points: [
        'Technology & SaaS (52% conversion)',
        'Retail & E-commerce (48% conversion)',
        'Financial Services (45% conversion)',
      ],
    },
    {
      id: 'ins3',
      title: 'Commission Maximization',
      summary: 'Strategies to earn more from your referrals',
      icon: <Wallet size={20} />,
      points: [
        'Bundle multiple services for higher project value',
        'Refer businesses at growth inflection points',
        'Follow up on qualified leads within 2 weeks',
      ],
    },
  ];

  return (
    <PartnerLayout
      pageTitle="Insights"
      pageSubtitle="Learn how to become a top-performing partner"
    >
      <div className="space-y-6">
        {insights.map((insight) => (
          <Card key={insight.id} className="p-6 border-l-2 border-l-primary">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                {insight.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {insight.title}
                </h3>
                <p className="text-sm text-neutral-600">{insight.summary}</p>
              </div>
            </div>

            <ul className="space-y-2">
              {insight.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </PartnerLayout>
  );
}
