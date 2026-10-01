'use client';

import { useState } from 'react';
import {
  BookOpen,
  Percent,
  FileStack,
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  Trophy,
  Megaphone,
  CalendarDays,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { formatDate } from '@/lib/utils';
import type { ParticipantInsight, ParticipantUpdate } from '@/lib/portal-data/demo-content';
import type { Benefit, Document } from '@/lib/types';

const typeIcon: Record<string, React.ReactNode> = {
  pdf: <FileText />,
  doc: <FileText />,
  docx: <FileText />,
  xls: <FileSpreadsheet />,
  other: <FileIcon />,
};

const updateIcons: Record<ParticipantUpdate['type'], React.ReactNode> = {
  achievement: <Trophy size={18} />,
  announcement: <Megaphone size={18} />,
  event: <CalendarDays size={18} />,
  update: <BookOpen size={18} />,
};

const insightIcons: Record<ParticipantInsight['icon'], React.ReactNode> = {
  target: <Target size={20} />,
  trending: <TrendingUp size={20} />,
  wallet: <Wallet size={20} />,
};

export function ParticipantResourcesView({
  documents,
  benefits,
  updates,
  insights,
  demoContent,
}: {
  /** Signature documents linked to the Participant's Contact. */
  documents: Document[];
  benefits: Benefit[];
  updates: ParticipantUpdate[];
  insights: ParticipantInsight[];
  demoContent: boolean;
}) {
  const [activeTab, setActiveTab] = useState('documents');
  const [docFilter, setDocFilter] = useState('all');

  const playbooks = benefits.filter((b) => b.category === 'playbook');
  const discounts = benefits.filter((b) => b.category === 'discount');

  const docCategories = ['all', 'agreements', 'financial', 'resources'];
  const filteredDocs =
    docFilter === 'all' ? documents : documents.filter((d) => d.category === docFilter);

  return (
    <PortalLayout pageTitle="Resources" pageSubtitle="Playbooks, documents, updates and insights in one place">
      <Tabs
        tabs={[
          { label: 'Documents', value: 'documents' },
          { label: 'Playbooks', value: 'playbooks' },
          { label: 'Updates', value: 'updates' },
          { label: 'Insights', value: 'insights' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'playbooks' && playbooks.length === 0 && discounts.length === 0 && (
        <NotYetAvailable
          title="Playbooks aren't available yet"
          description="Opportunity Network playbooks and guides will appear here once NairobiX publishes them to your Portal."
        />
      )}

      {activeTab === 'playbooks' && (playbooks.length > 0 || discounts.length > 0) && (
        <>
          <div className="mb-10">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              <BookOpen size={16} className="text-neutral-400" />
              Playbooks &amp; Guides
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {playbooks.map((benefit) => (
                <Card key={benefit.id} hover className="p-6">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                    <FileStack size={17} />
                  </div>
                  <h4 className="mb-1.5 font-semibold text-neutral-900">{benefit.name}</h4>
                  <p className="mb-4 text-sm text-neutral-600">{benefit.description}</p>
                  <Button variant="secondary" size="sm">
                    Open
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {discounts.length > 0 && (
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                <Percent size={16} className="text-neutral-400" />
                Commission Tiers
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {discounts.map((benefit) => (
                  <Card key={benefit.id} className="border-primary-200 bg-primary-50/40 p-6">
                    <h4 className="mb-1.5 font-semibold text-neutral-900">{benefit.name}</h4>
                    <p className="mb-3 text-sm text-neutral-600">{benefit.description}</p>
                    <Badge variant="primary">Active</Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'documents' && (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {docCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setDocFilter(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  docFilter === cat ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat === 'all' ? 'All Documents' : cat}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-500 [&>svg]:h-[18px] [&>svg]:w-[18px]">
                      {typeIcon[doc.type] || <FileIcon />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-medium text-neutral-900">{doc.name}</h4>
                        {doc.status === 'active' && <Badge variant="success">Active</Badge>}
                      </div>
                      <p className="text-xs text-neutral-500">
                        {doc.type.toUpperCase()} &middot; {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                  </div>
                  {demoContent && (
                    <div className="flex flex-shrink-0 gap-1">
                      <button className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900" title="View">
                        <Eye size={17} />
                      </button>
                      <button className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900" title="Download">
                        <Download size={17} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          {filteredDocs.length === 0 && (
            <EmptyState title="No documents found" description="Documents in this category will appear here." />
          )}
        </>
      )}

      {activeTab === 'updates' && updates.length === 0 && (
        <NotYetAvailable
          title="Updates aren't available yet"
          description="Announcements for Opportunity Network Participants will appear here once NairobiX publishes them."
        />
      )}

      {activeTab === 'updates' && updates.length > 0 && (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id} hover className="p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                  {updateIcons[update.type]}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{update.title}</h3>
                    <Badge variant={update.type === 'achievement' ? 'success' : update.type === 'announcement' ? 'info' : 'neutral'}>
                      {update.type}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-neutral-700">{update.content}</p>
                  <p className="text-xs text-neutral-500">{formatDate(update.date)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'insights' && insights.length === 0 && (
        <NotYetAvailable
          title="Insights aren't available yet"
          description="Guidance for Opportunity Network Participants will appear here once NairobiX publishes it."
        />
      )}

      {activeTab === 'insights' && insights.length > 0 && (
        <div className="space-y-6">
          {insights.map((insight) => (
            <Card key={insight.id} className="border-l-2 border-l-primary p-6">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                  {insightIcons[insight.icon]}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">{insight.title}</h3>
                  <p className="text-sm text-neutral-600">{insight.summary}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {insight.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
