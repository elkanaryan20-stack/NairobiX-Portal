'use client';

import { CheckCircle2, Clock3, HourglassIcon } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { mockPartnerCommissions, mockPartnerReferrals } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PartnerCommissions() {
  const paidTotal = mockPartnerCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const approvedTotal = mockPartnerCommissions
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingTotal = mockPartnerCommissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <PartnerLayout
      pageTitle="Commissions"
      pageSubtitle="Manage and track your earned commissions"
    >
      {/* Commission Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          label="Paid"
          value={formatCurrency(paidTotal)}
          subtitle={`${mockPartnerCommissions.filter((c) => c.status === 'paid').length} commissions`}
          icon={<CheckCircle2 />}
        />
        <MetricCard
          label="Approved"
          value={formatCurrency(approvedTotal)}
          subtitle="Awaiting payment"
          icon={<Clock3 />}
        />
        <MetricCard
          label="Pending"
          value={formatCurrency(pendingTotal)}
          subtitle="Under review"
          icon={<HourglassIcon />}
        />
      </div>

      {/* Commission History */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Commission History
      </h3>

      <div className="space-y-3">
        {mockPartnerCommissions.map((commission) => {
          const referral = mockPartnerReferrals.find(
            (r) => r.id === commission.referralId
          );

          return (
            <Card key={commission.id} className="p-4">
              <div className="grid md:grid-cols-3 gap-4 items-center">
                {/* Commission Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-neutral-900">
                      {referral?.businessName || 'Referral'}
                    </h4>
                    <StatusBadge status={commission.status} />
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    {commission.notes}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Referral ID: {commission.referralId}
                  </p>
                </div>

                {/* Amount & Details */}
                <div className="text-right">
                  <p className="text-2xl font-semibold text-neutral-900 mb-2">
                    {formatCurrency(commission.amount)}
                  </p>
                  <div className="space-y-1 text-xs text-neutral-500">
                    {commission.approvedDate && (
                      <p>Approved: {formatDate(commission.approvedDate)}</p>
                    )}
                    {commission.paidDate && (
                      <p className="text-emerald-600 font-medium">
                        Paid: {formatDate(commission.paidDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Payment Info Card */}
      <Card className="mt-8 p-6">
        <h3 className="font-semibold text-neutral-900 mb-2">Payment Information</h3>
        <p className="text-neutral-600 text-sm mb-4">
          Commissions are typically paid within 30 days of approval. Ensure your
          payment details are up to date in your settings.
        </p>
        <a href="/partner/settings" className="text-primary font-medium text-sm hover:underline">
          Update payment methods &rarr;
        </a>
      </Card>
    </PartnerLayout>
  );
}
