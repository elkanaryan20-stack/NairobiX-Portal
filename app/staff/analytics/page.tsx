'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { Wallet, TrendingUp, HeartHandshake, CheckCircle2, Star, Share2, BarChart3, Target } from 'lucide-react';

export default function StaffAnalytics() {
  const metrics = [
    { label: 'Total Revenue', value: 'KES 2.4M', icon: <Wallet /> },
    { label: 'Client Growth', value: '+23%', icon: <TrendingUp /> },
    { label: 'Partnership Value', value: 'KES 18.5M', icon: <HeartHandshake /> },
    { label: 'Project Success Rate', value: '94%', icon: <CheckCircle2 /> },
    { label: 'Avg. Client Satisfaction', value: '4.8/5', icon: <Star /> },
    { label: 'Referral Conversion', value: '42%', icon: <Share2 /> },
  ];

  return (
    <StaffLayout
      pageTitle="Analytics"
      pageSubtitle="Business performance and operational metrics"
    >
      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} label={metric.label} value={metric.value} icon={metric.icon} />
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex min-h-72 items-center justify-center border-dashed p-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <BarChart3 size={20} />
            </div>
            <p className="font-medium text-neutral-700">Revenue Trend</p>
            <p className="mt-1 text-sm text-neutral-500">
              Chart visualization coming soon
            </p>
          </div>
        </Card>

        <Card className="flex min-h-72 items-center justify-center border-dashed p-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Target size={20} />
            </div>
            <p className="font-medium text-neutral-700">Performance Overview</p>
            <p className="mt-1 text-sm text-neutral-500">
              Visual dashboard coming soon
            </p>
          </div>
        </Card>
      </div>
    </StaffLayout>
  );
}
