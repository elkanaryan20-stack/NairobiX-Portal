'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ClipboardList } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { Tabs, EmptyState } from '@/components/ui/Form';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { formatDate } from '@/lib/utils';
import type { StaffApplicationRow } from '@/lib/portal-data/staff';

function statusKey(value?: string) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : 'submitted';
}

/**
 * CRM pipeline: Opportunity Network Applications, read-only. Applications are
 * reviewed and advanced in Zoho CRM; referral attribution has no CRM source yet.
 */
export function CrmPipelineView({ applications }: { applications: StaffApplicationRow[] }) {
  const [activeTab, setActiveTab] = useState('applications');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <PortalLayout pageTitle="Pipeline" pageSubtitle="Opportunity Network applications and referrals">
      <Tabs
        tabs={[
          { label: `Applications (${applications.length})`, value: 'applications' },
          { label: 'Referrals', value: 'referrals' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'applications' && (
        <div className="space-y-3">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <Card key={app.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-sm font-semibold text-fg-secondary">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-fg">{app.name}</h3>
                      <p className="text-sm text-fg-tertiary">
                        {[app.applicantType, app.applied ? `Applied ${formatDate(app.applied)}` : undefined].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {app.status && <StatusBadge status={statusKey(app.status)} />}
                    {isExpanded ? <ChevronDown size={18} className="text-fg-tertiary" /> : <ChevronRight size={18} className="text-fg-tertiary" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-1 gap-4 border-t border-line p-5 pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Contact</p>
                      <p className="mt-1 text-fg">{app.email ?? '—'}</p>
                      {app.applicationNumber && <p className="font-mono text-xs text-fg-tertiary">{app.applicationNumber}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Contribution areas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {app.contributionAreas.length === 0 && <span className="text-fg-tertiary">—</span>}
                        {app.contributionAreas.map((area) => (
                          <span key={area} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary-400">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-fg-tertiary sm:col-span-3">Review and update this application in Zoho CRM.</p>
                  </div>
                )}
              </Card>
            );
          })}
          {applications.length === 0 && (
            <EmptyState icon={<ClipboardList />} title="No applications" description="Opportunity Network applications recorded in the CRM appear here." />
          )}
        </div>
      )}

      {activeTab === 'referrals' && (
        <NotYetAvailable
          title="Referrals aren't available yet"
          description="Referral attribution to Opportunity Network Participants isn't recorded in the CRM yet, so referrals can't be shown here."
        />
      )}
    </PortalLayout>
  );
}
