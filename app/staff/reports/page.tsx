'use client';

import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  Star,
  Share2,
  BarChart3,
  Target,
  Folder,
  FileText,
  Download,
  Eye,
  Megaphone,
} from 'lucide-react';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card } from '@/components/ui/Card';
import { Input, MetricCard, Tabs, EmptyState } from '@/components/ui/Form';
import { getCampaigns } from '@/lib/crm/adapter';

const analyticsMetrics = [
  { label: 'Total Revenue', value: 'KES 2.4M', icon: <Wallet /> },
  { label: 'Client Growth', value: '+23%', icon: <TrendingUp /> },
  { label: 'Partnership Value', value: 'KES 18.5M', icon: <HeartHandshake /> },
  { label: 'Project Success Rate', value: '94%', icon: <CheckCircle2 /> },
  { label: 'Avg. Client Satisfaction', value: '4.8/5', icon: <Star /> },
  { label: 'Referral Conversion', value: '42%', icon: <Share2 /> },
];

const mockDocuments = [
  { id: 'doc1', name: 'Partnership Agreements', type: 'folder' as const, docs: 12 },
  { id: 'doc2', name: 'Client Proposals', type: 'folder' as const, docs: 28 },
  { id: 'doc3', name: 'Financial Reports', type: 'folder' as const, docs: 8 },
  { id: 'doc4', name: 'Q1 2024 Performance Report.pdf', type: 'file' as const, date: '2024-03-10', size: '2.4 MB' },
  { id: 'doc5', name: 'Partner Commission Schedule.xlsx', type: 'file' as const, date: '2024-03-08', size: '156 KB' },
];

export default function StaffReports() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const campaigns = getCampaigns();

  const filteredDocuments = mockDocuments.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <StaffLayout pageTitle="Reports" pageSubtitle="Business analytics, shared documents and marketing campaigns">
      <Tabs
        tabs={[
          { label: 'Analytics', value: 'analytics' },
          { label: 'Documents', value: 'documents' },
          { label: 'Campaigns', value: 'campaigns' },
        ]}
        activeTab={activeTab}
        onTabChange={(t) => {
          setActiveTab(t);
          setSearchTerm('');
        }}
      />

      {activeTab === 'analytics' && (
        <>
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {analyticsMetrics.map((metric, idx) => (
              <MetricCard key={idx} label={metric.label} value={metric.value} icon={metric.icon} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="flex min-h-72 items-center justify-center border-dashed p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  <BarChart3 size={20} />
                </div>
                <p className="font-medium text-neutral-700">Revenue Trend</p>
                <p className="mt-1 text-sm text-neutral-500">Chart visualization coming soon</p>
              </div>
            </Card>

            <Card className="flex min-h-72 items-center justify-center border-dashed p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  <Target size={20} />
                </div>
                <p className="font-medium text-neutral-700">Performance Overview</p>
                <p className="mt-1 text-sm text-neutral-500">Visual dashboard coming soon</p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'documents' && (
        <>
          <div className="mb-6">
            <Input placeholder="Search documents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} hover className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-3">
                    <div
                      className={
                        doc.type === 'folder'
                          ? 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-primary-50 text-primary-600'
                          : 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-500'
                      }
                    >
                      {doc.type === 'folder' ? <Folder size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                      {doc.type === 'folder' && <p className="text-xs text-neutral-500">{doc.docs} files</p>}
                      {doc.type === 'file' && (
                        <p className="text-xs text-neutral-500">
                          {doc.date} &middot; {doc.size}
                        </p>
                      )}
                    </div>
                  </div>

                  {doc.type === 'file' && (
                    <div className="flex gap-1">
                      <button className="rounded-sm p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Preview document">
                        <Eye size={16} />
                      </button>
                      <button className="rounded-sm p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Download document">
                        <Download size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          {filteredDocuments.length === 0 && (
            <EmptyState icon={<FileText />} title="No documents found" description="Try a different search term." />
          )}
        </>
      )}

      {activeTab === 'campaigns' && campaigns.length === 0 && (
        <EmptyState
          icon={<Megaphone />}
          title="No campaigns yet"
          description="This view is ready for when NairobiX CRM campaign data syncs in — no marketing programs are tracked in the portal yet."
        />
      )}
    </StaffLayout>
  );
}
