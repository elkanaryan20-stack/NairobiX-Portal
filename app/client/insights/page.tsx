'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Button, PriorityBadge } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Form';
import { mockClientInsights } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Lightbulb, Target, Sparkles, BarChart3 } from 'lucide-react';

export default function ClientInsights() {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedInsights = [...mockClientInsights].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <ClientLayout
      pageTitle="Insights"
      pageSubtitle="Actionable growth intelligence and strategic recommendations"
    >
      {/* Insights List */}
      <div className="space-y-6">
        {sortedInsights.map((insight) => (
          <Card key={insight.id} className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {insight.title}
                </h3>
                <p className="text-neutral-700 font-medium">{insight.summary}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <PriorityBadge priority={insight.priority} />
                <p className="text-xs text-neutral-500 mt-2">{formatDate(insight.date)}</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Why It Matters */}
              <div className="rounded-sm border border-blue-200 bg-blue-50/60 p-4">
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <Lightbulb size={16} className="text-blue-600" /> Why it matters
                </h4>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {insight.whyItMatters}
                </p>
              </div>

              {/* Impact */}
              <div className="rounded-sm border border-emerald-200 bg-emerald-50/60 p-4">
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <Target size={16} className="text-emerald-600" /> Impact
                </h4>
                <p className="text-neutral-700 text-sm leading-relaxed">{insight.impact}</p>
              </div>
            </div>

            {/* Data Point */}
            <div className="mb-6 rounded-sm border border-primary-200 bg-primary-50/50 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                <BarChart3 size={13} /> Data Point
              </p>
              <p className="text-lg font-semibold text-neutral-900">{insight.dataPoint}</p>
            </div>

            {/* Recommendation */}
            <div className="rounded-sm border-l-4 border-indigo-400 bg-indigo-50/60 p-4">
              <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                NairobiX Recommendation
              </h4>
              <p className="text-neutral-700 text-sm mb-4">{insight.recommendation}</p>
              <Button variant="primary" size="sm">
                Discuss with NairobiX
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedInsights.length === 0 && (
        <EmptyState
          icon={<Lightbulb />}
          title="No insights yet"
          description="Check back soon for growth insights based on your performance data."
        />
      )}
    </ClientLayout>
  );
}
