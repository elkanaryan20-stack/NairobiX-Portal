'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, StatusBadge } from '@/components/ui/Card';
import { Input, Tabs, EmptyState } from '@/components/ui/Form';
import { mockClientProfile, mockClientProjects, mockAllPartners } from '@/lib/mock-data';
import { PartnerCapabilities } from '@/lib/types';
import { getInitials, formatCurrency, formatDate, cn } from '@/lib/utils';

const CAPABILITY_LABELS: Record<keyof PartnerCapabilities, string> = {
  referrals: 'Referrals',
  opportunities: 'Opportunities',
  projects: 'Projects',
  tasks: 'Tasks',
  consultations: 'Consultations',
  deliverables: 'Deliverables',
  commissions: 'Commissions',
};

function CapabilityChips({ capabilities }: { capabilities: PartnerCapabilities }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(CAPABILITY_LABELS) as Array<keyof PartnerCapabilities>).map((key) => (
        <span
          key={key}
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-medium',
            capabilities[key] ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-400'
          )}
        >
          {CAPABILITY_LABELS[key]}
        </span>
      ))}
    </div>
  );
}

export default function StaffAccounts() {
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPartners = mockAllPartners.filter(
    (p) =>
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partnerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout pageTitle="Accounts" pageSubtitle="Every client and partner business NairobiX works with">
      <Tabs
        tabs={[
          { label: 'Clients', value: 'clients' },
          { label: `Partners (${mockAllPartners.length})`, value: 'partners' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchTerm('');
          setExpandedId(null);
        }}
      />

      {activeTab === 'clients' && (
        <div className="space-y-3">
          <Card className="overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === mockClientProfile.id ? null : mockClientProfile.id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                  {getInitials(mockClientProfile.businessName)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-neutral-900">{mockClientProfile.businessName}</h3>
                  <p className="text-sm text-neutral-500">
                    {mockClientProfile.industry} &middot; {mockClientProfile.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Active Projects</p>
                  <p className="text-lg font-semibold text-neutral-900">{mockClientProjects.length}</p>
                </div>
                <Badge variant="primary">{mockClientProfile.growthPhase}</Badge>
                <StatusBadge status={mockClientProfile.partnershipStatus} />
                {expandedId === mockClientProfile.id ? (
                  <ChevronDown size={18} className="text-neutral-400" />
                ) : (
                  <ChevronRight size={18} className="text-neutral-400" />
                )}
              </div>
            </button>

            {expandedId === mockClientProfile.id && (
              <div className="grid grid-cols-1 gap-4 border-t border-neutral-100 p-5 pt-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                  <p className="mt-1 text-neutral-900">{mockClientProfile.email}</p>
                  <p className="text-neutral-500">{mockClientProfile.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Partnership start</p>
                  <p className="mt-1 text-neutral-900">{formatDate(mockClientProfile.partnershipStartDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Business type</p>
                  <p className="mt-1 text-neutral-900">{mockClientProfile.businessType}</p>
                </div>
              </div>
            )}
          </Card>
          <p className="text-center text-xs text-neutral-400">
            One client account today — this view is built to scale to a full portfolio.
          </p>
        </div>
      )}

      {activeTab === 'partners' && (
        <>
          <div className="mb-5">
            <Input
              placeholder="Search partners by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredPartners.map((partner) => {
              const isExpanded = expandedId === partner.id;
              return (
                <Card key={partner.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : partner.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                        {getInitials(partner.businessName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-neutral-900">{partner.businessName}</h3>
                        <p className="text-sm text-neutral-500">
                          {partner.partnerType} &middot; {partner.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <div className="hidden text-right md:block">
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Referrals</p>
                        <p className="text-lg font-semibold text-neutral-900">{partner.totalReferrals}</p>
                      </div>
                      <StatusBadge status={partner.partnerStatus} />
                      {isExpanded ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="space-y-4 border-t border-neutral-100 p-5 pt-4">
                      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                          <p className="mt-1 text-neutral-900">{partner.email}</p>
                          <p className="text-neutral-500">{partner.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Joined</p>
                          <p className="mt-1 text-neutral-900">{formatDate(partner.joinDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Total commissions</p>
                          <p className="mt-1 text-neutral-900">{formatCurrency(partner.totalCommissionsEarned)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                          Approved capabilities
                        </p>
                        <CapabilityChips capabilities={partner.capabilities} />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredPartners.length === 0 && (
            <EmptyState icon={<Users />} title="No partners found" description="Try a different search term." />
          )}
        </>
      )}
    </StaffLayout>
  );
}
