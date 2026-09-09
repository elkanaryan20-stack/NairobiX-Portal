'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  X,
  FileText,
  ShieldCheck,
  ClipboardCheck,
  UserCheck,
  Share2,
} from 'lucide-react';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Button, StatusBadge } from '@/components/ui/Card';
import { Tabs, Textarea, EmptyState } from '@/components/ui/Form';
import {
  mockPartnerApplications,
  mockOnboardingApplication,
  mockPartnerAssessment,
  mockPartnerReferrals,
} from '@/lib/mock-data';
import { PartnerApplication, Referral } from '@/lib/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const APPLICATIONS_KEY = 'nairobix-staff-partner-applications';
const REFERRALS_KEY = 'nairobix-staff-referrals';

// Linear application pipeline. "rejected" and "active" are reachable from
// anywhere via explicit actions rather than "next stage".
const APPLICATION_STAGES: PartnerApplication['status'][] = [
  'submitted',
  'under-review',
  'assessment',
  'verification',
  'approved',
  'active',
];

function nextApplicationStage(current: PartnerApplication['status']): PartnerApplication['status'] | null {
  const idx = APPLICATION_STAGES.indexOf(current);
  if (idx === -1 || idx === APPLICATION_STAGES.length - 1) return null;
  return APPLICATION_STAGES[idx + 1];
}

const REFERRAL_STAGES: Referral['status'][] = ['submitted', 'contacted', 'qualified', 'proposal', 'won'];

function nextReferralStage(current: Referral['status']): Referral['status'] | null {
  const idx = REFERRAL_STAGES.indexOf(current);
  if (idx === -1 || idx === REFERRAL_STAGES.length - 1) return null;
  return REFERRAL_STAGES[idx + 1];
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore — local persistence is a nicety, not a requirement
  }
}

