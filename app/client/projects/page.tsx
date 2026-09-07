'use client';

import Link from 'next/link';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { ProgressBar, Tabs } from '@/components/ui/Form';
import { mockClientProjects } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function ClientProjects() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProjects =
    activeTab === 'all'
      ? mockClientProjects
      : mockClientProjects.filter((p) => p.status === activeTab);

  return (
    <ClientLayout
      pageTitle="Projects"
      pageSubtitle="Manage your active growth initiatives and implementations"
      headerActions={
        <Button variant="primary">+ New Project</Button>
      }
    >
      {/* Tabs */}
      <Tabs
        tabs={[
          { label: 'All Projects', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Planning', value: 'planning' },
          { label: 'Completed', value: 'completed' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Projects Grid */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/client/projects/${project.id}`}>
            <Card hover className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Project Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>

                  <p className="text-neutral-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Milestones */}
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-neutral-600 mb-2">
                      Milestones
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {project.milestones.map((milestone) => (
                        <Badge
                          key={milestone.id}
                          variant={
                            milestone.status === 'completed'
                              ? 'success'
                              : milestone.status === 'in-progress'
                              ? 'primary'
                              : 'neutral'
                          }
                        >
                          {milestone.status === 'completed' && '✓ '}
                          {milestone.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-neutral-600 mb-1">
                      Next Action
                    </p>
                    <p className="text-sm text-neutral-900">{project.nextAction}</p>
                  </div>
                </div>

                {/* Progress & Dates */}
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold text-neutral-900">
                        Progress
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {project.progress}%
                      </p>
                    </div>
                    <ProgressBar value={project.progress} showLabel={false} />
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-xs text-neutral-600 font-medium mb-1">
                      Timeline
                    </p>
                    <div className="text-sm text-neutral-900">
                      <p>{formatDate(project.startDate)}</p>
                      <p className="text-neutral-500">→</p>
                      <p>{formatDate(project.endDate)}</p>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <p className="text-xs text-neutral-600 font-medium mb-2">
                      Team
                    </p>
                    <div className="space-y-1">
                      {project.team.map((member, i) => (
                        <p key={i} className="text-xs text-neutral-700">
                          👤 {member}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-2 border-t border-neutral-200">
                    <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {project.recentActivity.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-600 font-medium mb-2">
                    Recent Activity
                  </p>
                  <div className="space-y-2">
                    {project.recentActivity.slice(0, 1).map((activity) => (
                      <p
                        key={activity.id}
                        className="text-sm text-neutral-700 flex gap-2"
                      >
                        <span className="text-neutral-400">📌</span>
                        <span>{activity.title}</span>
                        <span className="text-neutral-500">
                          on {formatDate(activity.timestamp)}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">No projects found in this category</p>
          <Button variant="primary">Start a New Project</Button>
        </div>
      )}
    </ClientLayout>
  );
}
