'use client';

import Link from 'next/link';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { MetricCard, ProgressBar } from '@/components/ui/Form';
import { ArrowRight, CheckCircle2, ChevronRight, Lightbulb, Mail, Compass, FileText, Bell, Check } from 'lucide-react';
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mb-2 text-3xl font-semibold text-neutral-900">Good morning, Sarah.</h3>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h4 className="text-xl font-semibold text-primary">{mockClientProfile.businessName}</h4>
              <Badge variant="success">Growth Partnership &middot; Active</Badge>
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
      <Card className="mb-8 border-emerald-200 bg-emerald-50/60 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">Growth Pulse</h3>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xl font-semibold text-emerald-700">On Track</p>
            </div>
            <p className="text-neutral-700">
              Your current growth initiatives are progressing according to plan. CRM
              implementation is 72% complete, and lead quality has improved 24%.
            </p>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </Card>

      {/* Growth Snapshot - Key Metrics */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Growth Snapshot
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockClientPerformanceMetrics.slice(0, 4).map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.title}
              value={metric.value}
              trend={metric.trend ? { value: metric.change, direction: metric.trend as 'up' | 'down' } : undefined}
              icon={<span className="text-sm font-semibold">{getTrendIndicator(metric.trend as 'up' | 'down' | 'stable')}</span>}
            />
          ))}
        </div>
      </div>

      {/* What's Happening */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            What&apos;s Happening
          </h3>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <Link key={project.id} href={`/client/projects/${project.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="truncate font-semibold text-neutral-900">{project.name}</h4>
                        <Badge variant="info">{project.status}</Badge>
                      </div>
                      <p className="mb-3 text-sm text-neutral-600">{truncateText(project.description, 80)}</p>
                      <div className="space-y-2">
                        <ProgressBar value={project.progress} showLabel={false} size="sm" />
                        <p className="text-xs text-neutral-500">{project.progress}% complete</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="flex-shrink-0 text-neutral-300" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <Link href="/client/projects">
            <button className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all projects <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Current Growth Phase */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Current Phase
          </h3>
          <Card className="p-4">
            <h4 className="mb-2 text-lg font-semibold text-primary">{currentPhase?.name}</h4>
            <p className="mb-4 text-sm text-neutral-600">{currentPhase?.objective}</p>

            {/* Phase Progress */}
            <div className="mb-4 space-y-2">
              {mockGrowthPhases.map((phase) => (
                <div key={phase.id} className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      phase.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : phase.status === 'current'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {phase.status === 'completed' ? <Check size={11} /> : phase.status === 'current' ? '●' : '○'}
                  </div>
                  <span className={phase.status === 'current' ? 'text-sm font-semibold text-primary' : 'text-sm text-neutral-500'}>
                    {phase.name}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/client/growth">
              <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View details <ArrowRight size={16} />
              </button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Latest Growth Insight */}
      {growthInsights.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Latest Growth Insight
          </h3>
          <Card className="border-blue-200 bg-blue-50/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Lightbulb size={19} />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 text-lg font-semibold text-neutral-900">{growthInsights[0].title}</h4>
                <p className="mb-4 text-neutral-700">{growthInsights[0].summary}</p>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-sm bg-white/60 p-3">
                    <p className="mb-1 text-xs font-medium text-neutral-500">Why it matters</p>
                    <p className="text-sm text-neutral-900">{truncateText(growthInsights[0].whyItMatters, 100)}</p>
                  </div>
                  <div className="rounded-sm bg-white/60 p-3">
                    <p className="mb-1 text-xs font-medium text-neutral-500">Recommendation</p>
                    <p className="text-sm text-neutral-900">{truncateText(growthInsights[0].recommendation, 100)}</p>
                  </div>
                </div>

                <Link href="/client/insights">
                  <button className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
                    Explore all insights <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/client/requests', icon: <Mail />, label: 'Make a Request', stat: 'Submit growth initiatives, system requests or strategy sessions' },
          { href: '/client/concierge', icon: <Compass />, label: 'NairobiX Concierge', stat: 'Get personalized support and guidance' },
          { href: '/client/reports', icon: <FileText />, label: 'View Reports', stat: 'Access monthly and performance reports' },
          {
            href: '/client/notifications',
            icon: <Bell />,
            label: 'Notifications',
            stat: unreadNotifications > 0 ? `${unreadNotifications} unread update${unreadNotifications > 1 ? 's' : ''}` : 'All caught up',
            badge: unreadNotifications,
          },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card hover className="relative flex h-full flex-col items-center gap-2.5 p-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 [&>svg]:h-[18px] [&>svg]:w-[18px]">
                {action.icon}
              </div>
              <h4 className="font-semibold text-neutral-900">{action.label}</h4>
              <p className="text-xs text-neutral-500">{action.stat}</p>
              {!!action.badge && (
                <Badge variant="primary" className="absolute right-3 top-3">
                  {action.badge}
                </Badge>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </ClientLayout>
  );
}
