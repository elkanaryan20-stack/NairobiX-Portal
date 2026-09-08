'use client';

import Link from 'next/link';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { Input, Tabs, EmptyState } from '@/components/ui/Form';
import { mockClientProfile, mockClientProjects } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';
import { ChevronRight, Plus, Users } from 'lucide-react';
import { useState } from 'react';

// Mock list of all clients
const mockClients = [
  { ...mockClientProfile, id: 'c1', projects: mockClientProjects.length },
  {
    id: 'c2',
    businessName: 'RetailMax Solutions',
    industry: 'Retail',
    location: 'Nairobi',
    phone: '+254 722 444 555',
    email: 'contact@retailmax.ke',
    partnershipStatus: 'active' as const,
    partnershipStartDate: '2023-09-01',
    growthPhase: 'Acquisition' as const,
    businessType: 'Retail',
    projects: 5,
  },
  {
    id: 'c3',
    businessName: 'HealthTech Kenya',
    industry: 'Healthcare',
    location: 'Nairobi',
    phone: '+254 712 888 999',
    email: 'contact@healthtech.ke',
    partnershipStatus: 'active' as const,
    partnershipStartDate: '2024-01-15',
    growthPhase: 'Foundation' as const,
    businessType: 'Healthcare Tech',
    projects: 2,
  },
];

export default function StaffClients() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients =
    activeTab === 'all'
      ? mockClients
      : mockClients.filter((c) => c.partnershipStatus === activeTab);

  const searchedClients = filteredClients.filter(
    (c) =>
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout
      pageTitle="Clients"
      pageSubtitle="Manage all active client partnerships and relationships"
      headerActions={
        <Button variant="primary" icon={<Plus size={16} />}>
          New Client
        </Button>
      }
    >
      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Search clients by name or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Tabs
          tabs={[
            { label: `All (${mockClients.length})`, value: 'all' },
            {
              label: `Active (${mockClients.filter((c) => c.partnershipStatus === 'active').length})`,
              value: 'active',
            },
            {
              label: `Pending (${mockClients.filter((c) => c.partnershipStatus === 'pending').length})`,
              value: 'pending',
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {searchedClients.map((client) => (
          <Link key={client.id} href={`/staff/clients/${client.id}`}>
            <Card hover className="p-6">
              <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr_1fr_auto]">
                {/* Business Info */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                    {getInitials(client.businessName)}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate font-semibold text-neutral-900">
                        {client.businessName}
                      </h3>
                      <StatusBadge status={client.partnershipStatus} />
                    </div>
                    <p className="text-sm text-neutral-500">
                      {client.industry} · {client.location}
                    </p>
                  </div>
                </div>

                {/* Partnership Info */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Growth Phase
                  </p>
                  <Badge variant="primary">{client.growthPhase}</Badge>
                  <p className="mt-2 text-xs text-neutral-500">
                    Since {new Date(client.partnershipStartDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Projects */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Active Projects
                  </p>
                  <p className="text-2xl font-semibold text-neutral-900">
                    {client.projects}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex justify-end">
                  <span className="flex items-center gap-1 text-sm font-medium text-primary">
                    View profile <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {searchedClients.length === 0 && (
        <EmptyState
          icon={<Users />}
          title="No clients found"
          description={searchTerm ? 'Try a different search term.' : 'Add your first client to get started.'}
        />
      )}
    </StaffLayout>
  );
}