export default function StaffPipeline() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<PartnerApplication[]>(mockPartnerApplications);
  const [referrals, setReferrals] = useState<Referral[]>(mockPartnerReferrals);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setApplications(loadFromStorage(APPLICATIONS_KEY, mockPartnerApplications));
    setReferrals(loadFromStorage(REFERRALS_KEY, mockPartnerReferrals));
  }, []);

  useEffect(() => saveToStorage(APPLICATIONS_KEY, applications), [applications]);
  useEffect(() => saveToStorage(REFERRALS_KEY, referrals), [referrals]);

  const advanceApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const next = nextApplicationStage(app.status);
        return next ? { ...app, status: next, reviewedBy: 'Grace Kipchoge' } : app;
      })
    );
  };

  const rejectApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'rejected', notes: rejectReason || app.notes, reviewedBy: 'Grace Kipchoge' }
          : app
      )
    );
    setRejectingId(null);
    setRejectReason('');
  };

  const advanceReferral = (id: string) => {
    setReferrals((prev) =>
      prev.map((ref) => {
        if (ref.id !== id) return ref;
        const next = nextReferralStage(ref.status);
        return next ? { ...ref, status: next } : ref;
      })
    );
  };

  const markReferralNotQualified = (id: string) => {
    setReferrals((prev) => prev.map((ref) => (ref.id === id ? { ...ref, status: 'lost' } : ref)));
  };

  return (
    <StaffLayout
      pageTitle="Pipeline"
      pageSubtitle="Review partner applications and qualify partner referrals"
    >
      <Tabs
        tabs={[
          { label: `Partner Applications (${applications.length})`, value: 'applications' },
          { label: `Referrals (${referrals.length})`, value: 'referrals' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'applications' && (
        <div className="space-y-3">
          {applications.map((app) => {
            const isExpanded = expandedApp === app.id;
            const onboarding = app.onboardingApplicationId === mockOnboardingApplication.id ? mockOnboardingApplication : undefined;
            const assessment = app.assessmentId === mockPartnerAssessment.id ? mockPartnerAssessment : undefined;
            const next = nextApplicationStage(app.status);
            const isTerminal = app.status === 'rejected' || app.status === 'active';

            return (
              <Card key={app.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                      {app.businessName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">{app.businessName}</h3>
                      <p className="text-sm text-neutral-500">
                        {app.partnerType} &middot; {app.contactPerson}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <StatusBadge status={app.status} />
                    {isExpanded ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-100 p-5 pt-4">
                    <div className="mb-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Applied</p>
                        <p className="mt-1 text-neutral-900">{formatDate(app.applicationDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                        <p className="mt-1 text-neutral-900">{app.email}</p>
                        <p className="text-neutral-500">{app.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Reviewed by</p>
                        <p className="mt-1 text-neutral-900">{app.reviewedBy || '—'}</p>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="mb-5 rounded-sm bg-neutral-50 p-3 text-sm text-neutral-600">{app.notes}</div>
                    )}

                    {onboarding && (
                      <div className="mb-5">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          <ClipboardCheck size={14} /> Onboarding progress
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {onboarding.steps.map((step) => (
                            <span
                              key={step.id}
                              className={cn(
                                'rounded-full px-2.5 py-1 text-xs font-medium',
                                step.status === 'completed' && 'bg-emerald-50 text-emerald-700',
                                step.status === 'in-progress' && 'bg-blue-50 text-blue-700',
                                step.status === 'pending' && 'bg-neutral-100 text-neutral-500',
                                step.status === 'locked' && 'bg-neutral-100 text-neutral-400'
                              )}
                            >
                              {step.name}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                          <ShieldCheck size={14} className="text-neutral-400" />
                          Document verification: <StatusBadge status={onboarding.verificationStatus} />
                        </p>
                      </div>
                    )}

                    {assessment && (
                      <div className="mb-5">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          <FileText size={14} /> Partner assessment
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={assessment.status} />
                          <span className="text-sm text-neutral-500">
                            {assessment.responses.length} response{assessment.responses.length === 1 ? '' : 's'} recorded
                          </span>
                        </div>
                        {assessment.status !== 'submitted' && assessment.status !== 'reviewed' && (
                          <p className="mt-1 text-xs text-neutral-400">Awaiting the partner to complete and submit their assessment.</p>
                        )}
                      </div>
                    )}

                    {rejectingId === app.id ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Reason for rejection (shared internally)"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm" onClick={() => rejectApplication(app.id)} icon={<Check size={14} />}>
                            Confirm Rejection
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setRejectingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      !isTerminal && (
                        <div className="flex flex-wrap gap-2">
                          {next && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={app.status === 'approved' ? <UserCheck size={14} /> : <Check size={14} />}
                              onClick={() => advanceApplication(app.id)}
                            >
                              {app.status === 'approved' ? 'Activate Partner' : `Advance to ${next.replace('-', ' ')}`}
                            </Button>
                          )}
                          <Button variant="secondary" size="sm" icon={<X size={14} />} onClick={() => setRejectingId(app.id)}>
                            Reject
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="space-y-3">
          {referrals.map((ref) => {
            const isExpanded = expandedReferral === ref.id;
            const next = nextReferralStage(ref.status);
            const isTerminal = ref.status === 'won' || ref.status === 'lost';

            return (
              <Card key={ref.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedReferral(isExpanded ? null : ref.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                      <Share2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">{ref.businessName}</h3>
                      <p className="text-sm text-neutral-500">
                        Referred by {ref.referredBy} &middot; {ref.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {ref.potentialValue && (
                      <span className="hidden text-sm font-medium text-neutral-700 sm:inline">
                        {formatCurrency(ref.potentialValue)}
                      </span>
                    )}
                    <StatusBadge status={ref.status} />
                    {isExpanded ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-100 p-5 pt-4">
                    <div className="mb-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contact</p>
                        <p className="mt-1 text-neutral-900">{ref.contactPerson}</p>
                        <p className="text-neutral-500">{ref.email} &middot; {ref.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Referred</p>
                        <p className="mt-1 text-neutral-900">{formatDate(ref.referralDate)}</p>
                      </div>
                    </div>
                    <p className="mb-4 rounded-sm bg-neutral-50 p-3 text-sm text-neutral-600">{ref.businessNeed}</p>

                    {!isTerminal && (
                      <div className="flex flex-wrap gap-2">
                        {next && (
                          <Button variant="primary" size="sm" icon={<Check size={14} />} onClick={() => advanceReferral(ref.id)}>
                            Move to {next}
                          </Button>
                        )}
                        <Button variant="secondary" size="sm" icon={<X size={14} />} onClick={() => markReferralNotQualified(ref.id)}>
                          Not Qualified
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {referrals.length === 0 && (
            <EmptyState icon={<Share2 />} title="No referrals yet" description="Partner referrals will appear here as they're submitted." />
          )}
        </div>
      )}
    </StaffLayout>
  );
}
