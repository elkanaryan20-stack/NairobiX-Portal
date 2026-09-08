'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Form';
import { mockPartnerOnboarding } from '@/lib/mock-data';
import { Rocket, Check, Share2, Wallet, BookOpen, Trophy } from 'lucide-react';

export default function PartnerOnboarding() {
  const completedSteps = mockPartnerOnboarding.filter(
    (s) => s.status === 'completed'
  ).length;
  const totalSteps = mockPartnerOnboarding.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <PartnerLayout
      pageTitle="Partner Onboarding"
      pageSubtitle="Your journey to becoming a full NairobiX partner"
    >
      {/* Progress Overview */}
      <Card className="mb-8 p-6 border-emerald-200 bg-emerald-50/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Onboarding Progress
            </h3>
            <p className="text-neutral-700 mb-4">
              You&apos;re{' '}
              <span className="font-semibold text-emerald-700">{Math.round(progress)}%</span> of
              the way to full partner activation!
            </p>
            <ProgressBar value={progress} showLabel={false} />
            <p className="text-sm text-neutral-600 mt-2">
              {completedSteps} of {totalSteps} steps completed
            </p>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs">
            <Rocket size={20} />
          </div>
        </div>
      </Card>

      {/* Onboarding Steps */}
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
        Onboarding Checklist
      </h3>

      <div className="space-y-3">
        {mockPartnerOnboarding.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';

          return (
            <Card
              key={step.id}
              className={`p-4 transition-all ${
                isInProgress
                  ? 'border-primary-200 bg-primary-50/40'
                  : isCompleted
                  ? 'opacity-60'
                  : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox/Status */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isInProgress
                      ? 'bg-primary text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {isCompleted ? <Check size={15} /> : idx + 1}
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold ${
                      isCompleted
                        ? 'text-neutral-600 line-through'
                        : 'text-neutral-900'
                    }`}
                  >
                    {step.name}
                  </h4>
                  {isInProgress && (
                    <p className="text-sm text-neutral-600 mt-1">
                      You&apos;re currently here
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                {isCompleted && (
                  <Badge variant="success" className="flex-shrink-0">
                    Completed
                  </Badge>
                )}
                {isInProgress && (
                  <Badge variant="primary" className="flex-shrink-0">
                    In Progress
                  </Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="mt-8 p-6 bg-blue-50/60 border-blue-200">
        <h3 className="font-semibold text-neutral-900 mb-3">Next Step: Orientation</h3>
        <p className="text-neutral-700 mb-4">
          Complete your partner orientation to access all partnership resources and features
        </p>
        <Button variant="primary">Start Orientation</Button>
      </Card>

      {/* Benefits Preview */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          What you&apos;ll unlock when onboarding is complete:
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: <Share2 size={18} />, title: 'Unlimited Referrals', desc: 'Refer as many businesses as you want' },
            { icon: <Wallet size={18} />, title: 'Commission Payouts', desc: 'Earn commissions on won referrals' },
            { icon: <BookOpen size={18} />, title: 'Partner Resources', desc: 'Access marketing and sales tools' },
            { icon: <Trophy size={18} />, title: 'Rewards Program', desc: 'Earn milestone and performance bonuses' },
          ].map((benefit) => (
            <div key={benefit.title} className="flex gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                {benefit.icon}
              </div>
              <div>
                <p className="font-medium text-neutral-900">{benefit.title}</p>
                <p className="text-sm text-neutral-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PartnerLayout>
  );
}
