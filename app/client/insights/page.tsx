'use client';

import { useState } from 'react';
import { Lightbulb, Target, BarChart3, Sparkles, Eye, Download, X } from 'lucide-react';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Button, PriorityBadge, Badge } from '@/components/ui/Card';
import { MetricCard, Tabs, EmptyState } from '@/components/ui/Form';
import { mockClientInsights, mockClientPerformanceMetrics, mockClientReports } from '@/lib/mock-data';
import { formatDate, formatNumber, getTrendIndicator } from '@/lib/utils';
import type { Report } from '@/lib/types';

const priorityOrder = { high: 0, medium: 1, low: 2 };
const performanceCategories = ['Acquisition', 'Conversion', 'Digital'];

export default function ClientInsightsHub() {
  const [tab, setTab] = useState('insights');
  const [perfCategory, setPerfCategory] = useState('Acquisition');
  const [openReport, setOpenReport] = useState<Report | null>(null);

  const sortedInsights = [...mockClientInsights].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  const metricsForCategory = mockClientPerformanceMetrics.filter((m) => m.category === perfCategory);

  return (
    <ClientLayout pageTitle="Insights" pageSubtitle="Growth intelligence, performance and published reports">
      <Tabs
        tabs={[
          { label: 'Growth Insights', value: 'insights' },
          { label: 'Performance', value: 'performance' },
          { label: 'Reports', value: 'reports' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />

      {/* Growth Insights */}
      {tab === 'insights' && (
        <div className="space-y-6">
          {sortedInsights.map((insight) => (
            <Card key={insight.id} className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold text-neutral-900">{insight.title}</h3>
                  <p className="font-medium text-neutral-700">{insight.summary}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <PriorityBadge priority={insight.priority} />
                  <p className="mt-2 text-xs text-neutral-500">{formatDate(insight.date)}</p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-sm border border-blue-200 bg-blue-50/60 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-neutral-900">
                    <Lightbulb size={16} className="text-blue-600" /> Why it matters
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-700">{insight.whyItMatters}</p>
                </div>
                <div className="rounded-sm border border-emerald-200 bg-emerald-50/60 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-neutral-900">
                    <Target size={16} className="text-emerald-600" /> Impact
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-700">{insight.impact}</p>
                </div>
              </div>

              <div className="mb-6 rounded-sm border border-primary-200 bg-primary-50/50 p-4">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                  <BarChart3 size={13} /> Data Point
                </p>
                <p className="text-lg font-semibold text-neutral-900">{insight.dataPoint}</p>
              </div>

              <div className="rounded-sm border-l-4 border-indigo-400 bg-indigo-50/60 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-neutral-900">
                  <Sparkles size={16} className="text-indigo-500" />
                  NairobiX Recommendation
                </h4>
                <p className="mb-4 text-sm text-neutral-700">{insight.recommendation}</p>
                <Button variant="primary" size="sm">
                  Discuss with NairobiX
                </Button>
              </div>
            </Card>
          ))}

          {sortedInsights.length === 0 && (
            <EmptyState
              icon={<Lightbulb />}
              title="No insights yet"
              description="Check back soon for growth insights based on your performance data."
            />
          )}
        </div>
      )}

      {/* Performance */}
      {tab === 'performance' && (
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {performanceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setPerfCategory(cat)}
                className={
                  perfCategory === cat
                    ? 'rounded-full border border-primary bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700'
                    : 'rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-300'
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metricsForCategory.map((metric) => (
              <MetricCard
                key={metric.id}
                label={metric.title}
                value={typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                subtitle={`${metric.unit}${metric.trend ? ` · trending ${getTrendIndicator(metric.trend)}` : ''}`}
                trend={metric.trend ? { value: Math.abs(metric.change), direction: metric.trend as 'up' | 'down' } : undefined}
              />
            ))}
          </div>

          <Card className="border-amber-200 bg-amber-50/60 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900">
              <BarChart3 size={17} className="text-amber-600" />
              Performance Recommendations
            </h3>
            <ul className="space-y-2.5 text-neutral-700">
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-amber-600">&rarr;</span>
                <span>Scale your top-performing acquisition channels</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-amber-600">&rarr;</span>
                <span>Implement advanced lead scoring to prioritize high-intent prospects</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-amber-600">&rarr;</span>
                <span>Test behavioral triggers for personalized email nurture campaigns</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <div className="space-y-4">
          {mockClientReports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="grid items-center gap-6 md:grid-cols-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{report.title}</h3>
                    <Badge variant="neutral">{report.type}</Badge>
                  </div>
                  <p className="mb-2 text-sm text-neutral-600">{report.summary}</p>
                  <p className="text-xs text-neutral-500">Published {formatDate(report.publishedDate)}</p>
                </div>

                <div className="text-center md:text-left">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">Period</p>
                  <p className="text-lg font-semibold text-neutral-900">{report.period}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={<Eye size={16} />} onClick={() => setOpenReport(report)}>
                    View
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Download size={16} />} onClick={() => setOpenReport(report)}>
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {openReport && (
            <Card className="border-primary-200 bg-primary-50/40 p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{openReport.period}</p>
                  <h3 className="text-lg font-semibold text-neutral-900">{openReport.title}</h3>
                </div>
                <button onClick={() => setOpenReport(null)} className="text-neutral-400 hover:text-neutral-700">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-neutral-700">{openReport.summary}</p>
              <p className="mt-4 text-xs text-neutral-500">
                Full report generation from Zoho Analytics will land here once the reporting API is connected —
                this is the complete summary NairobiX published for this period.
              </p>
            </Card>
          )}

          <Card className="mt-8 border-primary-200 bg-primary-50/40 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="mb-1 font-semibold text-neutral-900">Need a custom report?</h4>
                <p className="text-sm text-neutral-700">
                  Request a specialized analysis tailored to your needs from the Support tab.
                </p>
              </div>
              <Button variant="primary" onClick={() => (window.location.href = '/client/support')}>
                Request Custom Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </ClientLayout>
  );
}
