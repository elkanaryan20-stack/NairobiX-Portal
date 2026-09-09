'use client';

import { useState } from 'react';
import {
  Check,
  User,
  Megaphone,
  Users,
  Circle,
  CheckCircle2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, StatusBadge, PriorityBadge } from '@/components/ui/Card';
import { ProgressBar, Tabs, EmptyState } from '@/components/ui/Form';
import {
  mockClientProjects,
  mockClientCampaigns,
  mockClientLeads,
  mockClientTasks,
} from '@/lib/mock-data';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import type { ClientTask } from '@/lib/types';

const leadFilters = ['all', 'new', 'contacted', 'qualified', 'converted', 'lost'] as const;
const taskOrder: ClientTask['status'][] = ['pending', 'in-progress', 'completed'];

export default function ClientWork() {
  const [tab, setTab] = useState('engagements');
  const [leadFilter, setLeadFilter] = useState<(typeof leadFilters)[number]>('all');
  const [tasks, setTasks] = useState<ClientTask[]>(mockClientTasks);

  const filteredLeads =
    leadFilter === 'all' ? mockClientLeads : mockClientLeads.filter((l) => l.status === leadFilter);

  function advanceTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextIndex = Math.min(taskOrder.indexOf(t.status) + 1, taskOrder.length - 1);
        return { ...t, status: taskOrder[nextIndex] };
      })
    );
  }

  return (
    <ClientLayout pageTitle="Work" pageSubtitle="Engagements, campaigns, leads and tasks in one place">
      <Tabs
        tabs={[
          { label: `Engagements (${mockClientProjects.length})`, value: 'engagements' },
          { label: `Campaigns (${mockClientCampaigns.length})`, value: 'campaigns' },
          { label: `Leads (${mockClientLeads.length})`, value: 'leads' },
          { label: `Tasks (${tasks.filter((t) => t.status !== 'completed').length})`, value: 'tasks' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />

      {/* Engagements */}
      {tab === 'engagements' && (
        <div className="space-y-4">
          {mockClientProjects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900">{project.name}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="mb-4 text-sm text-neutral-600">{project.description}</p>

                  <div className="mb-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Milestones
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {project.milestones.map((milestone) => (
                        <Badge
                          key={milestone.id}
                          dot={milestone.status !== 'completed'}
                          variant={
                            milestone.status === 'completed'
                              ? 'success'
                              : milestone.status === 'in-progress'
                              ? 'info'
                              : 'neutral'
                          }
                        >
                          {milestone.status === 'completed' && <Check size={11} className="flex-shrink-0" />}
                          {milestone.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-sm border border-blue-200 bg-blue-50/60 p-3">
                    <p className="mb-1 text-xs font-semibold text-neutral-600">Next Action</p>
                    <p className="text-sm text-neutral-900">{project.nextAction}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-900">Progress</p>
                      <p className="text-sm font-semibold text-primary">{project.progress}%</p>
                    </div>
                    <ProgressBar value={project.progress} showLabel={false} />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">Timeline</p>
                    <p className="text-sm text-neutral-900">
                      {formatDate(project.startDate)} &rarr; {formatDate(project.endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Team</p>
                    <div className="space-y-1">
                      {project.team.map((member, i) => (
                        <p key={i} className="flex items-center gap-1.5 text-xs text-neutral-700">
                          <User size={12} className="text-neutral-400" /> {member}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Campaigns */}
      {tab === 'campaigns' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockClientCampaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                    <Megaphone size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{campaign.name}</h4>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">{campaign.channel}</p>
                  </div>
                </div>
                <StatusBadge status={campaign.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
                <div>
                  <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    <TrendingUp size={12} /> Leads
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">{campaign.leadsGenerated}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    <Percent size={12} /> Conversion
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {campaign.conversionRate ? `${campaign.conversionRate}%` : '—'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-neutral-400">Started {formatDate(campaign.startDate)}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Leads */}
      {tab === 'leads' && (
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {leadFilters.map((f) => (
              <button
                key={f}
                onClick={() => setLeadFilter(f)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors',
                  leadFilter === f
                    ? 'border-primary bg-primary-50 text-primary-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                      <Users size={15} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-medium text-neutral-900">{lead.name}</h4>
                      <p className="text-xs text-neutral-500">
                        {lead.company ? `${lead.company} · ` : ''}
                        {lead.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-4">
                    {lead.value && (
                      <p className="hidden text-sm font-medium text-neutral-900 sm:block">
                        {formatCurrency(lead.value)}
                      </p>
                    )}
                    <StatusBadge status={lead.status} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <EmptyState icon={<Users />} title="No leads here" description="No leads match this filter yet." />
          )}
        </div>
      )}

      {/* Tasks */}
      {tab === 'tasks' && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => advanceTask(task.id)}
                    disabled={task.status === 'completed'}
                    aria-label="Advance task status"
                    className="flex-shrink-0 text-neutral-400 transition-colors hover:text-primary disabled:cursor-default disabled:text-emerald-500"
                  >
                    {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                  <div className="min-w-0">
                    <h4
                      className={cn(
                        'truncate font-medium text-neutral-900',
                        task.status === 'completed' && 'text-neutral-400 line-through'
                      )}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {task.relatedTo ? `${task.relatedTo} · ` : ''}Due {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            </Card>
          ))}

          {tasks.length === 0 && (
            <EmptyState icon={<CheckCircle2 />} title="No tasks" description="You're all caught up." />
          )}
        </div>
      )}
    </ClientLayout>
  );
}
