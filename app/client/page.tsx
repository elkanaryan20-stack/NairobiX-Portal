'use client';

import Link from 'next/link';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { MetricCard, ProgressBar } from '@/components/ui/Form';
import { ArrowRight } from 'lucide-react';
import {
  mockClientProfile,
  mockClientProjects,
  mockClientPerformanceMetrics,
  mockClientInsights,
  mockGrowthPhases,
  mockClientNotifications,
} from '@/lib/mock-data';
import { getTrendIndicator, truncateText } from '@/lib/utils';

export default function ClientOverview() {
  const growthInsights = mockClientInsights.slice(0, 1); // Latest insight
  const recentProjects = mockClientProjects.slice(0, 2);
  const currentPhase = mockGrowthPhases.find((p) => p.status === 'current');
  const unreadNotifications = mockClientNotifications.filter((n) => !n.read).length;

  return (
    <ClientLayout
      pageTitle="Overview"
      pageSubtitle="Welcome back, Sarah. Here's your growth partnership status."
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-2">
              Good morning, Sarah.
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h4 className="text-xl font-semibold text-primary">
                {mockClientProfile.businessName}
              </h4>
              <Badge variant="success">Growth Partnership · Active</Badge>
            </div>
          </div>
          <Link href="/client/growth">
            <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
              View Growth Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Growth Pulse */}
      <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 border-green-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Growth Pulse</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl">🟢</span>
              <p className="text-xl font-bold text-green-700">On Track</p>
            </div>
            <p className="text-neutral-700">
              Your current growth initiatives are progressing according to plan. CRM
              implementation is 72% complete, and lead quality has improved 24%.
            </p>
          </div>
          <div className="text-4xl">📈</div>
        </div>
      </Card>

      {/* Growth Snapshot - Key Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Growth Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockClientPerformanceMetrics.slice(0, 4).map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.title}
              value={metric.value}
              trend={metric.trend ? { value: metric.change, direction: metric.trend as 'up' | 'down' } : undefined}
              icon={getTrendIndicator(metric.trend as 'up' | 'down' | 'stable')}
            />
          ))}
        </div>
      </div>

      {/* What's Happening */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">What&apos;s Happening</h3>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <Link key={project.id} href={`/client/projects/${project.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-neutral-900 truncate">
                          {project.name}
                        </h4>
                        <Badge variant="primary">{project.status}</Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3">
                        {truncateText(project.description, 80)}
                      </p>
                      <div className="space-y-2">
                        <ProgressBar value={project.progress} showLabel={false} size="sm" />
                        <p className="text-xs text-neutral-500">{project.progress}% complete</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {project.nextAction ? '⏭️' : ''}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <Link href="/client/projects">
            <button className="text-primary font-medium text-sm mt-4 hover:underline flex items-center gap-1">
              View all projects <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Current Growth Phase */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Current Phase</h3>
          <Card className="p-4">
            <h4 className="font-bold text-primary text-lg mb-2">{currentPhase?.name}</h4>
            <p className="text-sm text-neutral-600 mb-4">{currentPhase?.objective}</p>

            {/* Phase Progress */}
            <div className="space-y-2 mb-4">
              {mockGrowthPhases.map((phase) => (
                <div key={phase.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-neutral-200 text-neutral-700">
                    {phase.status === 'completed' ? '✓' : phase.status === 'current' ? '●' : '○'}
                  </div>
                  <span className={phase.status === 'current' ? 'font-bold text-primary' : 'text-neutral-600 text-sm'}>
                    {phase.name}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/client/growth">
              <button className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                View details <ArrowRight size={16} />
              </button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Latest Growth Insight */}
      {growthInsights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Latest Growth Insight</h3>
          <Card className="bg-blue-50 border-blue-200 p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <h4 className="font-bold text-neutral-900 mb-2 text-lg">
                  {growthInsights[0].title}
                </h4>
                <p className="text-neutral-700 mb-4">{growthInsights[0].summary}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <p className="text-xs text-neutral-600 font-medium mb-1">Why it matters</p>
                    <p className="text-sm text-neutral-900">
                      {truncateText(growthInsights[0].whyItMatters, 100)}
                    </p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <p className="text-xs text-neutral-600 font-medium mb-1">Recommendation</p>
                    <p className="text-sm text-neutral-900">
                      {truncateText(growthInsights[0].recommendation, 100)}
                    </p>
                  </div>
                </div>

                <Link href="/client/insights">
                  <button className="text-blue-700 font-medium text-sm hover:underline flex items-center gap-1">
                    Explore all insights <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/client/requests">
          <Card hover className="p-4 text-center">
            <p className="text-2xl mb-2">✉️</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Make a Request</h4>
            <p className="text-xs text-neutral-600">
              Submit growth initiatives, system requests or strategy sessions
            </p>
          </Card>
        </Link>

        <Link href="/client/concierge">
          <Card hover className="p-4 text-center">
            <p className="text-2xl mb-2">🎯</p>
            <h4 className="font-semibold text-neutral-900 mb-1">NairobiX Concierge</h4>
            <p className="text-xs text-neutral-600">Get personalized support and guidance</p>
          </Card>
        </Link>

        <Link href="/client/reports">
          <Card hover className="p-4 text-center">
            <p className="text-2xl mb-2">📄</p>
            <h4 className="font-semibold text-neutral-900 mb-1">View Reports</h4>
            <p className="text-xs text-neutral-600">Access monthly and performance reports</p>
          </Card>
        </Link>

        <Link href="/client/notifications">
          <Card hover className="p-4 text-center relative">
            <p className="text-2xl mb-2">🔔</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Notifications</h4>
            <p className="text-xs text-neutral-600">
              {unreadNotifications > 0
                ? `${unreadNotifications} unread update${unreadNotifications > 1 ? 's' : ''}`
                : 'All caught up'}
            </p>
            {unreadNotifications > 0 && (
              <Badge variant="primary" className="absolute top-2 right-2 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Card>
        </Link>
      </div>
    </ClientLayout>
  );
}
