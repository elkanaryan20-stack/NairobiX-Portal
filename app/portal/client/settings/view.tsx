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
                <h3 className="text-lg font-semibold text-neutral-900">NairobiX Connection</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="mb-5 text-sm text-neutral-500">
                Your portal identity, as resolved from the NairobiX CRM.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Account</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{profile.businessName}</p>
                  <p className="font-mono text-xs text-neutral-400">{profile.accountId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{profile.contactName}</p>
                  <p className="font-mono text-xs text-neutral-400">{profile.contactId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Client since</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{profile.clientSince ? formatDate(profile.clientSince) : '—'}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Full Name
                </label>
                <Input defaultValue={profile.contactName} readOnly={!demo} />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Email Address
                </label>
                <Input type="email" defaultValue={profile.contactEmail} readOnly={!demo} />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Business Name
                </label>
                <Input defaultValue={profile.businessName} readOnly={!demo} />
              </div>

              {demo ? (
                <Button variant="primary" className="mt-6">
                  Save Changes
                </Button>
              ) : (
                <p className="mt-4 text-sm text-neutral-500">
                  To update these details, contact your NairobiX representative.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Workspace Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Theme</p>
                  <p className="text-sm text-neutral-600">Light theme (default)</p>
                </div>
                <select className="input">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div>
                  <p className="font-medium text-neutral-900">Language</p>
                  <p className="text-sm text-neutral-600">English</p>
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
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
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
              <div key={i} className="flex items-start justify-between py-3 border-b border-neutral-200 last:border-b-0">
                <div>
                  <p className="font-medium text-neutral-900">{notif.title}</p>
                  <p className="text-sm text-neutral-600">{notif.description}</p>
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
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Privacy Settings
          </h3>
          <p className="text-neutral-600 mb-6">
            Control how your information is used and shared
          </p>

          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Profile Visibility</p>
                <p className="text-sm text-neutral-600">
                  Visible to NairobiX team members only
                </p>
              </div>
              <input type="checkbox" defaultChecked className="mt-1" />
            </div>

            <div className="flex items-start justify-between py-3 border-b border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Data Collection</p>
                <p className="text-sm text-neutral-600">
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
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Sign-in & Security
            </h3>
            <p className="text-sm text-neutral-600">
              You sign in with a one-time link or code sent to {profile.contactEmail}. There is no password to
              manage, and sessions end automatically after 8 hours.
            </p>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
}
