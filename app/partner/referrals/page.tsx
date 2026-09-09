'use client';

import { useEffect, useState } from 'react';
import { Plus, ArrowLeft, Share2, CheckCircle2, ChevronDown } from 'lucide-react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { Input, Textarea, Select, Tabs, EmptyState, Alert } from '@/components/ui/Form';
import { mockPartnerReferrals, mockPartnerProfile } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Referral } from '@/lib/types';

const STORAGE_KEY = 'nairobix-partner-referrals';

function loadReferrals(): Referral[] {
  if (typeof window === 'undefined') return mockPartnerReferrals;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return mockPartnerReferrals;
    const extras = (JSON.parse(saved) as Referral[]).filter((r) => !mockPartnerReferrals.some((m) => m.id === r.id));
    return [...extras, ...mockPartnerReferrals];
  } catch {
    return mockPartnerReferrals;
  }
}

function persistExtras(referrals: Referral[]) {
  if (typeof window === 'undefined') return;
  try {
    const extras = referrals.filter((r) => !mockPartnerReferrals.some((m) => m.id === r.id));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(extras));
  } catch {
    // localStorage unavailable — submissions still work for this session
  }
}

const emptyForm = {
  businessName: '',
  contactPerson: '',
  email: '',
  phone: '',
  industry: '',
  location: '',
  website: '',
  businessNeed: '',
  notes: '',
};

