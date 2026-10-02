'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui/Card';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { ArrowRight, Check } from 'lucide-react';
import type { GrowthPhase } from '@/lib/types';

export function ClientGrowthView({ growthPhases }: { growthPhases: GrowthPhase[] }) {
  if (growthPhases.length === 0) {
    return (
      <PortalLayout pageTitle="Growth Journey" pageSubtitle="Your strategic business growth progression with NairobiX">
        <NotYetAvailable
          title="Your growth journey isn't available yet"
          description="Your growth phases, initiatives and milestones will appear here once NairobiX publishes them to your Portal."
        />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      pageTitle="Growth Journey"
      pageSubtitle="Your strategic business growth progression with NairobiX"
    >
      {/* Journey Overview */}
      <div className="mb-12">
        <h3 className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          Your Growth Phases
        </h3>

        {/* Timeline */}
        <div className="relative">
          {/* Visual Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-line" />

          {/* Phase Cards */}
          <div className="space-y-6">
            {growthPhases.map((phase) => {
              const isCompleted = phase.status === 'completed';
              const isCurrent = phase.status === 'current';

              return (
                <div key={phase.id} className="ml-20">
                  <Card
                    className={`p-6 transition-all ${
                      isCurrent ? 'border-primary/25 bg-primary/10' : ''
                    } ${isCompleted ? 'opacity-75' : ''}`}
                  >
                    {/* Phase Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold text-fg">
                            {phase.name}
                          </h4>
                          {isCurrent && (
                            <Badge variant="primary">Current Phase</Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="success">Completed</Badge>
                          )}
                        </div>
                        <p className="text-fg-secondary">{phase.objective}</p>
                      </div>
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : isCurrent
                            ? 'bg-primary/15 text-primary-400'
                            : 'bg-white/[0.05] text-fg-tertiary'
                        }`}
                      >
                        {isCompleted ? <Check size={16} /> : isCurrent ? '●' : '○'}
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-10 top-8 w-4 h-4 rounded-full border-2 ${
                        isCurrent
                          ? 'bg-primary border-primary'
                          : isCompleted
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-surface border-line-strong'
                      }`}
                    />

                    {/* Phase Content */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Initiatives */}
                      <div>
                        <h5 className="font-semibold text-fg text-sm mb-3">
                          Initiatives
                        </h5>
                        <ul className="space-y-2">
                          {phase.initiatives.map((init, i) => (
                            <li key={i} className="text-sm text-fg-secondary flex gap-2">
                              <span className="text-primary">→</span>
                              <span>{init}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Completed Work */}
                      {phase.completedWork.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-fg text-sm mb-3">
                            Completed Work
                          </h5>
                          <ul className="space-y-2">
                            {phase.completedWork.map((work, i) => (
                              <li
                                key={i}
                                className="text-sm text-fg-secondary flex gap-2"
                              >
                                <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                                <span>{work}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Performance */}
                      <div>
                        <h5 className="font-semibold text-fg text-sm mb-3">
                          Performance
                        </h5>
                        <p className="text-sm text-fg-secondary mb-3">
                          {phase.performance}
                        </p>
                        {phase.recommendations.length > 0 && (
                          <div>
                            <h6 className="text-xs font-medium text-fg-secondary mb-2">
                              Recommendations
                            </h6>
                            <ul className="space-y-1">
                              {phase.recommendations.slice(0, 2).map((rec, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-fg-secondary flex gap-2"
                                >
                                  <span>→</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Milestone */}
                    {phase.nextMilestone && (
                      <div className="mt-4 pt-4 border-t border-line">
                        <p className="text-sm font-medium text-fg">
                          Next milestone: <span className="text-primary">{phase.nextMilestone}</span>
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Card className="border-blue-500/20 bg-blue-500/[0.06] p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h4 className="mb-1 font-semibold text-fg">Ready for the next phase?</h4>
            <p className="text-sm text-fg-secondary">
              Connect with the NairobiX team to discuss your next growth milestone
            </p>
          </div>
          <Link href="/portal/client/support" className="flex-shrink-0">
            <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
              Request Strategy Session
            </Button>
          </Link>
        </div>
      </Card>
    </PortalLayout>
  );
}
