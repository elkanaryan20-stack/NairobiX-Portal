'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { mockClientInsights } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

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
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {insight.title}
                </h3>
                <p className="text-neutral-700 font-medium">{insight.summary}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <Badge
                  variant={
                    insight.priority === 'high'
                      ? 'warning'
                      : insight.priority === 'medium'
                      ? 'neutral'
                      : 'neutral'
                  }
                >
                  {insight.priority === 'high' && '🔴 '}
                  {insight.priority === 'medium' && '🟡 '}
                  {insight.priority === 'low' && '🔵 '}
                  {insight.priority}
                </Badge>
                <p className="text-xs text-neutral-500 mt-2">{formatDate(insight.date)}</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Why It Matters */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <span>💡</span> Why it matters
                </h4>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {insight.whyItMatters}
                </p>
              </div>

              {/* Impact */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <span>🎯</span> Impact
                </h4>
                <p className="text-neutral-700 text-sm leading-relaxed">{insight.impact}</p>
              </div>
            </div>

            {/* Data Point */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-4 rounded-lg mb-6">
              <p className="text-xs text-neutral-600 font-medium mb-1">Data Point</p>
              <p className="text-lg font-bold text-neutral-900">{insight.dataPoint}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-2">
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
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No insights yet
          </h3>
          <p className="text-neutral-600">
            Check back soon for growth insights based on your performance data
          </p>
        </Card>
      )}
    </ClientLayout>
  );
}
