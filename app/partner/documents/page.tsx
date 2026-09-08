'use client';

import { useState } from 'react';
import { Download, Eye, FileText, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { mockPartnerDocuments } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const typeIcon: Record<string, React.ReactNode> = {
  pdf: <FileText />,
  doc: <FileText />,
  docx: <FileText />,
  xls: <FileSpreadsheet />,
  other: <FileIcon />,
};

export default function PartnerDocuments() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'agreements', 'financial', 'resources'];
  const filteredDocs =
    activeTab === 'all'
      ? mockPartnerDocuments
      : mockPartnerDocuments.filter((d) => d.category === activeTab);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: 'All Documents',
      agreements: 'Agreements',
      financial: 'Financial',
      resources: 'Resources',
    };
    return labels[cat] || cat;
  };

  return (
    <PartnerLayout pageTitle="Documents" pageSubtitle="Your partnership agreements and financial records">
      <Tabs
        tabs={categories.map((cat) => ({ label: getCategoryLabel(cat), value: cat }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
    </PartnerLayout>
  );
}
