'use client';

import { ShieldCheck, Clock } from 'lucide-react';
import { Card, Button, StatusBadge } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Form';
import type { OnboardingApplication } from '@/lib/types';

interface VerificationStepProps {
  application: OnboardingApplication;
  onContinue: () => void;
}

export function VerificationStep({ application, onContinue }: VerificationStepProps) {
  const { verificationStatus } = application;

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">Verification</h3>
            <StatusBadge status={verificationStatus} />
          </div>
          <p className="text-sm text-neutral-500">
            NairobiX staff verify your documents before your assessment is reviewed.
          </p>
        </div>
      </div>

      {verificationStatus === 'pending' && (
        <Alert
          type="info"
          title="Your documents are being verified by the NairobiX team"
          description="This usually takes 1–2 business days. You can continue completing your onboarding while this happens — verification runs in parallel."
        />
      )}
      {verificationStatus === 'verified' && (
        <Alert
          type="success"
          title="Your documents have been verified"
          description="You're clear to proceed to the partnership agreement."
        />
      )}
      {verificationStatus === 'rejected' && (
        <Alert
          type="error"
          title="One or more documents need attention"
          description="A NairobiX team member will reach out with details on what needs to be corrected."
        />
      )}
      {verificationStatus === 'not-started' && (
        <Alert
          type="info"
          title="Verification hasn't started yet"
          description="Complete the Supporting Documents step first."
        />
      )}

      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Clock size={13} /> Verification is handled by NairobiX staff and updates automatically
        </p>
        <Button variant="primary" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </Card>
  );
}
