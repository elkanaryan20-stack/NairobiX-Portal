'use client';

import { useState } from 'react';
import { Wallet, TrendingUp, HeartHandshake, CheckCircle2, FileText, Megaphone, FolderKanban, Receipt } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { Input, MetricCard, Tabs, EmptyState } from '@/components/ui/Form';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { StaffCampaignRow, StaffDocumentRow, StaffReportMetrics } from '@/lib/portal-data/staff';

function statusKey(value?: string) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : 'pending';
}

export function StaffReportsView({
  metrics,
  documents,
  campaigns,
}: {
  metrics: StaffReportMetrics | null;
  documents: StaffDocumentRow[];
  campaigns: StaffCampaignRow[];
}) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <PortalLayout pageTitle="Reports" pageSubtitle="Business analytics, signed documents and marketing campaigns">
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

      {activeTab === 'analytics' &&
        (metrics ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard label="Closed Won Value" value={formatCurrency(metrics.closedWonValue, metrics.currency)} subtitle={`${metrics.closedWonDeals} deals`} icon={<TrendingUp />} />
            <MetricCard label="Invoices Paid" value={formatCurrency(metrics.paidInvoices, metrics.currency)} icon={<Wallet />} />
            <MetricCard label="Invoices Outstanding" value={formatCurrency(metrics.outstandingInvoices, metrics.currency)} icon={<Receipt />} />
            <MetricCard label="Active Engagements" value={metrics.activeEngagements} icon={<FolderKanban />} />
            <MetricCard label="Active Participants" value={metrics.activeParticipants} icon={<HeartHandshake />} />
            <MetricCard label="Closed Won Deals" value={metrics.closedWonDeals} icon={<CheckCircle2 />} />
          </div>
        ) : (
          <NotYetAvailable title="Analytics aren't available" description="Analytics are calculated from NairobiX CRM data." />
        ))}

      {activeTab === 'documents' && (
        <>
          <div className="mb-6">
            <Input placeholder="Search documents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-white/[0.05] text-fg-tertiary">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-fg">{doc.name}</p>
                      <p className="text-xs text-fg-tertiary">
                        {[doc.relatedTo, doc.sent ? formatDate(doc.sent) : undefined].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                  </div>
                  {doc.status && <StatusBadge status={statusKey(doc.status)} />}
                </div>
              </Card>
            ))}
          </div>
          {filteredDocuments.length === 0 && (
            <EmptyState icon={<FileText />} title="No documents found" description={searchTerm ? 'Try a different search term.' : 'Zoho Sign documents recorded in the CRM appear here.'} />
          )}
        </>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-2.5">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <h4 className="truncate font-medium text-fg">{campaign.name}</h4>
                <p className="text-sm text-fg-tertiary">
                  {[campaign.type, campaign.startDate ? `Starts ${formatDate(campaign.startDate)}` : undefined].filter(Boolean).join(' · ') || '—'}
                </p>
              </div>
              {campaign.status && <StatusBadge status={statusKey(campaign.status)} />}
            </Card>
          ))}
          {campaigns.length === 0 && (
            <EmptyState icon={<Megaphone />} title="No campaigns yet" description="Marketing campaigns recorded in the CRM appear here." />
          )}
        </div>
      )}
    </PortalLayout>
  );
}
