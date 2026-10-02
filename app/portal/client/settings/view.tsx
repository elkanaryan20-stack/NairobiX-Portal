'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Button, Badge } from '@/components/ui/Card';
import { Input, Tabs } from '@/components/ui/Form';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import type { ClientProfileView } from '@/lib/portal-data/client';
import type { DataSource } from '@/lib/portal-data/source';

export function ClientSettingsView({ source, profile }: { source: DataSource; profile: ClientProfileView }) {
  const [activeTab, setActiveTab] = useState('account');
  // The CRM is the system of record: profile details are read-only here and updated by NairobiX.
  const demo = source === 'demo';

  return (
    <PortalLayout
      pageTitle="Settings"
      pageSubtitle="Manage your account preferences and workspace settings"
    >
      {/* Tabs */}
      <Tabs
        tabs={[
          { label: 'Account', value: 'account' },
          { label: 'Notifications', value: 'notifications' },
          { label: 'Privacy', value: 'privacy' },
          { label: 'Security', value: 'security' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {(
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-fg">NairobiX Connection</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="mb-5 text-sm text-fg-tertiary">
                Your portal identity, as resolved from the NairobiX CRM.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Account</p>
                  <p className="mt-1 text-sm font-medium text-fg">{profile.businessName}</p>
                  <p className="font-mono text-xs text-fg-tertiary">{profile.accountId}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Contact</p>
                  <p className="mt-1 text-sm font-medium text-fg">{profile.contactName}</p>
                  <p className="font-mono text-xs text-fg-tertiary">{profile.contactId}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Client since</p>
                  <p className="mt-1 text-sm font-medium text-fg">{profile.clientSince ? formatDate(profile.clientSince) : '—'}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Full Name
                </label>
                <Input defaultValue={profile.contactName} readOnly={!demo} />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Email Address
                </label>
                <Input type="email" defaultValue={profile.contactEmail} readOnly={!demo} />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Business Name
                </label>
                <Input defaultValue={profile.businessName} readOnly={!demo} />
              </div>

              {demo ? (
                <Button variant="primary" className="mt-6">
                  Save Changes
                </Button>
              ) : (
                <p className="mt-4 text-sm text-fg-tertiary">
                  To update these details, contact your NairobiX representative.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Workspace Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-fg">Theme</p>
                  <p className="text-sm text-fg-secondary">Light theme (default)</p>
                </div>
                <select className="input">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-line">
                <div>
                  <p className="font-medium text-fg">Language</p>
                  <p className="text-sm text-fg-secondary">English</p>
                </div>
                <select className="input">
                  <option>English</option>
                  <option>Swahili</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-fg mb-6">
            Notification Preferences
          </h3>

          <div className="space-y-4">
            {[
              {
                title: 'Growth Insights',
                description: 'Get notified about new growth insights and recommendations',
              },
              {
                title: 'Project Updates',
                description: 'Receive updates on your active projects and milestones',
              },
              {
                title: 'Reports',
                description: 'Get notified when new reports are published',
              },
              {
                title: 'Billing',
                description: 'Invoice and payment notifications',
              },
            ].map((notif, i) => (
              <div key={i} className="flex items-start justify-between py-3 border-b border-line last:border-b-0">
                <div>
                  <p className="font-medium text-fg">{notif.title}</p>
                  <p className="text-sm text-fg-secondary">{notif.description}</p>
                </div>
                <input type="checkbox" defaultChecked className="mt-1" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-fg mb-6">
            Privacy Settings
          </h3>
          <p className="text-fg-secondary mb-6">
            Control how your information is used and shared
          </p>

          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-line">
              <div>
                <p className="font-medium text-fg">Profile Visibility</p>
                <p className="text-sm text-fg-secondary">
                  Visible to NairobiX team members only
                </p>
              </div>
              <input type="checkbox" defaultChecked className="mt-1" />
            </div>

            <div className="flex items-start justify-between py-3 border-b border-line">
              <div>
                <p className="font-medium text-fg">Data Collection</p>
                <p className="text-sm text-fg-secondary">
                  Allow usage analytics for service improvement
                </p>
              </div>
              <input type="checkbox" defaultChecked className="mt-1" />
            </div>
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Sign-in & Security
            </h3>
            <p className="text-sm text-fg-secondary">
              You sign in with a one-time link or code sent to {profile.contactEmail}. There is no password to
              manage, and sessions end automatically after 8 hours.
            </p>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
}
