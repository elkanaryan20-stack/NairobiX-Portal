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
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Button, StatusBadge } from '@/components/ui/Card';
import { Tabs, Textarea, EmptyState } from '@/components/ui/Form';
import { usePortalSession } from '@/components/portal/PortalSession';
import type { OnboardingApplication, PartnerApplication, PartnerAssessment, Referral } from '@/lib/types';
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

export interface DemoPipelineData {
  applications: PartnerApplication[];
  referrals: Referral[];
  onboardingApplication: OnboardingApplication;
  assessment: PartnerAssessment;
}

/** Local-demo pipeline workflow (stage changes persist in this browser only). */
export function DemoPipelineView({ demo }: { demo: DemoPipelineData }) {
  const { name: staffName } = usePortalSession();
  const demoOnboarding = demo.onboardingApplication;
  const demoAssessment = demo.assessment;
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<PartnerApplication[]>(demo.applications);
  const [referrals, setReferrals] = useState<Referral[]>(demo.referrals);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setApplications(loadFromStorage(APPLICATIONS_KEY, demo.applications));
    setReferrals(loadFromStorage(REFERRALS_KEY, demo.referrals));
  }, [demo.applications, demo.referrals]);

  useEffect(() => saveToStorage(APPLICATIONS_KEY, applications), [applications]);
  useEffect(() => saveToStorage(REFERRALS_KEY, referrals), [referrals]);

  const advanceApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const next = nextApplicationStage(app.status);
        return next ? { ...app, status: next, reviewedBy: staffName } : app;
      })
    );
  };

  const rejectApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'rejected', notes: rejectReason || app.notes, reviewedBy: staffName }
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
    <PortalLayout
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
            const onboarding = app.onboardingApplicationId === demoOnboarding.id ? demoOnboarding : undefined;
            const assessment = app.assessmentId === demoAssessment.id ? demoAssessment : undefined;
            const next = nextApplicationStage(app.status);
            const isTerminal = app.status === 'rejected' || app.status === 'active';

            return (
              <Card key={app.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-sm font-semibold text-fg-secondary">
                      {app.businessName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-fg">{app.businessName}</h3>
                      <p className="text-sm text-fg-tertiary">
                        {app.partnerType} &middot; {app.contactPerson}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <StatusBadge status={app.status} />
                    {isExpanded ? <ChevronDown size={18} className="text-fg-tertiary" /> : <ChevronRight size={18} className="text-fg-tertiary" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-line p-5 pt-4">
                    <div className="mb-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Applied</p>
                        <p className="mt-1 text-fg">{formatDate(app.applicationDate)}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Contact</p>
                        <p className="mt-1 text-fg">{app.email}</p>
                        <p className="text-fg-tertiary">{app.phone}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Reviewed by</p>
                        <p className="mt-1 text-fg">{app.reviewedBy || '—'}</p>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="mb-5 rounded-sm bg-surface-2 p-3 text-sm text-fg-secondary">{app.notes}</div>
                    )}

                    {onboarding && (
                      <div className="mb-5">
                        <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">
                          <ClipboardCheck size={14} /> Onboarding progress
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {onboarding.steps.map((step) => (
                            <span
                              key={step.id}
                              className={cn(
                                'rounded-full px-2.5 py-1 text-xs font-medium',
                                step.status === 'completed' && 'bg-emerald-500/[0.06] text-emerald-400',
                                step.status === 'in-progress' && 'bg-blue-500/[0.06] text-blue-400',
                                step.status === 'pending' && 'bg-white/[0.05] text-fg-tertiary',
                                step.status === 'locked' && 'bg-white/[0.05] text-fg-tertiary'
                              )}
                            >
                              {step.name}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-fg-secondary">
                          <ShieldCheck size={14} className="text-fg-tertiary" />
                          Document verification: <StatusBadge status={onboarding.verificationStatus} />
                        </p>
                      </div>
                    )}

                    {assessment && (
                      <div className="mb-5">
                        <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">
                          <FileText size={14} /> Partner assessment
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={assessment.status} />
                          <span className="text-sm text-fg-tertiary">
                            {assessment.responses.length} response{assessment.responses.length === 1 ? '' : 's'} recorded
                          </span>
                        </div>
                        {assessment.status !== 'submitted' && assessment.status !== 'reviewed' && (
                          <p className="mt-1 text-xs text-fg-tertiary">Awaiting the partner to complete and submit their assessment.</p>
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary">
                      <Share2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-fg">{ref.businessName}</h3>
                      <p className="text-sm text-fg-tertiary">
                        Referred by {ref.referredBy} &middot; {ref.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {ref.potentialValue && (
                      <span className="hidden text-sm font-medium text-fg-secondary sm:inline">
                        {formatCurrency(ref.potentialValue)}
                      </span>
                    )}
                    <StatusBadge status={ref.status} />
                    {isExpanded ? <ChevronDown size={18} className="text-fg-tertiary" /> : <ChevronRight size={18} className="text-fg-tertiary" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-line p-5 pt-4">
                    <div className="mb-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Contact</p>
                        <p className="mt-1 text-fg">{ref.contactPerson}</p>
                        <p className="text-fg-tertiary">{ref.email} &middot; {ref.phone}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Referred</p>
                        <p className="mt-1 text-fg">{formatDate(ref.referralDate)}</p>
                      </div>
                    </div>
                    <p className="mb-4 rounded-sm bg-surface-2 p-3 text-sm text-fg-secondary">{ref.businessNeed}</p>

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
    </PortalLayout>
  );
}
