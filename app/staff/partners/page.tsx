'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import { Plus } from 'lucide-react';
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

      <div className="space-y-4">
        {mockPartners.map((partner) => (
          <Card key={partner.id} hover className="p-6">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <div>
                <h3 className="font-bold text-neutral-900">{partner.name}</h3>
                <p className="text-sm text-neutral-600">{partner.company}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">Referrals</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {partner.referrals}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">
                  Total Commissions
                </p>
                <p className="text-lg font-bold text-neutral-900">
                  {partner.commissions}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="success">{partner.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
