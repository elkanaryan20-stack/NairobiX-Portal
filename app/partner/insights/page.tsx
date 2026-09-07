'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge } from '@/components/ui/Card';

export default function PartnerInsights() {
  const insights = [
    {
      id: 'ins1',
      title: 'Referral Quality Best Practices',
      summary: 'How to submit qualified leads that convert',
      icon: '🎯',
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
      icon: '📈',
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
      icon: '💰',
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
          <Card key={insight.id} className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">{insight.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-900">
                  {insight.title}
                </h3>
                <p className="text-sm text-neutral-600">{insight.summary}</p>
              </div>
            </div>

            <ul className="space-y-2">
              {insight.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="text-primary font-bold">•</span>
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
