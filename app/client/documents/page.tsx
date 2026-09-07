'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Form';
import { mockClientDocuments } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Download, Eye } from 'lucide-react';

export default function ClientDocuments() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'strategy', 'reports', 'agreements', 'financial', 'resources'];
  const filteredDocs =
    activeTab === 'all'
      ? mockClientDocuments
      : mockClientDocuments.filter((d) => d.category === activeTab);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: 'All Documents',
      strategy: 'Strategy',
      reports: 'Reports',
      agreements: 'Agreements',
      financial: 'Financial',
      resources: 'Resources',
    };
    return labels[cat] || cat;
  };

  return (
    <ClientLayout
      pageTitle="Documents"
      pageSubtitle="Access your private document library"
    >
      {/* Tabs */}
      <Tabs
        tabs={categories.map((cat) => ({
          label: getCategoryLabel(cat),
          value: cat,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-2xl">
                    {doc.type === 'pdf'
                      ? '📄'
                      : doc.type === 'docx' || doc.type === 'doc'
                      ? '📝'
                      : doc.type === 'xls'
                      ? '📊'
                      : '📎'}
                  </div>
                  <h4 className="font-semibold text-neutral-900 truncate">
                    {doc.name}
                  </h4>
                  {doc.status === 'active' && (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-600">
                  {doc.type.toUpperCase()} • {formatDate(doc.uploadDate)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="View">
                  <Eye size={18} />
                </button>
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="Download">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No documents found
          </h3>
          <p className="text-neutral-600">
            Documents in this category will appear here
          </p>
        </Card>
      )}
    </ClientLayout>
  );
}
