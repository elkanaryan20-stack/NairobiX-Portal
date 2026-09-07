'use client';

import Link from 'next/link';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { Input, Tabs } from '@/components/ui/Form';
import { mockClientProfile, mockClientProjects } from '@/lib/mock-data';
import { ChevronRight, Plus } from 'lucide-react';
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
              <div className="grid md:grid-cols-4 gap-6 items-center">
                {/* Business Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-neutral-900 truncate">
                      {client.businessName}
                    </h3>
                    <StatusBadge status={client.partnershipStatus} />
                  </div>
                  <p className="text-sm text-neutral-600">
                    {client.industry} • {client.location}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {client.email}
                  </p>
                </div>

                {/* Partnership Info */}
                <div>
                  <p className="text-xs text-neutral-600 font-medium mb-1">
                    Growth Phase
                  </p>
                  <Badge variant="primary">{client.growthPhase}</Badge>
                  <p className="text-xs text-neutral-500 mt-2">
                    Since {new Date(client.partnershipStartDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Projects */}
                <div>
                  <p className="text-xs text-neutral-600 font-medium mb-1">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {client.projects}
                  </p>
                </div>

                {/* CTA */}
                <div className="text-right">
                  <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                    View Profile <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {searchedClients.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No clients found
          </h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try a different search term' : 'Add your first client'}
          </p>
        </Card>
      )}
    </StaffLayout>
  );
}
