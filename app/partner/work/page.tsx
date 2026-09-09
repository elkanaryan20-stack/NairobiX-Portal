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
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, StatusBadge, PriorityBadge, Button } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import {
  mockPartnerProfile,
  mockPartnerProjectAssignments,
  mockPartnerTaskAssignments,
  mockConsultationSessions,
  mockDeliverables,
} from '@/lib/mock-data';
import { formatDate, cn } from '@/lib/utils';
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
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Delivery Journey
      </h3>
      <p className="mb-5 text-sm text-neutral-500">
        How a referral becomes delivered client work.
      </p>
      <div className="flex items-center overflow-x-auto pb-1">
        {DELIVERY_STAGES.map((stage, i) => (
          <div key={stage.id} className="flex flex-shrink-0 items-center">
            <div className="flex flex-col items-center gap-1.5">
              {i < activeIndex ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : i === activeIndex ? (
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary-100 ring-2 ring-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              ) : (
                <Circle size={18} className="text-neutral-300" />
              )}
              <span
                className={cn(
                  'whitespace-nowrap text-[11px] font-medium',
                  i <= activeIndex ? 'text-neutral-700' : 'text-neutral-400'
                )}
              >
                {stage.label}
              </span>
            </div>
            {i < DELIVERY_STAGES.length - 1 && (
              <div className={cn('mx-1.5 h-px w-8', i < activeIndex ? 'bg-emerald-300' : 'bg-neutral-200')} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function PartnerWork() {
  const { capabilities } = mockPartnerProfile;

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
  const [tasks, setTasks] = useState<PartnerTaskAssignment[]>(mockPartnerTaskAssignments);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables);

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
      <PartnerLayout pageTitle="Work" pageSubtitle="Projects, tasks and delivery">
        <DeliveryJourney />
        <EmptyState
          icon={<Briefcase />}
          title="No active work capabilities yet"
          description="Your partner profile isn't currently approved for project, task, consultation or deliverable participation. Reach out to your NairobiX contact if this should change."
        />
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout pageTitle="Work" pageSubtitle="Projects, tasks and delivery you're part of">
      <DeliveryJourney />

      <Tabs tabs={availableTabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'projects' && (
        <div className="space-y-3">
          {mockPartnerProjectAssignments.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-neutral-900">{p.projectName}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                    <Building2 size={13} /> {p.clientName}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
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
                  <h4 className="font-medium text-neutral-900">{t.title}</h4>
                  <p className="mt-1 text-xs text-neutral-500">
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
          {mockConsultationSessions.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-neutral-900">{c.topic}</h4>
                  {c.clientName && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                      <Building2 size={13} /> {c.clientName}
                    </p>
                  )}
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                    <CalendarDays size={13} /> {formatDate(c.scheduledDate)}
                  </p>
                  {c.notes && <p className="mt-2 text-sm text-neutral-600">{c.notes}</p>}
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
                  <h4 className="flex items-center gap-2 font-semibold text-neutral-900">
                    <FileText size={15} className="flex-shrink-0 text-neutral-400" />
                    {d.title}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500">
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
    </PartnerLayout>
  );
}
