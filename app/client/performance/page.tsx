'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card } from '@/components/ui/Card';
import { MetricCard, Tabs } from '@/components/ui/Form';
import { mockClientPerformanceMetrics } from '@/lib/mock-data';
import { getTrendIndicator, formatNumber } from '@/lib/utils';
import { useState } from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';

export default function ClientPerformance() {
  const [activeTab, setActiveTab] = useState('Acquisition');

  const categories = ['Acquisition', 'Conversion', 'Digital', 'Customer'];
  const metricsForCategory = mockClientPerformanceMetrics.filter(
    (m) => m.category === activeTab
  );

  return (
    <ClientLayout
      pageTitle="Performance"
      pageSubtitle="Business intelligence & growth metrics"
    >
      {/* Tabs */}
      <Tabs
        tabs={categories.map((cat) => ({
          label: cat,
          value: cat,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metricsForCategory.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.title}
            value={
              typeof metric.value === 'number'
                ? formatNumber(metric.value)
                : metric.value
            }
            subtitle={`${metric.unit}${metric.trend ? ` • ${getTrendIndicator(metric.trend)}` : ''}`}
            trend={
              metric.trend
                ? {
                    value: Math.abs(metric.change),
                    direction: metric.trend as 'up' | 'down',
                  }
                : undefined
            }
          />
        ))}
      </div>

      {/* Insights by Category */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {activeTab} Insights
        </h3>

        <Card className="p-6">
          {activeTab === 'Acquisition' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Lead Generation Overview
                </h4>
                <p className="text-neutral-700 mb-4">
                  Your acquisition system is generating high-quality leads across
                  multiple channels. Focus on scaling top-performing channels.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Top Channel Performance
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">
                      Organic Search
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      45% of qualified leads
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Monthly Growth
                    </p>
                    <p className="text-lg font-semibold text-green-700">+32%</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      YoY lead increase
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Conversion' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Sales Pipeline Health
                </h4>
                <p className="text-neutral-700 mb-4">
                  Your conversion process is optimized and performing above targets.
                  Continue nurturing the proposal stage.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Average Deal Size
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">KES 2.4M</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Up 15% from Q3
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Sales Cycle Length
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">38 days</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      -12% vs industry average
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Digital' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Web & Search Performance
                </h4>
                <p className="text-neutral-700 mb-4">
                  Your digital presence is strong with improving visibility and
                  engagement metrics.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Search Keyword Rankings
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">234</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Page 1 keywords
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Organic Engagement
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">12.4%</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      CTR improvement YoY
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Customer' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Customer Success Metrics
                </h4>
                <p className="text-neutral-700 mb-4">
                  Strong customer retention and satisfaction indicate healthy growth
                  fundamentals.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Retention Rate
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">94%</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Annual retention rate
                    </p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">
                      Repeat Business
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">48%</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Customers with repeat purchases
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-amber-200 bg-amber-50/60 p-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900">
          <BarChart3 size={17} className="text-amber-600" />
          Performance Recommendations
        </h3>
        <ul className="space-y-2.5 text-neutral-700">
          <li className="flex gap-3">
            <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <span>Scale your top-performing acquisition channels</span>
          </li>
          <li className="flex gap-3">
            <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <span>Implement advanced lead scoring to prioritize high-intent prospects</span>
          </li>
          <li className="flex gap-3">
            <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <span>Test behavioral triggers for personalized email nurture campaigns</span>
          </li>
        </ul>
      </Card>
    </ClientLayout>
  );
}
