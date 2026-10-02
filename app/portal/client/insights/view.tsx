'use client';

import { useState } from 'react';
import { Lightbulb, Target, BarChart3, Sparkles, Eye, Download, X } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Button, PriorityBadge, Badge } from '@/components/ui/Card';
import { MetricCard, Tabs, EmptyState } from '@/components/ui/Form';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { formatDate, formatNumber, getTrendIndicator } from '@/lib/utils';
import type { GrowthInsight, PerformanceMetric, Report } from '@/lib/types';

const priorityOrder = { high: 0, medium: 1, low: 2 };
const performanceCategories = ['Acquisition', 'Conversion', 'Digital'];

export function ClientInsightsView({
  insights,
  metrics,
  reports,
}: {
  insights: GrowthInsight[];
  metrics: PerformanceMetric[];
  reports: Report[];
}) {
  const [tab, setTab] = useState('insights');
  const [perfCategory, setPerfCategory] = useState('Acquisition');
  const [openReport, setOpenReport] = useState<Report | null>(null);

  const sortedInsights = [...insights].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  const metricsForCategory = metrics.filter((m) => m.category === perfCategory);

  if (insights.length === 0 && metrics.length === 0 && reports.length === 0) {
    return (
      <PortalLayout pageTitle="Insights" pageSubtitle="Growth intelligence, performance and published reports">
        <NotYetAvailable
          title="Insights aren't available yet"
          description="Growth insights, performance metrics and reports will appear here once NairobiX publishes them to your Portal."
        />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout pageTitle="Insights" pageSubtitle="Growth intelligence, performance and published reports">
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
                  <h3 className="mb-2 text-xl font-semibold text-fg">{insight.title}</h3>
                  <p className="font-medium text-fg-secondary">{insight.summary}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <PriorityBadge priority={insight.priority} />
                  <p className="mt-2 text-xs text-fg-tertiary">{formatDate(insight.date)}</p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-sm border border-blue-500/20 bg-blue-500/[0.06] p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-fg">
                    <Lightbulb size={16} className="text-blue-400" /> Why it matters
                  </h4>
                  <p className="text-sm leading-relaxed text-fg-secondary">{insight.whyItMatters}</p>
                </div>
                <div className="rounded-sm border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-fg">
                    <Target size={16} className="text-emerald-400" /> Impact
                  </h4>
                  <p className="text-sm leading-relaxed text-fg-secondary">{insight.impact}</p>
                </div>
              </div>

              <div className="mb-6 rounded-sm border border-primary/25 bg-primary/10 p-4">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-fg-secondary">
                  <BarChart3 size={13} /> Data Point
                </p>
                <p className="text-lg font-semibold text-fg">{insight.dataPoint}</p>
              </div>

              <div className="rounded-sm border-l-4 border-indigo-400 bg-indigo-500/[0.06] p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-fg">
                  <Sparkles size={16} className="text-indigo-500" />
                  NairobiX Recommendation
                </h4>
                <p className="mb-4 text-sm text-fg-secondary">{insight.recommendation}</p>
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
                    ? 'rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary-400'
                    : 'rounded-full border border-line px-3 py-1 text-xs font-medium text-fg-secondary hover:border-line-strong'
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

          <Card className="border-amber-500/20 bg-amber-500/[0.06] p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-fg">
              <BarChart3 size={17} className="text-amber-400" />
              Performance Recommendations
            </h3>
            <ul className="space-y-2.5 text-fg-secondary">
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-amber-400">&rarr;</span>
                <span>Scale your top-performing acquisition channels</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-amber-400">&rarr;</span>
                <span>Implement advanced lead scoring to prioritize high-intent prospects</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-amber-400">&rarr;</span>
                <span>Test behavioral triggers for personalized email nurture campaigns</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 && (
            <EmptyState icon={<BarChart3 />} title="No reports yet" description="Published reports will appear here." />
          )}
          {reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="grid items-center gap-6 md:grid-cols-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-fg">{report.title}</h3>
                    <Badge variant="neutral">{report.type}</Badge>
                  </div>
                  <p className="mb-2 text-sm text-fg-secondary">{report.summary}</p>
                  <p className="text-xs text-fg-tertiary">Published {formatDate(report.publishedDate)}</p>
                </div>

                <div className="text-center md:text-left">
                  <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Period</p>
                  <p className="text-lg font-semibold text-fg">{report.period}</p>
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
            <Card className="border-primary/25 bg-primary/10 p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">{openReport.period}</p>
                  <h3 className="text-lg font-semibold text-fg">{openReport.title}</h3>
                </div>
                <button onClick={() => setOpenReport(null)} className="text-fg-tertiary hover:text-fg-secondary">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-fg-secondary">{openReport.summary}</p>
              <p className="mt-4 text-xs text-fg-tertiary">
                Full report generation from Zoho Analytics will land here once the reporting API is connected —
                this is the complete summary NairobiX published for this period.
              </p>
            </Card>
          )}

          <Card className="mt-8 border-primary/25 bg-primary/10 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="mb-1 font-semibold text-fg">Need a custom report?</h4>
                <p className="text-sm text-fg-secondary">
                  Request a specialized analysis tailored to your needs from the Support tab.
                </p>
              </div>
              <Button variant="primary" onClick={() => (window.location.href = '/portal/client/support')}>
                Request Custom Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
}
