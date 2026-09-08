'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Button, StatusBadge } from '@/components/ui/Card';
import { Input, ProgressBar, EmptyState } from '@/components/ui/Form';
import { FolderKanban, Plus } from 'lucide-react';
import { useState } from 'react';

export default function StaffProjects() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockProjects = [
    {
      id: 'proj1',
      name: 'E-commerce Platform Setup',
      client: 'TechVision Ltd',
      status: 'active' as const,
      progress: 65,
      dueDate: '2024-04-30',
    },
    {
      id: 'proj2',
      name: 'Digital Marketing Campaign',
      client: 'RetailMax Solutions',
      status: 'active' as const,
      progress: 45,
      dueDate: '2024-03-15',
    },
    {
      id: 'proj3',
      name: 'Data Analytics Implementation',
      client: 'HealthTech Kenya',
      status: 'planning' as const,
      progress: 20,
      dueDate: '2024-05-30',
    },
  ];

  return (
    <StaffLayout
      pageTitle="Projects"
      pageSubtitle="Monitor and manage all active client projects"
      headerActions={
        <Button variant="primary" icon={<Plus size={16} />}>
          New Project
        </Button>
      }
    >
      <div className="mb-6">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {mockProjects
          .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((project) => (
          <Card key={project.id} hover className="p-6">
            <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr_auto_auto]">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-neutral-900">{project.name}</h3>
                <p className="text-sm text-neutral-500">{project.client}</p>
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
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Due Date</p>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockProjects.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
        <EmptyState icon={<FolderKanban />} title="No projects found" description="Try a different search term." />
      )}
    </StaffLayout>
  );
}
