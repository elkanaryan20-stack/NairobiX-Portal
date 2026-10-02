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
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          Onboarding Progress
        </p>
        <p className="text-sm font-semibold text-fg">
          {completed} of {steps.length} steps &middot; {percent}%
        </p>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
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
                  ? 'border-primary/25 bg-primary/10'
                  : step.status === 'completed'
                  ? 'border-line bg-surface hover:bg-surface-2'
                  : 'border-line bg-surface-2',
                !isReachable && 'cursor-not-allowed opacity-60'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                  step.status === 'completed'
                    ? 'bg-emerald-500 text-canvas'
                    : isCurrent
                    ? 'bg-primary text-canvas'
                    : step.status === 'locked'
                    ? 'bg-white/10 text-fg-tertiary'
                    : 'bg-white/10 text-fg-secondary'
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
                  isCurrent ? 'text-primary-400' : 'text-fg-secondary'
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
