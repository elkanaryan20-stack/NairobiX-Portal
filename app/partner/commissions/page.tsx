'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
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
        <Card className="p-6 bg-green-50 border-green-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(paidTotal)}
          </p>
          <p className="text-xs text-neutral-600 mt-2">
            {mockPartnerCommissions.filter((c) => c.status === 'paid').length}{' '}
            commissions
          </p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">Approved</p>
          <p className="text-3xl font-bold text-yellow-700">
            {formatCurrency(approvedTotal)}
          </p>
          <p className="text-xs text-neutral-600 mt-2">
            Awaiting payment
          </p>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-blue-700">
            {formatCurrency(pendingTotal)}
          </p>
          <p className="text-xs text-neutral-600 mt-2">
            Under review
          </p>
        </Card>
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
                  <p className="text-2xl font-bold text-neutral-900 mb-2">
                    {formatCurrency(commission.amount)}
                  </p>
                  <div className="space-y-1 text-xs text-neutral-600">
                    {commission.approvedDate && (
                      <p>Approved: {formatDate(commission.approvedDate)}</p>
                    )}
                    {commission.paidDate && (
                      <p className="text-green-700 font-medium">
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
      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-neutral-900 mb-3">Payment Information</h3>
        <p className="text-neutral-700 text-sm mb-4">
          Commissions are typically paid within 30 days of approval. Ensure your
          payment details are up to date in your settings.
        </p>
        <button className="text-primary font-medium text-sm hover:underline">
          Update Payment Methods →
        </button>
      </Card>
    </PartnerLayout>
  );
}
