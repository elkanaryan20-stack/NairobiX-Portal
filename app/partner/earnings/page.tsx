'use client';

import { useState } from 'react';
import { CheckCircle2, Clock3, HourglassIcon, Trophy } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, StatusBadge } from '@/components/ui/Card';
import { MetricCard, ProgressBar, Tabs } from '@/components/ui/Form';
import { mockPartnerCommissions, mockPartnerReferrals, mockPartnerRewards } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PartnerEarnings() {
  const [activeTab, setActiveTab] = useState('commissions');

  const paidTotal = mockPartnerCommissions.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const approvedTotal = mockPartnerCommissions.filter((c) => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const pendingTotal = mockPartnerCommissions.filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0);

  const inProgress = mockPartnerRewards.filter((r) => !r.earnedDate);
  const earned = mockPartnerRewards.filter((r) => r.earnedDate);

  return (
    <PartnerLayout pageTitle="Earnings" pageSubtitle="Commissions, payouts and performance milestones">
      <Tabs
        tabs={[
          { label: 'Commissions', value: 'commissions' },
          { label: 'Performance', value: 'performance' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'commissions' && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard
              label="Paid"
              value={formatCurrency(paidTotal)}
              subtitle={`${mockPartnerCommissions.filter((c) => c.status === 'paid').length} commissions`}
              icon={<CheckCircle2 />}
            />
            <MetricCard label="Approved" value={formatCurrency(approvedTotal)} subtitle="Awaiting payment" icon={<Clock3 />} />
            <MetricCard label="Pending" value={formatCurrency(pendingTotal)} subtitle="Under review" icon={<HourglassIcon />} />
          </div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Commission History</h3>
          <div className="space-y-3">
            {mockPartnerCommissions.map((commission) => {
              const referral = mockPartnerReferrals.find((r) => r.id === commission.referralId);
              return (
                <Card key={commission.id} className="p-4">
                  <div className="grid items-center gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="font-semibold text-neutral-900">{referral?.businessName || 'Referral'}</h4>
                        <StatusBadge status={commission.status} />
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">{commission.notes}</p>
                      <p className="text-xs text-neutral-500">Referral ID: {commission.referralId}</p>
                    </div>
                    <div className="text-right">
                      <p className="mb-2 text-2xl font-semibold text-neutral-900">{formatCurrency(commission.amount)}</p>
                      <div className="space-y-1 text-xs text-neutral-500">
                        {commission.approvedDate && <p>Approved: {formatDate(commission.approvedDate)}</p>}
                        {commission.paidDate && (
                          <p className="font-medium text-emerald-600">Paid: {formatDate(commission.paidDate)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 p-6">
            <h3 className="mb-2 font-semibold text-neutral-900">Payment Information</h3>
            <p className="mb-4 text-sm text-neutral-600">
              Commissions are typically paid within 30 days of approval. Ensure your payment details are up to date in
              your settings.
            </p>
            <a href="/partner/settings" className="text-sm font-medium text-primary hover:underline">
              Update payment methods &rarr;
            </a>
          </Card>
        </>
      )}

      {activeTab === 'performance' && (
        <>
          {inProgress.length > 0 && (
            <div className="mb-10">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-neutral-500">In Progress</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {inProgress.map((reward) => (
                  <Card key={reward.id} className="p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                        <Trophy size={17} />
                      </div>
                      <Badge variant="neutral">{reward.category}</Badge>
                    </div>
                    <h4 className="mb-1.5 font-semibold text-neutral-900">{reward.name}</h4>
                    <p className="mb-4 text-sm text-neutral-600">{reward.description}</p>
                    {reward.progress && (
                      <ProgressBar value={Math.min(reward.progress.current, reward.progress.target)} max={reward.progress.target} />
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {earned.length > 0 && (
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-neutral-500">Earned</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {earned.map((reward) => (
                  <Card key={reward.id} className="border-emerald-200 bg-emerald-50/40 p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs">
                        <CheckCircle2 size={17} />
                      </div>
                      <Badge variant="success">Earned</Badge>
                    </div>
                    <h4 className="mb-1.5 font-semibold text-neutral-900">{reward.name}</h4>
                    <p className="mb-2 text-sm text-neutral-600">{reward.description}</p>
                    {reward.earnedDate && <p className="text-xs text-neutral-400">Earned {formatDate(reward.earnedDate)}</p>}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PartnerLayout>
  );
}
