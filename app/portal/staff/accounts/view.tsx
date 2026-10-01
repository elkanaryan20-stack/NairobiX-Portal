'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { Input, Tabs, EmptyState } from '@/components/ui/Form';
import { getInitials, formatDate } from '@/lib/utils';
import type { StaffAccountRow, StaffParticipantRow } from '@/lib/portal-data/staff';

function Chips({ values }: { values: string[] }) {
  if (values.length === 0) return <p className="text-sm text-neutral-400">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <span key={value} className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
          {value}
        </span>
      ))}
    </div>
  );
}

function statusKey(value?: string) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : 'inactive';
}

export function StaffAccountsView({
  clients,
  participants,
}: {
  clients: StaffAccountRow[];
  participants: StaffParticipantRow[];
}) {
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const term = searchTerm.toLowerCase();
  const filteredClients = clients.filter(
    (c) => c.name.toLowerCase().includes(term) || (c.industry ?? '').toLowerCase().includes(term)
  );
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.participationTypes.some((t) => t.toLowerCase().includes(term))
  );

  return (
    <PortalLayout pageTitle="Accounts" pageSubtitle="Every client and Opportunity Network Participant NairobiX works with">
      <Tabs
        tabs={[
          { label: `Clients (${clients.length})`, value: 'clients' },
          { label: `Participants (${participants.length})`, value: 'participants' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchTerm('');
          setExpandedId(null);
        }}
      />

      <div className="mb-5">
        <Input
          placeholder={activeTab === 'clients' ? 'Search clients by name or industry...' : 'Search participants by name or participation type...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'clients' && (
        <div className="space-y-3">
          {filteredClients.map((client) => {
            const isExpanded = expandedId === client.id;
            return (
              <Card key={client.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : client.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                      {getInitials(client.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">{client.name}</h3>
                      <p className="text-sm text-neutral-500">
                        {[client.industry, client.location].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Active Engagements</p>
                      <p className="text-lg font-semibold text-neutral-900">{client.activeEngagements}</p>
                    </div>
                    {client.status && <StatusBadge status={statusKey(client.status)} />}
                    {isExpanded ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-1 gap-4 border-t border-neutral-100 p-5 pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Phone</p>
                      <p className="mt-1 text-neutral-900">{client.phone ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Client since</p>
                      <p className="mt-1 text-neutral-900">{client.clientSince ? formatDate(client.clientSince) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">CRM Account</p>
                      <p className="mt-1 font-mono text-xs text-neutral-500">{client.id}</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
          {filteredClients.length === 0 && (
            <EmptyState icon={<Users />} title="No clients found" description={searchTerm ? 'Try a different search term.' : 'Accounts with a Closed Won Deal appear here.'} />
          )}
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="space-y-3">
          {filteredParticipants.map((participant) => {
            const isExpanded = expandedId === participant.id;
            return (
              <Card key={participant.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : participant.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                      {getInitials(participant.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">{participant.name}</h3>
                      <p className="text-sm text-neutral-500">{participant.participationTypes.join(' · ') || 'Opportunity Network Participant'}</p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-4">
                    {participant.participantStatus && <StatusBadge status={statusKey(participant.participantStatus)} />}
                    {isExpanded ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="space-y-4 border-t border-neutral-100 p-5 pt-4">
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                        <p className="mt-1 text-neutral-900">{participant.email ?? '—'}</p>
                        {participant.participantNumber && <p className="font-mono text-xs text-neutral-400">{participant.participantNumber}</p>}
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Joined</p>
                        <p className="mt-1 text-neutral-900">{participant.joined ? formatDate(participant.joined) : '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Portal access</p>
                        <p className="mt-1 text-neutral-900">{participant.portalAccessStatus ?? '—'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Participation types</p>
                      <Chips values={participant.participationTypes} />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
          {filteredParticipants.length === 0 && (
            <EmptyState icon={<Users />} title="No participants found" description={searchTerm ? 'Try a different search term.' : 'Opportunity Network Participants appear here.'} />
          )}
        </div>
      )}
    </PortalLayout>
  );
}
