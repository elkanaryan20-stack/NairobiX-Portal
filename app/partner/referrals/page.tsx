'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { Input, Textarea, Tabs } from '@/components/ui/Form';
import { mockPartnerReferrals } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function PartnerReferrals() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredReferrals =
    activeTab === 'all'
      ? mockPartnerReferrals
      : mockPartnerReferrals.filter((r) => r.status === activeTab);

  return (
    <PartnerLayout
      pageTitle="Referrals"
      pageSubtitle="Submit and track business referrals"
      headerActions={
        <Button variant="primary" icon={<Plus size={16} />}>
          New Referral
        </Button>
      }
    >
      {/* Referral Form - Collapsed */}
      {!showForm ? (
        <>
          {/* Referral Pipeline Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Referral Pipeline
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
              {[
                { status: 'submitted', count: mockPartnerReferrals.filter((r) => r.status === 'submitted').length, color: 'bg-neutral-50' },
                { status: 'contacted', count: mockPartnerReferrals.filter((r) => r.status === 'contacted').length, color: 'bg-blue-50' },
                { status: 'qualified', count: mockPartnerReferrals.filter((r) => r.status === 'qualified').length, color: 'bg-blue-50' },
                { status: 'proposal', count: mockPartnerReferrals.filter((r) => r.status === 'proposal').length, color: 'bg-yellow-50' },
                { status: 'won', count: mockPartnerReferrals.filter((r) => r.status === 'won').length, color: 'bg-green-50' },
              ].map((stage) => (
                <Card key={stage.status} className={`p-3 text-center ${stage.color}`}>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stage.count}
                  </p>
                  <p className="text-xs text-neutral-600 capitalize">
                    {stage.status}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              { label: 'All Referrals', value: 'all' },
              { label: 'Submitted', value: 'submitted' },
              { label: 'Contacted', value: 'contacted' },
              { label: 'Qualified', value: 'qualified' },
              { label: 'Won', value: 'won' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Referrals List */}
          <div className="space-y-4">
            {filteredReferrals.map((referral) => (
              <Card key={referral.id} hover className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Business Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-neutral-900">
                        {referral.businessName}
                      </h3>
                      <StatusBadge status={referral.status} />
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-neutral-600">
                        <span className="font-medium">Contact:</span> {referral.contactPerson}
                      </p>
                      <p className="text-sm text-neutral-600">
                        <span className="font-medium">Industry:</span> {referral.industry}
                      </p>
                      <p className="text-sm text-neutral-600">
                        <span className="font-medium">Business Need:</span>{' '}
                        {referral.businessNeed}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="neutral">
                        {referral.location}
                      </Badge>
                      {referral.website && (
                        <Badge variant="neutral">{referral.website}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Commission & Value */}
                  <div className="space-y-3">
                    {referral.potentialValue && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-neutral-600 font-medium mb-1">
                          Potential Value
                        </p>
                        <p className="text-lg font-bold text-blue-700">
                          {formatCurrency(referral.potentialValue)}
                        </p>
                      </div>
                    )}

                    {referral.commission && (
                      <div className={`p-3 rounded-lg ${
                        referral.commission.status === 'paid'
                          ? 'bg-green-50'
                          : referral.commission.status === 'approved'
                          ? 'bg-yellow-50'
                          : 'bg-neutral-50'
                      }`}>
                        <p className="text-xs text-neutral-600 font-medium mb-1">
                          Commission
                        </p>
                        <p className="text-lg font-bold text-neutral-900">
                          {formatCurrency(referral.commission.amount)}
                        </p>
                        <Badge
                          variant={
                            referral.commission.status === 'paid'
                              ? 'success'
                              : 'primary'
                          }
                          className="mt-2 text-xs"
                        >
                          {referral.commission.status}
                        </Badge>
                      </div>
                    )}

                    <p className="text-xs text-neutral-500">
                      Referred {formatDate(referral.referralDate)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredReferrals.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No referrals yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Submit your first business referral to get started
              </p>
              <Button variant="primary" icon={<Plus size={16} />}>
                Submit a Referral
              </Button>
            </Card>
          )}
        </>
      ) : (
        // Referral Form
        <Card className="p-6 mb-8">
          <button
            onClick={() => setShowForm(false)}
            className="text-primary font-medium text-sm mb-4 hover:underline"
          >
            ← Back to referrals
          </button>

          <h3 className="text-xl font-bold text-neutral-900 mb-6">
            Submit a Business Referral
          </h3>

          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Business Name *
                </label>
                <Input placeholder="Company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Contact Person *
                </label>
                <Input placeholder="Full name" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Email *
                </label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Phone *
                </label>
                <Input placeholder="+254 XXX XXX XXX" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Industry *
                </label>
                <select className="input">
                  <option>Select industry...</option>
                  <option>Technology</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Manufacturing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Location *
                </label>
                <Input placeholder="City, Country" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Business Need *
              </label>
              <Textarea
                placeholder="Describe what solutions this business needs..."
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Website
                </label>
                <Input placeholder="www.example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Additional Information
                </label>
                <Input placeholder="Any other relevant details..." />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="primary">Submit Referral</Button>
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </PartnerLayout>
  );
}
