'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Wallet, Share2 } from 'lucide-react';

export default function StaffReferrals() {
  const mockReferrals = [
    {
      id: 'ref1',
      business: 'TechVision Ltd',
      partner: 'James Mwangi',
      status: 'won' as const,
      value: 450000,
      commission: 67500,
      date: '2024-02-15',
    },
    {
      id: 'ref2',
      business: 'RetailMax Solutions',
      partner: 'Sarah Kipchoge',
      status: 'proposal' as const,
      value: 320000,
      commission: 48000,
      date: '2024-03-01',
    },
    {
      id: 'ref3',
      business: 'HealthTech Kenya',
      partner: 'James Mwangi',
      status: 'qualified' as const,
      value: 280000,
      commission: 42000,
      date: '2024-03-08',
    },
  ];

  const totalValue = mockReferrals.reduce((sum, r) => sum + r.value, 0);
  const totalCommissions = mockReferrals.reduce((sum, r) => sum + r.commission, 0);

  return (
    <StaffLayout
      pageTitle="Referrals"
      pageSubtitle="Monitor partner referrals and commissions"
    >
      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Total Referral Value" value={formatCurrency(totalValue)} icon={<TrendingUp />} />
        <MetricCard label="Total Commissions Owed" value={formatCurrency(totalCommissions)} icon={<Wallet />} />
        <MetricCard label="Active Referrals" value={mockReferrals.length} icon={<Share2 />} />
      </div>

      {/* Referrals List */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        All Referrals
      </h3>

      <div className="space-y-2.5">
        {mockReferrals.map((ref) => (
          <Card key={ref.id} hover className="p-4">
            <div className="grid items-center gap-4 md:grid-cols-5">
              <div>
                <h4 className="font-medium text-neutral-900">{ref.business}</h4>
                <p className="text-sm text-neutral-500">by {ref.partner}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Value</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {formatCurrency(ref.value)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Commission</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {formatCurrency(ref.commission)}
                </p>
              </div>

              <div>
                <StatusBadge status={ref.status} />
              </div>

              <div className="text-right text-xs text-neutral-500">
                {ref.date}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
