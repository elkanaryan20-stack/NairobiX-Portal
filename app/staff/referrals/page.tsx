'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">
            Total Referral Value
          </p>
          <p className="text-3xl font-bold text-blue-700">
            {formatCurrency(totalValue)}
          </p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">
            Total Commissions Owed
          </p>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(totalCommissions)}
          </p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">
            Active Referrals
          </p>
          <p className="text-3xl font-bold text-purple-700">
            {mockReferrals.length}
          </p>
        </Card>
      </div>

      {/* Referrals List */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        All Referrals
      </h3>

      <div className="space-y-3">
        {mockReferrals.map((ref) => (
          <Card key={ref.id} hover className="p-4">
            <div className="grid md:grid-cols-5 gap-4 items-center">
              <div>
                <h4 className="font-medium text-neutral-900">{ref.business}</h4>
                <p className="text-sm text-neutral-600">by {ref.partner}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Value</p>
                <p className="text-lg font-bold text-neutral-900">
                  {formatCurrency(ref.value)}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Commission</p>
                <p className="text-lg font-bold text-neutral-900">
                  {formatCurrency(ref.commission)}
                </p>
              </div>

              <div>
                <Badge
                  variant={
                    ref.status === 'won'
                      ? 'success'
                      : ref.status === 'proposal'
                      ? 'warning'
                      : 'primary'
                  }
                >
                  {ref.status}
                </Badge>
              </div>

              <div className="text-right text-xs text-neutral-600">
                {ref.date}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
