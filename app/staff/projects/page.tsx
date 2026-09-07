'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import { Plus } from 'lucide-react';
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

      <div className="space-y-4">
        {mockProjects.map((project) => (
          <Card key={project.id} hover className="p-6">
            <div className="grid md:grid-cols-4 gap-6 items-start">
              <div>
                <h3 className="font-bold text-neutral-900">{project.name}</h3>
                <p className="text-sm text-neutral-600">{project.client}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Progress</p>
                <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {project.progress}%
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Status</p>
                <Badge
                  variant={project.status === 'active' ? 'success' : 'primary'}
                  className="mt-1"
                >
                  {project.status}
                </Badge>
              </div>

              <div className="text-right">
                <p className="text-xs text-neutral-600 font-medium">Due Date</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
