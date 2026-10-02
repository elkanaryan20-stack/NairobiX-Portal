'use client';

import { useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Building2,
  CalendarDays,
  FileText,
  Send,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, StatusBadge, PriorityBadge, Button } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { formatDate, cn } from '@/lib/utils';
import type { ParticipantDemoModules } from '@/lib/portal-data/participant';
import type { DeliveryStage, PartnerTaskAssignment, Deliverable } from '@/lib/types';

const DELIVERY_STAGES: { id: DeliveryStage; label: string }[] = [
  { id: 'referral', label: 'Referral' },
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'client', label: 'Client' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'consultation', label: 'Consultation' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'completed', label: 'Completed' },
];

function DeliveryJourney() {
  // Illustrative — shows how a referral becomes delivered work. Not bound to
  // one specific record; it's here so partners understand the bigger picture.
  const activeIndex = 4; // "Engagement" — representative of this partner's current work

  return (
    <Card className="mb-8 p-6">
      <h3 className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
        Delivery Journey
      </h3>
      <p className="mb-5 text-sm text-fg-tertiary">
        How a referral becomes delivered client work.
      </p>
      <div className="flex items-center overflow-x-auto pb-1">
        {DELIVERY_STAGES.map((stage, i) => (
          <div key={stage.id} className="flex flex-shrink-0 items-center">
            <div className="flex flex-col items-center gap-1.5">
              {i < activeIndex ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : i === activeIndex ? (
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              ) : (
                <Circle size={18} className="text-white/25" />
              )}
              <span
                className={cn(
                  'whitespace-nowrap text-[11px] font-medium',
                  i <= activeIndex ? 'text-fg-secondary' : 'text-fg-tertiary'
                )}
              >
                {stage.label}
              </span>
            </div>
            {i < DELIVERY_STAGES.length - 1 && (
              <div className={cn('mx-1.5 h-px w-8', i < activeIndex ? 'bg-emerald-300' : 'bg-white/10')} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ParticipantWorkView({ demo }: { demo: ParticipantDemoModules }) {
  const { capabilities } = demo.profile;

  const availableTabs = useMemo(
    () =>
      [
        capabilities.projects && { label: 'Projects', value: 'projects' },
        capabilities.tasks && { label: 'Tasks', value: 'tasks' },
        capabilities.consultations && { label: 'Consultations', value: 'consultations' },
        capabilities.deliverables && { label: 'Deliverables', value: 'deliverables' },
      ].filter(Boolean) as { label: string; value: string }[],
    [capabilities]
  );

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.value ?? '');
  const [tasks, setTasks] = useState<PartnerTaskAssignment[]>(demo.taskAssignments);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(demo.deliverables);

  const cycleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = t.status === 'pending' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'pending';
        return { ...t, status: next };
      })
    );
  };

  const submitDeliverable = (id: string) => {
    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'submitted', submittedDate: new Date().toISOString().slice(0, 10) } : d
      )
    );
  };

  if (availableTabs.length === 0) {
    return (
      <PortalLayout pageTitle="Work" pageSubtitle="Projects, tasks and delivery">
        <DeliveryJourney />
        <EmptyState
          icon={<Briefcase />}
          title="No active work capabilities yet"
          description="Your partner profile isn't currently approved for project, task, consultation or deliverable participation. Reach out to your NairobiX contact if this should change."
        />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout pageTitle="Work" pageSubtitle="Projects, tasks and delivery you're part of">
      <DeliveryJourney />

      <Tabs tabs={availableTabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'projects' && (
        <div className="space-y-3">
          {demo.projectAssignments.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-fg">{p.projectName}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-tertiary">
                    <Building2 size={13} /> {p.clientName}
                  </p>
                  <p className="mt-1 text-xs text-fg-tertiary">
                    {p.role} &middot; since {formatDate(p.startDate)}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-fg">{t.title}</h4>
                  <p className="mt-1 text-xs text-fg-tertiary">
                    {t.projectName ? `${t.projectName} · ` : ''}Due {formatDate(t.dueDate)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <PriorityBadge priority={t.priority} />
                  <button
                    onClick={() => cycleTaskStatus(t.id)}
                    className="rounded-sm"
                    title="Click to advance status"
                  >
                    <StatusBadge status={t.status} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'consultations' && (
        <div className="space-y-3">
          {demo.consultations.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-fg">{c.topic}</h4>
                  {c.clientName && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-tertiary">
                      <Building2 size={13} /> {c.clientName}
                    </p>
                  )}
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-fg-tertiary">
                    <CalendarDays size={13} /> {formatDate(c.scheduledDate)}
                  </p>
                  {c.notes && <p className="mt-2 text-sm text-fg-secondary">{c.notes}</p>}
                </div>
                <StatusBadge status={c.status} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'deliverables' && (
        <div className="space-y-3">
          {deliverables.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="flex items-center gap-2 font-semibold text-fg">
                    <FileText size={15} className="flex-shrink-0 text-fg-tertiary" />
                    {d.title}
                  </h4>
                  <p className="mt-1 text-xs text-fg-tertiary">
                    {d.projectName ? `${d.projectName} · ` : ''}Due {formatDate(d.dueDate)}
                    {d.submittedDate ? ` · Submitted ${formatDate(d.submittedDate)}` : ''}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <StatusBadge status={d.status} />
                  {d.status === 'in-progress' && (
                    <Button variant="secondary" size="sm" icon={<Send size={14} />} onClick={() => submitDeliverable(d.id)}>
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
