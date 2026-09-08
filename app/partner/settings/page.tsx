'use client';

import { useState } from 'react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Button, Badge } from '@/components/ui/Card';
import { Input, Tabs } from '@/components/ui/Form';
import { mockPartnerUser, mockPartnerProfile } from '@/lib/mock-data';
import { getAccountByContactId, getContactById } from '@/lib/crm/adapter';

export default function PartnerSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const contact = getContactById(mockPartnerUser.nairobixContactId!);
  const account = getAccountByContactId(mockPartnerUser.nairobixContactId!);

  return (
    <PartnerLayout pageTitle="Settings" pageSubtitle="Manage your partner account and preferences">
      <Tabs
        tabs={[
          { label: 'Account', value: 'account' },
          { label: 'Notifications', value: 'notifications' },
          { label: 'Payout', value: 'payout' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'account' && (
        <div className="space-y-6">
          {account && contact && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">NairobiX Connection</h3>
                <Badge variant="success">Synced</Badge>
              </div>
              <p className="mb-5 text-sm text-neutral-500">
                Your portal identity, as resolved from the NairobiX CRM.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Account</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{account.name}</p>
                  <p className="font-mono text-xs text-neutral-400">{account.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{contact.name}</p>
                  <p className="font-mono text-xs text-neutral-400">{contact.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Partner status</p>
                  <p className="mt-1 text-sm font-medium capitalize text-neutral-900">{account.status}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Full Name</label>
                <Input defaultValue={mockPartnerUser.name} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Email Address</label>
                <Input type="email" defaultValue={mockPartnerUser.email} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Business Name</label>
                <Input defaultValue={mockPartnerProfile.businessName} />
              </div>
              <Button variant="primary" className="mt-2">
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-neutral-900">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { title: 'Referral Updates', description: 'Get notified when a referral changes stage' },
              { title: 'Commission Payouts', description: 'Payment confirmations and approvals' },
              { title: 'Rewards & Milestones', description: 'Progress toward partner rewards' },
            ].map((notif, i) => (
              <div key={i} className="flex items-start justify-between border-b border-neutral-100 py-3 last:border-b-0">
                <div>
                  <p className="font-medium text-neutral-900">{notif.title}</p>
                  <p className="text-sm text-neutral-500">{notif.description}</p>
                </div>
                <input type="checkbox" defaultChecked className="mt-1 accent-primary" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'payout' && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Payout Details</h3>
          <p className="mb-6 text-sm text-neutral-500">
            Commission payments are made monthly to the account on file.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">Bank Name</label>
              <Input placeholder="e.g. Equity Bank" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">Account Number</label>
              <Input placeholder="Account number" />
            </div>
            <Button variant="primary" className="mt-2">
              Save Payout Details
            </Button>
          </div>
        </Card>
      )}
    </PartnerLayout>
  );
}