export default function PartnerReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>(mockPartnerReferrals);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    setReferrals(loadReferrals());
  }, []);

  const filteredReferrals = activeTab === 'all' ? referrals : referrals.filter((r) => r.status === activeTab);

  const setField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.businessName.trim()) next.businessName = 'Business name is required';
    if (!form.contactPerson.trim()) next.contactPerson = 'Contact person is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    if (!form.industry.trim()) next.industry = 'Industry is required';
    if (!form.businessNeed.trim()) next.businessNeed = 'Describe what this business needs';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newReferral: Referral = {
      id: `ref-local-${Date.now()}`,
      businessName: form.businessName.trim(),
      contactPerson: form.contactPerson.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      industry: form.industry,
      location: form.location.trim() || 'Not specified',
      website: form.website.trim() || undefined,
      businessNeed: form.businessNeed.trim(),
      status: 'submitted',
      referredBy: mockPartnerProfile.businessName,
      referralDate: new Date().toISOString().slice(0, 10),
    };

    const next = [newReferral, ...referrals];
    setReferrals(next);
    persistExtras(next);
    setForm(emptyForm);
    setErrors({});
    setShowForm(false);
    setJustSubmitted(true);
    setActiveTab('all');
  };

  return (
    <PartnerLayout
      pageTitle="Referrals"
      pageSubtitle="Submit and track business referrals"
      headerActions={
        !showForm ? (
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowForm(true)}>
            New Referral
          </Button>
        ) : undefined
      }
    >
      {justSubmitted && !showForm && (
        <div className="mb-6">
          <Alert
            type="success"
            title="Referral submitted"
            description="NairobiX will review it and update its status here — you'll see it move through Submitted → Contacted → Qualified as it progresses."
            onClose={() => setJustSubmitted(false)}
          />
        </div>
      )}

      {!showForm ? (
        <>
          <div className="mb-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Referral Pipeline</h3>
            <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-5">
              {[
                { status: 'submitted', label: 'Submitted', color: 'bg-neutral-50' },
                { status: 'contacted', label: 'Contacted', color: 'bg-blue-50/60' },
                { status: 'qualified', label: 'Qualified', color: 'bg-blue-50/60' },
                { status: 'proposal', label: 'Proposal', color: 'bg-amber-50/60' },
                { status: 'won', label: 'Won', color: 'bg-emerald-50/60' },
              ].map((stage) => (
                <Card key={stage.status} className={`p-3 text-center ${stage.color}`}>
                  <p className="text-2xl font-semibold text-neutral-900">
                    {referrals.filter((r) => r.status === stage.status).length}
                  </p>
                  <p className="text-xs text-neutral-500">{stage.label}</p>
                </Card>
              ))}
            </div>
          </div>

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

          <div className="space-y-3">
            {filteredReferrals.map((referral) => {
              const expanded = expandedId === referral.id;
              return (
                <Card key={referral.id} className="p-0">
                  <button
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setExpandedId(expanded ? null : referral.id)}
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-semibold text-neutral-900">{referral.businessName}</h3>
                        <StatusBadge status={referral.status} />
                      </div>
                      <p className="truncate text-sm text-neutral-500">
                        {referral.contactPerson} &middot; {referral.industry} &middot; Referred {formatDate(referral.referralDate)}
                      </p>
                    </div>
                    <ChevronDown size={18} className={`flex-shrink-0 text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>

                  {expanded && (
                    <div className="grid gap-6 border-t border-neutral-100 p-5 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <div className="mb-3 space-y-2">
                          <p className="text-sm text-neutral-600">
                            <span className="font-medium text-neutral-900">Contact:</span> {referral.contactPerson} &middot; {referral.phone} &middot; {referral.email}
                          </p>
                          <p className="text-sm text-neutral-600">
                            <span className="font-medium text-neutral-900">Growth need:</span> {referral.businessNeed}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="neutral">{referral.location}</Badge>
                          {referral.website && <Badge variant="neutral">{referral.website}</Badge>}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {referral.potentialValue && (
                          <div className="rounded-sm bg-blue-50/60 p-3">
                            <p className="mb-1 text-xs font-medium text-neutral-500">Potential Value</p>
                            <p className="text-lg font-semibold text-blue-700">{formatCurrency(referral.potentialValue)}</p>
                          </div>
                        )}
                        {referral.commission && (
                          <div
                            className={`rounded-sm p-3 ${
                              referral.commission.status === 'paid' ? 'bg-emerald-50/60' : referral.commission.status === 'approved' ? 'bg-amber-50/60' : 'bg-neutral-50'
                            }`}
                          >
                            <p className="mb-1 text-xs font-medium text-neutral-500">Commission</p>
                            <p className="text-lg font-semibold text-neutral-900">{formatCurrency(referral.commission.amount)}</p>
                            <StatusBadge status={referral.commission.status} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredReferrals.length === 0 && (
            <EmptyState
              icon={<Share2 />}
              title="No referrals yet"
              description="Submit your first business referral to get started."
              action={{ label: 'Submit a Referral', onClick: () => setShowForm(true) }}
            />
          )}
        </>
      ) : (
        <Card className="mb-8 p-6">
          <button
            onClick={() => setShowForm(false)}
            className="mb-4 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft size={15} /> Back to referrals
          </button>

          <h3 className="mb-6 text-xl font-semibold text-neutral-900">Submit a Business Referral</h3>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Business Name *</label>
                <Input placeholder="Company name" value={form.businessName} onChange={setField('businessName')} />
                {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Contact Person *</label>
                <Input placeholder="Full name" value={form.contactPerson} onChange={setField('contactPerson')} />
                {errors.contactPerson && <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Email *</label>
                <Input type="email" placeholder="email@example.com" value={form.email} onChange={setField('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Phone *</label>
                <Input placeholder="+254 XXX XXX XXX" value={form.phone} onChange={setField('phone')} />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Industry *</label>
                <Select
                  value={form.industry}
                  onChange={setField('industry')}
                  options={[
                    { value: '', label: 'Select industry…' },
                    { value: 'Technology', label: 'Technology' },
                    { value: 'Retail', label: 'Retail' },
                    { value: 'Healthcare', label: 'Healthcare' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Manufacturing', label: 'Manufacturing' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
                {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Location</label>
                <Input placeholder="City, Country" value={form.location} onChange={setField('location')} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">Growth Need *</label>
              <Textarea
                placeholder="What is this business looking to solve or achieve?"
                rows={4}
                value={form.businessNeed}
                onChange={setField('businessNeed')}
              />
              {errors.businessNeed && <p className="mt-1 text-xs text-red-600">{errors.businessNeed}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Website</label>
                <Input placeholder="www.example.com" value={form.website} onChange={setField('website')} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Notes</label>
                <Input placeholder="Any other relevant details…" value={form.notes} onChange={setField('notes')} />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" icon={<CheckCircle2 size={16} />}>
                Submit Referral
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </PartnerLayout>
  );
}
