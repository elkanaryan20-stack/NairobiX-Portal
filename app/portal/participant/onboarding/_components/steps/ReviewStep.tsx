'use client';

import { BadgeCheck, Send } from 'lucide-react';
import { Card, Button, StatusBadge } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Form';
import type { OnboardingApplication } from '@/lib/types';

interface ReviewStepProps {
  application: OnboardingApplication;
  updateApplication: (patch: Partial<OnboardingApplication>) => void;
  onContinue: () => void;
}

export function ReviewStep({ application, updateApplication, onContinue }: ReviewStepProps) {
  const { reviewStatus } = application;

  const summary: { label: string; value: string }[] = [
    { label: 'Applicant', value: application.partnerDetails.fullName },
    { label: 'Business', value: application.businessInfo.businessName },
    { label: 'Location', value: `${application.location.city}` },
    { label: 'Documents', value: `${application.documents.length} submitted` },
    { label: 'Agreement', value: application.agreementAccepted ? 'Accepted' : 'Not accepted' },
  ];

  const handleSubmitForReview = () => {
    updateApplication({ reviewStatus: 'in-review' });
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary">
          <BadgeCheck size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-fg">Review &amp; Approval</h3>
            <StatusBadge status={reviewStatus} />
          </div>
          <p className="text-sm text-fg-tertiary">A final summary before NairobiX reviews your application.</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-sm border border-line p-5 sm:grid-cols-2">
        {summary.map((row) => (
          <div key={row.label}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">{row.label}</p>
            <p className="mt-0.5 text-sm font-medium text-fg">{row.value}</p>
          </div>
        ))}
      </div>

      {reviewStatus === 'not-submitted' && (
        <Alert
          type="info"
          title="Ready to submit for review"
          description="Once submitted, a NairobiX team member will review your details, documents and assessment together. You'll be notified as soon as a decision is made."
        />
      )}
      {reviewStatus === 'in-review' && (
        <Alert
          type="info"
          title="Your application is with the NairobiX team"
          description="This typically takes 2–4 business days. Payment and commission setup unlocks automatically once you're approved."
        />
      )}
      {reviewStatus === 'approved' && (
        <Alert
          type="success"
          title="You're approved!"
          description="Continue to set up your payment and commission details."
        />
      )}
      {reviewStatus === 'rejected' && (
        <Alert
          type="error"
          title="Your application wasn't approved this time"
          description={application.reviewNotes || 'A NairobiX team member will follow up with more detail.'}
        />
      )}

      <div className="mt-6 flex justify-end border-t border-line pt-5">
        {reviewStatus === 'not-submitted' ? (
          <Button variant="primary" rightIcon={<Send size={15} />} onClick={handleSubmitForReview}>
            Submit for Review
          </Button>
        ) : (
          <Button variant="primary" onClick={onContinue}>
            Continue
          </Button>
        )}
      </div>
    </Card>
  );
}
