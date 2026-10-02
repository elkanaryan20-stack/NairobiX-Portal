'use client';

import { useState } from 'react';
import { FolderKanban, ListChecks } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { Input, ProgressBar, Tabs, EmptyState } from '@/components/ui/Form';
import { formatDate } from '@/lib/utils';
import type { StaffTaskRow } from '@/lib/portal-data/staff';
import type { Project } from '@/lib/types';

function statusKey(value?: string) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : 'pending';
}

export function StaffDeliveryView({
  engagements,
  tasks,
}: {
  engagements: (Project & { accountName?: string })[];
  tasks: StaffTaskRow[];
}) {
  const [activeTab, setActiveTab] = useState('engagements');
  const [searchTerm, setSearchTerm] = useState('');

  const term = searchTerm.toLowerCase();
  const filteredEngagements = engagements.filter(
    (p) => p.name.toLowerCase().includes(term) || (p.accountName ?? '').toLowerCase().includes(term)
  );
  const openTasks = tasks.filter((t) => statusKey(t.status) !== 'completed');

  return (
    <PortalLayout pageTitle="Delivery" pageSubtitle="Track client engagements and the tasks that move them forward">
      <Tabs
        tabs={[
          { label: 'Engagements', value: 'engagements' },
          { label: `Tasks (${openTasks.length} open)`, value: 'tasks' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'engagements' && (
        <>
          <div className="mb-5">
            <Input placeholder="Search engagements or clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="space-y-3">
            {filteredEngagements.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr_auto_auto]">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-fg">{project.name}</h3>
                    <p className="text-sm text-fg-tertiary">{project.accountName ?? '—'}</p>
                  </div>
                  <div>
                    {project.progress !== undefined ? (
                      <>
                        <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Progress</p>
                        <ProgressBar value={project.progress} size="sm" />
                      </>
                    ) : (
                      <>
                        <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Owner</p>
                        <p className="text-sm text-fg">{project.team[0] ?? '—'}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Status</p>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Target End</p>
                    <p className="text-sm font-medium text-fg">{project.endDate ? formatDate(project.endDate) : '—'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filteredEngagements.length === 0 && (
            <EmptyState icon={<FolderKanban />} title="No engagements found" description={searchTerm ? 'Try a different search term.' : 'Engagements recorded in the CRM appear here.'} />
          )}
        </>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-2.5">
          {tasks
            .slice()
            .sort((a, b) => (statusKey(a.status) === 'completed' ? 1 : 0) - (statusKey(b.status) === 'completed' ? 1 : 0))
            .map((task) => (
              <Card key={task.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h4 className="truncate font-medium text-fg">{task.title}</h4>
                  <p className="text-sm text-fg-tertiary">
                    {[task.relatedTo, task.dueDate ? `Due ${formatDate(task.dueDate)}` : undefined].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <StatusBadge status={statusKey(task.status)} />
              </Card>
            ))}
          {tasks.length === 0 && (
            <EmptyState icon={<ListChecks />} title="No tasks" description="CRM tasks appear here." />
          )}
        </div>
      )}
    </PortalLayout>
  );
}
