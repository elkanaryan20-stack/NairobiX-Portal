'use client';

import { useState } from 'react';
import { Check, FolderKanban } from 'lucide-react';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, StatusBadge, Button } from '@/components/ui/Card';
import { Input, ProgressBar, Tabs, EmptyState } from '@/components/ui/Form';
import { mockClientProfile, mockClientProjects } from '@/lib/mock-data';
import { Milestone } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface FlatTask extends Milestone {
  projectName: string;
}

export default function StaffDelivery() {
  const [activeTab, setActiveTab] = useState('engagements');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState(mockClientProjects);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockClientProfile.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tasks: FlatTask[] = projects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectName: p.name }))
  );

  const markMilestoneComplete = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              milestones: p.milestones.map((m) => (m.id === milestoneId ? { ...m, status: 'completed' } : m)),
            }
      )
    );
  };

  return (
    <StaffLayout pageTitle="Delivery" pageSubtitle="Track client engagements and the tasks that move them forward">
      <Tabs
        tabs={[
          { label: 'Engagements', value: 'engagements' },
          { label: `Tasks (${tasks.filter((t) => t.status !== 'completed').length} open)`, value: 'tasks' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'engagements' && (
        <>
          <div className="mb-5">
            <Input placeholder="Search engagements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr_auto_auto]">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-neutral-900">{project.name}</h3>
                    <p className="text-sm text-neutral-500">{mockClientProfile.businessName}</p>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">Progress</p>
                    <ProgressBar value={project.progress} size="sm" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Status</p>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Target End</p>
                    <p className="text-sm font-medium text-neutral-900">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <EmptyState icon={<FolderKanban />} title="No engagements found" description="Try a different search term." />
          )}
        </>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-2.5">
          {tasks
            .slice()
            .sort((a, b) => (a.status === 'completed' ? 1 : 0) - (b.status === 'completed' ? 1 : 0))
            .map((task) => (
              <Card key={task.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h4 className="truncate font-medium text-neutral-900">{task.name}</h4>
                  <p className="text-sm text-neutral-500">
                    {task.projectName} &middot; Due {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <StatusBadge status={task.status} />
                  {task.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Check size={14} />}
                      onClick={() => markMilestoneComplete(projects.find((p) => p.name === task.projectName)!.id, task.id)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}
    </StaffLayout>
  );
}
