'use client';

import Link from 'next/link';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, StatusBadge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { ArrowRight, HeartHandshake, Share2, Briefcase, BookOpen, Trophy } from 'lucide-react';
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
      <Card className="mb-8 border-emerald-200 bg-emerald-50/60 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
              {mockPartnerProfile.businessName}
            </h3>
            <p className="text-neutral-600 mb-3">
              {mockPartnerProfile.partnerType} &middot; {mockPartnerProfile.industry}
            </p>
            <Badge variant="success">Partner Status: Active</Badge>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs">
            <HeartHandshake size={20} />
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
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
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
            Recent Referrals
          </h3>
          <div className="space-y-3">
            {mockPartnerReferrals.slice(0, 3).map((referral) => (
              <Card key={referral.id} hover className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-neutral-900">
                    {referral.businessName}
                  </h4>
                  <StatusBadge status={referral.status} />
                </div>
                <p className="text-sm text-neutral-600 mb-2">
                  {referral.contactPerson} &middot; {referral.industry}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    {referral.potentialValue
                      ? formatCurrency(referral.potentialValue)
                      : '—'}
                  </span>
                  {referral.commission && referral.commission.status === 'paid' && (
                    <span className="text-emerald-600 font-medium">
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
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
            Commission Status
          </h3>
          <div className="space-y-3">
            <Card className="p-4 border-emerald-200 bg-emerald-50/60">
              <p className="text-sm text-neutral-600 font-medium mb-1">
                Paid Commissions
              </p>
              <p className="text-2xl font-semibold text-emerald-700">
                {formatCurrency(paidCommissions)}
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                {mockPartnerCommissions.filter((c) => c.status === 'paid').length}{' '}
                payments completed
              </p>
            </Card>

            <Card className="p-4 border-amber-200 bg-amber-50/60">
              <p className="text-sm text-neutral-600 font-medium mb-1">
                Approved Commissions
              </p>
              <p className="text-2xl font-semibold text-amber-700">
                {formatCurrency(
                  mockPartnerCommissions
                    .filter((c) => c.status === 'approved')
                    .reduce((sum, c) => sum + c.amount, 0)
                )}
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Pending payment
              </p>
            </Card>

            <Card className="p-4 border-blue-200 bg-blue-50/60">
              <p className="text-sm text-neutral-600 font-medium mb-1">
                Pending Commission
              </p>
              <p className="text-2xl font-semibold text-blue-700">
                {formatCurrency(pendingCommissions)}
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Under review
              </p>
            </Card>
          </div>

          <Link href="/partner/commissions">
            <button className="w-full mt-4 px-4 py-2.5 bg-primary text-white rounded-sm hover:bg-primary-600 transition-colors font-medium flex items-center justify-center gap-2">
              View Commission Details <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/partner/referrals', icon: <Share2 size={18} />, label: 'Refer a Business', desc: 'Submit a new referral' },
          { href: '/partner/opportunities', icon: <Briefcase size={18} />, label: 'Opportunities', desc: 'See current opportunities' },
          { href: '/partner/resources', icon: <BookOpen size={18} />, label: 'Resources', desc: 'Access partner tools' },
          { href: '/partner/rewards', icon: <Trophy size={18} />, label: 'Rewards', desc: 'Track your milestones' },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card hover className="group flex h-full flex-col items-center gap-2 p-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-primary-50 group-hover:text-primary">
                {action.icon}
              </div>
              <h4 className="font-semibold text-neutral-900">{action.label}</h4>
              <p className="text-xs text-neutral-500">{action.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PartnerLayout>
  );
}
