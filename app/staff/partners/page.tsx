'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Input, EmptyState } from '@/components/ui/Form';
import { getInitials } from '@/lib/utils';
import { HeartHandshake, Plus } from 'lucide-react';
import { useState } from 'react';

export default function StaffPartners() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockPartners = [
    {
      id: 'p1',
      name: 'James Mwangi',
      company: 'Tech Consultants Ltd',
      referrals: 12,
      commissions: 'KES 145,000',
      status: 'active' as const,
    },
    {
      id: 'p2',
      name: 'Sarah Kipchoge',
      company: 'Growth Partners',
      referrals: 8,
      commissions: 'KES 92,000',
      status: 'active' as const,
    },
  ];

  return (
    <StaffLayout
      pageTitle="Partners"
      pageSubtitle="Manage partner relationships and referral performance"
      headerActions={
        <Button variant="primary" icon={<Plus size={16} />}>
          Add Partner
        </Button>
      }
    >
      <div className="mb-6">
        <Input
          placeholder="Search partners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {mockPartners
          .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.company.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((partner) => (
          <Card key={partner.id} hover className="p-6">
            <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr_1fr_auto]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                  {getInitials(partner.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-neutral-900">{partner.name}</h3>
                  <p className="text-sm text-neutral-500">{partner.company}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Referrals</p>
                <p className="text-2xl font-semibold text-neutral-900">
                  {partner.referrals}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Total Commissions
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {partner.commissions}
                </p>
              </div>
              <div className="flex justify-end">
                <Badge variant="success">{partner.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockPartners.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.company.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
        <EmptyState icon={<HeartHandshake />} title="No partners found" description="Try a different search term." />
      )}
    </StaffLayout>
  );
}
