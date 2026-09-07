'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';

export default function StaffAnalytics() {
  const metrics = [
    { label: 'Total Revenue', value: 'KES 2.4M', icon: '💰' },
    { label: 'Client Growth', value: '+23%', icon: '📈' },
    { label: 'Partnership Value', value: 'KES 18.5M', icon: '🤝' },
    { label: 'Project Success Rate', value: '94%', icon: '✅' },
    { label: 'Avg. Client Satisfaction', value: '4.8/5', icon: '⭐' },
    { label: 'Referral Conversion', value: '42%', icon: '🔗' },
  ];

  return (
    <StaffLayout
      pageTitle="Analytics"
      pageSubtitle="Business performance and operational metrics"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
        {metrics.map((metric, idx) => (
          <MetricCard
            key={idx}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-neutral-50 min-h-72 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-neutral-600 font-medium">Revenue Trend</p>
            <p className="text-sm text-neutral-500 mt-1">
              Chart visualization coming soon
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-neutral-50 min-h-72 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-neutral-600 font-medium">Performance Overview</p>
            <p className="text-sm text-neutral-500 mt-1">
              Visual dashboard coming soon
            </p>
          </div>
        </Card>
      </div>
    </StaffLayout>
  );
}
