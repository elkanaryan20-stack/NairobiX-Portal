'use client';

import { Trophy, CheckCircle2 } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Form';
import { mockPartnerRewards } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function PartnerRewards() {
  const earned = mockPartnerRewards.filter((r) => r.earnedDate);
  const inProgress = mockPartnerRewards.filter((r) => !r.earnedDate);

  return (
    <PartnerLayout
      pageTitle="Rewards"
      pageSubtitle="Milestones and recognition for growing the NairobiX network"
    >
      {inProgress.length > 0 && (
        <div className="mb-10">
          <h3 className="mb-5 text-lg font-semibold text-neutral-900">In Progress</h3>
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
                  <ProgressBar
                    value={Math.min(reward.progress.current, reward.progress.target)}
                    max={reward.progress.target}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {earned.length > 0 && (
        <div>
          <h3 className="mb-5 text-lg font-semibold text-neutral-900">Earned</h3>
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
                {reward.earnedDate && (
                  <p className="text-xs text-neutral-400">Earned {formatDate(reward.earnedDate)}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </PartnerLayout>
  );
}
