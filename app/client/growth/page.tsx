'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { mockGrowthPhases } from '@/lib/mock-data';
import { ArrowRight, Check } from 'lucide-react';

export default function ClientGrowthJourney() {
  return (
    <ClientLayout
      pageTitle="Growth Journey"
      pageSubtitle="Your strategic business growth progression with NairobiX"
    >
      {/* Journey Overview */}
      <div className="mb-12">
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Your Growth Phases
        </h3>

        {/* Timeline */}
        <div className="relative">
          {/* Visual Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary to-neutral-300" />

          {/* Phase Cards */}
          <div className="space-y-6">
            {mockGrowthPhases.map((phase) => {
              const isCompleted = phase.status === 'completed';
              const isCurrent = phase.status === 'current';

              return (
                <div key={phase.id} className="ml-20">
                  <Card
                    className={`p-6 transition-all ${
                      isCurrent ? 'border-primary-200 bg-primary-50/40' : ''
                    } ${isCompleted ? 'opacity-75' : ''}`}
                  >
                    {/* Phase Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold text-neutral-900">
                            {phase.name}
                          </h4>
                          {isCurrent && (
                            <Badge variant="primary">Current Phase</Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="success">Completed</Badge>
                          )}
                        </div>
                        <p className="text-neutral-600">{phase.objective}</p>
                      </div>
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : isCurrent
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-neutral-100 text-neutral-400'
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
                          : 'bg-white border-neutral-300'
                      }`}
                    />

                    {/* Phase Content */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Initiatives */}
                      <div>
                        <h5 className="font-semibold text-neutral-900 text-sm mb-3">
                          Initiatives
                        </h5>
                        <ul className="space-y-2">
                          {phase.initiatives.map((init, i) => (
                            <li key={i} className="text-sm text-neutral-600 flex gap-2">
                              <span className="text-primary">→</span>
                              <span>{init}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Completed Work */}
                      {phase.completedWork.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-neutral-900 text-sm mb-3">
                            Completed Work
                          </h5>
                          <ul className="space-y-2">
                            {phase.completedWork.map((work, i) => (
                              <li
                                key={i}
                                className="text-sm text-neutral-600 flex gap-2"
                              >
                                <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                                <span>{work}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Performance */}
                      <div>
                        <h5 className="font-semibold text-neutral-900 text-sm mb-3">
                          Performance
                        </h5>
                        <p className="text-sm text-neutral-700 mb-3">
                          {phase.performance}
                        </p>
                        {phase.recommendations.length > 0 && (
                          <div>
                            <h6 className="text-xs font-medium text-neutral-600 mb-2">
                              Recommendations
                            </h6>
                            <ul className="space-y-1">
                              {phase.recommendations.slice(0, 2).map((rec, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-neutral-600 flex gap-2"
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
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900">
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
      <Card className="border-blue-200 bg-blue-50/60 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h4 className="mb-1 font-semibold text-neutral-900">Ready for the next phase?</h4>
            <p className="text-sm text-neutral-700">
              Connect with the NairobiX team to discuss your next growth milestone
            </p>
          </div>
          <Button variant="primary" rightIcon={<ArrowRight size={16} />} className="flex-shrink-0">
            Request Strategy Session
          </Button>
        </div>
      </Card>
    </ClientLayout>
  );
}
