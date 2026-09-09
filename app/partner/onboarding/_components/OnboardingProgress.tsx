'use client';

import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OnboardingStep, OnboardingStepId } from '@/lib/types';

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStepId: OnboardingStepId;
  onSelectStep: (id: OnboardingStepId) => void;
}

export function OnboardingProgress({ steps, currentStepId, onSelectStep }: OnboardingProgressProps) {
  const completed = steps.filter((s) => s.status === 'completed').length;
  const percent = Math.round((completed / steps.length) * 100);

  return (
    <div className="card mb-8 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Onboarding Progress
        </p>
        <p className="text-sm font-semibold text-neutral-900">
          {completed} of {steps.length} steps &middot; {percent}%
        </p>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {steps.map((step) => {
          const isCurrent = step.id === currentStepId;
          const isReachable = step.status === 'completed' || step.status === 'in-progress';

          return (
            <button
              key={step.id}
              onClick={() => isReachable && onSelectStep(step.id)}
              disabled={!isReachable}
              className={cn(
                'flex min-w-[7.5rem] flex-1 flex-col items-start gap-2 rounded-sm border px-3 py-2.5 text-left transition-colors',
                isCurrent
                  ? 'border-primary-200 bg-primary-50/50'
                  : step.status === 'completed'
                  ? 'border-neutral-200 bg-white hover:bg-neutral-50'
                  : 'border-neutral-100 bg-neutral-50',
                !isReachable && 'cursor-not-allowed opacity-60'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                  step.status === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : step.status === 'locked'
                    ? 'bg-neutral-200 text-neutral-400'
                    : 'bg-neutral-200 text-neutral-600'
                )}
              >
                {step.status === 'completed' ? (
                  <Check size={13} />
                ) : step.status === 'locked' ? (
                  <Lock size={11} />
                ) : (
                  step.order
                )}
              </span>
              <span
                className={cn(
                  'text-xs font-medium leading-snug',
                  isCurrent ? 'text-primary-700' : 'text-neutral-700'
                )}
              >
                {step.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
