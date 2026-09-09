'use client';

import { useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  BookOpen,
  Target,
  Ticket,
  Zap,
} from 'lucide-react';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { mockClientDocuments, mockClientBenefits } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const typeIcon: Record<string, React.ReactNode> = {
  pdf: <FileText />,
  doc: <FileText />,
  docx: <FileText />,
  xls: <FileSpreadsheet />,
  other: <FileIcon />,
};

const docCategories = ['all', 'strategy', 'reports', 'agreements', 'financial', 'resources'];
const docCategoryLabels: Record<string, string> = {
  all: 'All Documents',
  strategy: 'Strategy',
  reports: 'Reports',
  agreements: 'Agreements',
  financial: 'Financial',
  resources: 'Resources',
};

export default function ClientResources() {
  const [tab, setTab] = useState('documents');
  const [docCategory, setDocCategory] = useState('all');

  const filteredDocs =
    docCategory === 'all' ? mockClientDocuments : mockClientDocuments.filter((d) => d.category === docCategory);

  const playbooks = mockClientBenefits.filter((b) => b.category === 'playbook');
  const discounts = mockClientBenefits.filter((b) => b.category === 'discount');
  const strategy = mockClientBenefits.filter((b) => b.category === 'strategy');
  const earlyAccess = mockClientBenefits.filter((b) => b.category === 'early-access');

  return (
    <ClientLayout pageTitle="Resources" pageSubtitle="Your document library and NairobiX partnership benefits">
      <Tabs
        tabs={[
          { label: 'Documents', value: 'documents' },
          { label: 'Benefits', value: 'benefits' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />

      {tab === 'documents' && (
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {docCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setDocCategory(cat)}
                className={
                  docCategory === cat
                    ? 'rounded-full border border-primary bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700'
                    : 'rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-300'
                }
              >
                {docCategoryLabels[cat] || cat}
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

                  <div className="flex flex-shrink-0 gap-1">
                    <button className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900" title="View">
                      <Eye size={17} />
                    </button>
                    <button className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900" title="Download">
                      <Download size={17} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <EmptyState title="No documents found" description="Documents in this category will appear here." />
          )}
        </div>
      )}

      {tab === 'benefits' && (
        <div>
          {playbooks.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                <BookOpen size={15} /> Exclusive Playbooks
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {playbooks.map((benefit) => (
                  <Card key={benefit.id} hover className="p-6">
                    <h4 className="mb-2 text-lg font-semibold text-neutral-900">{benefit.name}</h4>
                    <p className="mb-4 text-neutral-600">{benefit.description}</p>
                    <Button variant="primary" size="sm">
                      Access Playbook
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {strategy.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                <Target size={15} /> Strategy Benefits
              </h3>
              <div className="space-y-4">
                {strategy.map((benefit) => (
                  <Card key={benefit.id} hover className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="mb-2 text-lg font-semibold text-neutral-900">{benefit.name}</h4>
                        <p className="mb-4 text-neutral-600">{benefit.description}</p>
                      </div>
                      <Button variant="primary" size="sm" className="flex-shrink-0" onClick={() => (window.location.href = '/client/support')}>
                        Schedule
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {discounts.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                <Ticket size={15} /> Exclusive Discounts
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {discounts.map((benefit) => (
                  <Card key={benefit.id} className="border-emerald-200 bg-emerald-50/60 p-6">
                    <h4 className="mb-1 text-lg font-semibold text-neutral-900">{benefit.name}</h4>
                    <p className="mb-3 text-sm text-neutral-600">{benefit.description}</p>
                    {benefit.value && <Badge variant="success">{benefit.value}</Badge>}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {earlyAccess.length > 0 && (
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                <Zap size={15} /> Early Access
              </h3>
              <Card className="border-indigo-200 bg-indigo-50/60 p-6">
                {earlyAccess.map((benefit) => (
                  <div key={benefit.id}>
                    <h4 className="mb-2 text-lg font-semibold text-neutral-900">{benefit.name}</h4>
                    <p className="mb-4 text-neutral-600">{benefit.description}</p>
                    <Button variant="primary">Get Early Access</Button>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
