'use client';

import Link from 'next/link';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { ArrowRight } from 'lucide-react';
import {
  mockPartnerProfile,
  mockPartnerReferrals,
  mockPartnerCommissions,
} from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function PartnerOverview() {
  const wonReferrals = mockPartnerReferrals.filter((r) => r.status === 'won').length;
  const paidCommissions = mockPartnerCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = mockPartnerCommissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <PartnerLayout
      pageTitle="Partner Overview"
      pageSubtitle="Welcome back! Here's your partnership performance at a glance."
    >
      {/* Partner Profile Card */}
      <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 border-green-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              {mockPartnerProfile.businessName}
            </h3>
            <p className="text-neutral-700 mb-3">
              {mockPartnerProfile.partnerType} · {mockPartnerProfile.industry}
            </p>
            <Badge variant="success">Partner Status: Active</Badge>
          </div>
          <div className="text-4xl">🤝</div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Partnership Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Referrals"
            value={mockPartnerProfile.totalReferrals}
            subtitle="active and closed"
          />
          <MetricCard
            label="Won Referrals"
            value={wonReferrals}
            subtitle="converted to clients"
          />
          <MetricCard
            label="Commissions Earned"
            value={formatCurrency(mockPartnerProfile.totalCommissionsEarned)}
            subtitle="all time"
          />
          <MetricCard
            label="Pending Commission"
            value={formatCurrency(pendingCommissions)}
            subtitle="awaiting approval"
          />
        </div>
      </div>

      {/* Active Referrals & Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Referrals */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Recent Referrals
          </h3>
          <div className="space-y-3">
            {mockPartnerReferrals.slice(0, 3).map((referral) => (
              <Card key={referral.id} hover className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-neutral-900">
                    {referral.businessName}
                  </h4>
                  <Badge
                    variant={
                      referral.status === 'won'
                        ? 'success'
                        : referral.status === 'lost'
                        ? 'danger'
                        : 'primary'
                    }
                  >
                    {referral.status}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-2">
                  {referral.contactPerson} • {referral.industry}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>
                    {referral.potentialValue
                      ? formatCurrency(referral.potentialValue)
                      : '—'}
                  </span>
                  {referral.commission && referral.commission.status === 'paid' && (
                    <span className="text-green-600 font-medium">
                      Commission: {formatCurrency(referral.commission.amount)}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Link href="/partner/referrals">
            <button className="text-primary font-medium text-sm mt-4 hover:underline flex items-center gap-1">
              View all referrals <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Commission Status */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Commission Status
          </h3>
          <div className="space-y-3">
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-neutral-600 font-medium mb-1">
                Paid Commissions
              </p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(paidCommissions)}
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                {mockPartnerCommissions.filter((c) => c.status === 'paid').length}{' '}
                payments completed
              </p>
            </Card>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-neutral-600 font-medium mb-1">
                Approved Commissions
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {formatCurrency(
                  mockPartnerCommissions
                    .filter((c) => c.status === 'approved')
                    .reduce((sum, c) => sum + c.amount, 0)
                )}
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                Pending payment
              </p>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-neutral-600 font-medium mb-1">
                Pending Commission
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(pendingCommissions)}
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                Under review
              </p>
            </Card>
          </div>

          <Link href="/partner/commissions">
            <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2">
              View Commission Details <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/partner/referrals">
          <Card hover className="p-4 text-center h-full">
            <p className="text-2xl mb-2">🔗</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Refer a Business</h4>
            <p className="text-xs text-neutral-600">Submit a new referral</p>
          </Card>
        </Link>

        <Link href="/partner/opportunities">
          <Card hover className="p-4 text-center h-full">
            <p className="text-2xl mb-2">💼</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Opportunities</h4>
            <p className="text-xs text-neutral-600">See current opportunities</p>
          </Card>
        </Link>

        <Link href="/partner/resources">
          <Card hover className="p-4 text-center h-full">
            <p className="text-2xl mb-2">📚</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Resources</h4>
            <p className="text-xs text-neutral-600">Access partner tools</p>
          </Card>
        </Link>

        <Link href="/partner/rewards">
          <Card hover className="p-4 text-center h-full">
            <p className="text-2xl mb-2">🏆</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Rewards</h4>
            <p className="text-xs text-neutral-600">Track your milestones</p>
          </Card>
        </Link>
      </div>
    </PartnerLayout>
  );
}
