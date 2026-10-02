'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Button, Badge } from '@/components/ui/Card';
import { Input, Tabs } from '@/components/ui/Form';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { formatDate } from '@/lib/utils';
import type { ParticipantProfileView } from '@/lib/portal-data/participant';
import type { DataSource } from '@/lib/portal-data/source';

export function ParticipantSettingsView({ source, profile }: { source: DataSource; profile: ParticipantProfileView }) {
  const [activeTab, setActiveTab] = useState('account');
  // The CRM is the system of record: details are read-only here and updated by NairobiX.
  const demo = source === 'demo';

  return (
    <PortalLayout pageTitle="Settings" pageSubtitle="Your Opportunity Network participation and preferences">
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
          {(
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-fg">NairobiX Connection</h3>
                <Badge variant="success">{profile.portalAccessStatus}</Badge>
              </div>
              <p className="mb-5 text-sm text-fg-tertiary">
                Your portal identity, as resolved from the NairobiX CRM.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Participant</p>
                  <p className="mt-1 text-sm font-medium text-fg">{profile.participationTypes.join(' · ') || 'Opportunity Network'}</p>
                  <p className="font-mono text-xs text-fg-tertiary">{profile.participantNumbers.join(', ')}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Contact</p>
                  <p className="mt-1 text-sm font-medium text-fg">{profile.name}</p>
                  <p className="font-mono text-xs text-fg-tertiary">{profile.contactId}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Participant status</p>
                  <p className="mt-1 text-sm font-medium text-fg">{profile.participantStatus}</p>
                  {profile.joined && <p className="text-xs text-fg-tertiary">Since {formatDate(profile.joined)}</p>}
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-fg">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-fg">Full Name</label>
                <Input defaultValue={profile.name} readOnly={!demo} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-fg">Email Address</label>
                <Input type="email" defaultValue={profile.email} readOnly={!demo} />
              </div>
              {profile.businessName && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-fg">Business Name</label>
                  <Input defaultValue={profile.businessName} readOnly={!demo} />
                </div>
              )}
              {demo ? (
                <Button variant="primary" className="mt-2">
                  Save Changes
                </Button>
              ) : (
                <p className="mt-2 text-sm text-fg-tertiary">To update these details, contact your NairobiX representative.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-fg">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { title: 'Referral Updates', description: 'Get notified when a referral changes stage' },
              { title: 'Commission Payouts', description: 'Payment confirmations and approvals' },
              { title: 'Rewards & Milestones', description: 'Progress toward partner rewards' },
            ].map((notif, i) => (
              <div key={i} className="flex items-start justify-between border-b border-line py-3 last:border-b-0">
                <div>
                  <p className="font-medium text-fg">{notif.title}</p>
                  <p className="text-sm text-fg-tertiary">{notif.description}</p>
                </div>
                <input type="checkbox" defaultChecked className="mt-1 accent-primary" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'payout' && !demo && (
        <NotYetAvailable
          title="Payout details aren't available yet"
          description="Payout settings will be available once commissions are connected to your Opportunity Network participation."
        />
      )}

      {activeTab === 'payout' && demo && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-fg">Payout Details</h3>
          <p className="mb-6 text-sm text-fg-tertiary">
            Commission payments are made monthly to the account on file.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-fg">Bank Name</label>
              <Input placeholder="e.g. Equity Bank" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-fg">Account Number</label>
              <Input placeholder="Account number" />
            </div>
            <Button variant="primary" className="mt-2">
              Save Payout Details
            </Button>
          </div>
        </Card>
      )}
    </PortalLayout>
  );
}
