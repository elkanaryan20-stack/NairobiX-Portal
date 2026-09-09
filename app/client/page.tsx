'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Clock3,
  Briefcase,
  BarChart3,
  LifeBuoy,
  FolderOpen,
} from 'lucide-react';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { MetricCard, ProgressBar } from '@/components/ui/Form';
import {
  mockClientProfile,
  mockClientProjects,
  mockClientPerformanceMetrics,
  mockClientInsights,
  mockGrowthPhases,
  mockClientServiceRequests,
  mockClientTasks,
  mockClientInvoices,
} from '@/lib/mock-data';
import { getTrendIndicator, truncateText, formatDate, daysUntil } from '@/lib/utils';

export default function ClientOverview() {
  const growthInsights = mockClientInsights.slice(0, 1);
  const activeProjects = mockClientProjects.filter((p) => p.status === 'active');
  const currentPhase = mockGrowthPhases.find((p) => p.status === 'current');

  const unresolvedTickets = mockClientServiceRequests.filter((r) => r.status !== 'resolved');
  const overdueInvoices = mockClientInvoices.filter((i) => i.status === 'overdue');
  const pendingTasks = mockClientTasks.filter((t) => t.status !== 'completed');

  const attentionItems = [
    ...unresolvedTickets
      .filter((r) => r.priority === 'high' || r.priority === 'urgent')
      .map((r) => ({ label: r.title, meta: 'Support request', href: '/client/support' })),
    ...overdueInvoices.map((i) => ({ label: `Invoice ${i.invoiceNumber} overdue`, meta: 'Billing', href: '/client/billing' })),
  ];

  const upcoming = [
    ...pendingTasks.map((t) => ({ label: t.title, date: t.dueDate, href: '/client/work' })),
    ...mockClientProjects.flatMap((p) =>
      p.milestones.filter((m) => m.status !== 'completed').map((m) => ({ label: `${m.name} — ${p.name}`, date: m.dueDate, href: '/client/work' }))
    ),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <ClientLayout pageTitle="Overview" pageSubtitle="Welcome back, Sarah. Here's your growth partnership status.">
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

      {/* Growth Pulse — how are we doing */}
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

      {/* KPIs */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Growth Snapshot</h3>
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

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* What's active */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">What&apos;s Active</h3>
          <div className="space-y-3">
            {activeProjects.slice(0, 2).map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="truncate font-semibold text-neutral-900">{project.name}</h4>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="mb-3 text-sm text-neutral-600">{truncateText(project.description, 80)}</p>
                    <div className="space-y-2">
                      <ProgressBar value={project.progress} showLabel={false} size="sm" />
                      <p className="text-xs text-neutral-500">{project.progress}% complete</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Link href="/client/work">
            <button className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all work <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Current Growth Phase */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Current Phase</h3>
          <Card className="p-4">
            <h4 className="mb-2 text-lg font-semibold text-primary">{currentPhase?.name}</h4>
            <p className="mb-4 text-sm text-neutral-600">{currentPhase?.objective}</p>
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
                    {phase.status === 'completed' ? <CheckCircle2 size={11} /> : phase.status === 'current' ? '●' : '○'}
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

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* What needs attention */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <AlertTriangle size={14} className="text-amber-500" /> Needs Attention
          </h3>
          {attentionItems.length > 0 ? (
            <div className="space-y-2.5">
              {attentionItems.map((item, i) => (
                <Link key={i} href={item.href}>
                  <Card hover className="flex items-center justify-between gap-3 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{item.label}</p>
                      <p className="text-xs text-neutral-500">{item.meta}</p>
                    </div>
                    <ChevronRight size={16} className="flex-shrink-0 text-neutral-300" />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-5 text-center text-sm text-neutral-500">Nothing needs your attention right now.</Card>
          )}
        </div>

        {/* What's next */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <Clock3 size={14} className="text-neutral-400" /> What&apos;s Next
          </h3>
          <div className="space-y-2.5">
            {upcoming.map((item, i) => {
              const days = daysUntil(item.date);
              return (
                <Link key={i} href={item.href}>
                  <Card hover className="flex items-center justify-between gap-3 p-3.5">
                    <p className="truncate text-sm font-medium text-neutral-900">{item.label}</p>
                    <p className="flex-shrink-0 text-xs text-neutral-500">
                      {days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d · ${formatDate(item.date)}`}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Latest Growth Insight — what happened */}
      {growthInsights.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Latest Growth Insight</h3>
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
          { href: '/client/work', icon: <Briefcase />, label: 'Your Work', stat: `${activeProjects.length} active engagement${activeProjects.length === 1 ? '' : 's'}` },
          { href: '/client/insights', icon: <BarChart3 />, label: 'Insights & Reports', stat: 'Performance, insights and published reports' },
          { href: '/client/support', icon: <LifeBuoy />, label: 'Support', stat: unresolvedTickets.length > 0 ? `${unresolvedTickets.length} open request${unresolvedTickets.length === 1 ? '' : 's'}` : 'All caught up' },
          { href: '/client/resources', icon: <FolderOpen />, label: 'Resources', stat: 'Documents and partnership benefits' },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card hover className="relative flex h-full flex-col items-center gap-2.5 p-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 [&>svg]:h-[18px] [&>svg]:w-[18px]">
                {action.icon}
              </div>
              <h4 className="font-semibold text-neutral-900">{action.label}</h4>
              <p className="text-xs text-neutral-500">{action.stat}</p>
            </Card>
          </Link>
        ))}
      </div>
    </ClientLayout>
  );
}
