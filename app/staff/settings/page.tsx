'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Button } from '@/components/ui/Card';
import { Input, Tabs } from '@/components/ui/Form';
import { useState } from 'react';

export default function StaffSettings() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <StaffLayout
      pageTitle="Settings"
      pageSubtitle="Manage your staff account and workspace preferences"
    >
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
        <div className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Full Name
                </label>
                <Input placeholder="Grace Kipchoge" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Email
                </label>
                <Input type="email" placeholder="grace.kipchoge@nairobiex.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Department
                </label>
                <select className="input">
                  <option>Operations</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Support</option>
                  <option>Finance</option>
                </select>
              </div>

              <div className="pt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-3">
              {[
                'New service requests',
                'Partner referral updates',
                'Invoice notifications',
                'Project milestone updates',
                'Client communications',
                'System alerts',
              ].map((notif) => (
                <label key={notif} className="flex items-center gap-3 rounded-sm px-3 py-2.5 hover:bg-neutral-50">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                  <span className="text-sm text-neutral-800">{notif}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Privacy Settings
            </h3>
            <div className="space-y-3">
              {[
                'Show online status',
                'Allow client direct messaging',
                'Share activity status',
              ].map((privacy) => (
                <label key={privacy} className="flex items-center gap-3 rounded-sm px-3 py-2.5 hover:bg-neutral-50">
                  <input type="checkbox" className="h-4 w-4 accent-primary" />
                  <span className="text-sm text-neutral-800">{privacy}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Password & Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Current Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Confirm New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div className="pt-4">
                <Button variant="primary">Update Password</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-2 font-semibold text-neutral-900">
              Two-Factor Authentication
            </h3>
            <p className="mb-4 text-sm text-neutral-600">
              Add an extra layer of security to your account
            </p>
            <Button variant="secondary">Enable 2FA</Button>
          </Card>
        </div>
      )}
    </StaffLayout>
  );
}
