'use client';

import { useState } from 'react';
import {
  Briefcase,
  Check,
  User,
  Megaphone,
  Package,
  Users,
  Circle,
  CheckCircle2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Badge, StatusBadge, PriorityBadge } from '@/components/ui/Card';
import { ProgressBar, Tabs, EmptyState } from '@/components/ui/Form';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { SectionError } from '@/components/portal/States';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import type { ClientServiceView, Loaded } from '@/lib/portal-data/client';
import type { ClientCampaign, ClientLead, ClientTask, Project } from '@/lib/types';

type ProjectRow = Project & { stageLabel?: string; typeLabel?: string };

const statusKey = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

const leadFilters = ['all', 'new', 'contacted', 'qualified', 'converted', 'lost'] as const;
const taskOrder: ClientTask['status'][] = ['pending', 'in-progress', 'completed'];

export function ClientWorkView({
  projects,
  services,
  campaigns,
  leads,
  initialTasks,
}: {
  /** The Account's CRM Engagements. */
  projects: ProjectRow[];
  /** The Account's Sales Orders (confirmed NairobiX services). */
  services: Loaded<ClientServiceView[]>;
  campaigns: ClientCampaign[];
  leads: ClientLead[];
  initialTasks: ClientTask[];
}) {
  const [tab, setTab] = useState('engagements');
  const [leadFilter, setLeadFilter] = useState<(typeof leadFilters)[number]>('all');
  const [tasks, setTasks] = useState<ClientTask[]>(initialTasks);

  const filteredLeads =
    leadFilter === 'all' ? leads : leads.filter((l) => l.status === leadFilter);

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
    <PortalLayout pageTitle="Work" pageSubtitle="Your engagements and the services NairobiX delivers for you">
      <Tabs
        tabs={[
          { label: `Engagements (${projects.length})`, value: 'engagements' },
          { label: services.ok ? `Services (${services.data.length})` : 'Services', value: 'services' },
          // Campaigns, leads and tasks have no CRM source yet: their tabs appear only when data exists.
          ...(campaigns.length > 0 ? [{ label: `Campaigns (${campaigns.length})`, value: 'campaigns' }] : []),
          ...(leads.length > 0 ? [{ label: `Leads (${leads.length})`, value: 'leads' }] : []),
          ...(tasks.length > 0 ? [{ label: `Tasks (${tasks.filter((t) => t.status !== 'completed').length})`, value: 'tasks' }] : []),
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />

      {/* Services */}
      {tab === 'services' && !services.ok && <SectionError what="your services" compact={false} />}
      {tab === 'services' && services.ok && services.data.length === 0 && (
        <EmptyState
          icon={<Package />}
          title="No confirmed services yet"
          description="Once your NairobiX services are confirmed, they'll appear here with their scope and delivery details."
        />
      )}
      {tab === 'services' && services.ok && services.data.length > 0 && (
        <div className="space-y-4">
          {services.data.map((service) => (
            <Card key={service.id} className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-fg sm:text-lg">{service.name}</h3>
                  <p className="mt-0.5 text-xs text-fg-tertiary">
                    {[service.solutionFamily, service.deliveryType, service.number].filter(Boolean).join(' · ')}
                  </p>
                </div>
                {service.status && <StatusBadge status={statusKey(service.status)} />}
              </div>
              {service.summary && <p className="mt-3 text-sm text-fg-secondary">{service.summary}</p>}
              {service.scope && (
                <div className="mt-4 rounded-xl border border-line bg-surface-2 p-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">Included scope</p>
                  <p className="mt-1.5 whitespace-pre-line text-sm text-fg-secondary">{service.scope}</p>
                </div>
              )}
              {(service.pricingModel || service.paymentTerms) && (
                <p className="mt-3 text-xs text-fg-tertiary">
                  {[service.pricingModel, service.paymentTerms && `Payment: ${service.paymentTerms}`].filter(Boolean).join(' · ')}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Engagements */}
      {tab === 'engagements' && (
        <div className="space-y-4">
          {projects.length === 0 && (
            <EmptyState
              icon={<Briefcase />}
              title="No engagements yet"
              description="When NairobiX begins an engagement for you, it will appear here with its status, dates and team."
            />
          )}
          {projects.map((project) => (
            <Card key={project.id} className="p-5 sm:p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-fg sm:text-lg">{project.name}</h3>
                    <StatusBadge status={project.stageLabel ? statusKey(project.stageLabel) : project.status} />
                  </div>
                  {project.description && <p className="mb-4 text-sm text-fg-secondary">{project.description}</p>}

                  {project.milestones.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">
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
                  )}

                  {project.nextAction && (
                    <div className="rounded-sm border border-blue-500/20 bg-blue-500/[0.06] p-3">
                      <p className="mb-1 text-xs font-semibold text-fg-secondary">Next Action</p>
                      <p className="text-sm text-fg">{project.nextAction}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {project.progress !== undefined && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-fg">Progress</p>
                        <p className="text-sm font-semibold text-primary">{project.progress}%</p>
                      </div>
                      <ProgressBar value={project.progress} showLabel={false} />
                    </div>
                  )}

                  <div>
                    <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Timeline</p>
                    <p className="text-sm text-fg">
                      {!project.startDate && !project.endDate ? (
                        <span className="text-fg-tertiary">Not yet scheduled</span>
                      ) : (
                        <>
                          {project.startDate ? formatDate(project.startDate) : 'Start to be confirmed'} &rarr;{' '}
                          {project.endDate ? formatDate(project.endDate) : 'end to be confirmed'}
                        </>
                      )}
                    </p>
                  </div>

                  {project.team.length > 0 && (
                  <div>
                    <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Team</p>
                    <div className="space-y-1">
                      {project.team.map((member, i) => (
                        <p key={i} className="flex items-center gap-1.5 text-xs text-fg-secondary">
                          <User size={12} className="text-fg-tertiary" /> {member}
                        </p>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Campaigns */}
      {tab === 'campaigns' && campaigns.length === 0 && (
        <NotYetAvailable
          title="Campaigns aren't available yet"
          description="Marketing campaigns NairobiX runs for your business will appear here once they're connected to your Portal."
        />
      )}

      {tab === 'campaigns' && campaigns.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary">
                    <Megaphone size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-fg">{campaign.name}</h4>
                    <p className="text-xs uppercase tracking-wide text-fg-tertiary">{campaign.channel}</p>
                  </div>
                </div>
                <StatusBadge status={campaign.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
                <div>
                  <p className="flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">
                    <TrendingUp size={12} /> Leads
                  </p>
                  <p className="mt-1 text-lg font-semibold text-fg">{campaign.leadsGenerated}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">
                    <Percent size={12} /> Conversion
                  </p>
                  <p className="mt-1 text-lg font-semibold text-fg">
                    {campaign.conversionRate ? `${campaign.conversionRate}%` : '—'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-fg-tertiary">Started {formatDate(campaign.startDate)}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Leads */}
      {tab === 'leads' && leads.length === 0 && (
        <NotYetAvailable
          title="Leads aren't available yet"
          description="Leads generated for your business will appear here once they're connected to your Portal."
        />
      )}

      {tab === 'leads' && leads.length > 0 && (
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {leadFilters.map((f) => (
              <button
                key={f}
                onClick={() => setLeadFilter(f)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors',
                  leadFilter === f
                    ? 'border-primary bg-primary/10 text-primary-400'
                    : 'border-line text-fg-secondary hover:border-line-strong'
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
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary">
                      <Users size={15} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-medium text-fg">{lead.name}</h4>
                      <p className="text-xs text-fg-tertiary">
                        {lead.company ? `${lead.company} · ` : ''}
                        {lead.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-4">
                    {lead.value && (
                      <p className="hidden text-sm font-medium text-fg sm:block">
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
      {tab === 'tasks' && tasks.length === 0 && (
        <NotYetAvailable
          title="Tasks aren't available yet"
          description="Action items for your team will appear here once they're connected to your Portal."
        />
      )}

      {tab === 'tasks' && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => advanceTask(task.id)}
                    disabled={task.status === 'completed'}
                    aria-label="Advance task status"
                    className="flex-shrink-0 text-fg-tertiary transition-colors hover:text-primary disabled:cursor-default disabled:text-emerald-500"
                  >
                    {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                  <div className="min-w-0">
                    <h4
                      className={cn(
                        'truncate font-medium text-fg',
                        task.status === 'completed' && 'text-fg-tertiary line-through'
                      )}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-fg-tertiary">
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
    </PortalLayout>
  );
}
