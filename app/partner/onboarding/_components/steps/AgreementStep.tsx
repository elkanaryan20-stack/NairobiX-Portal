'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Card, Button } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { OnboardingApplication } from '@/lib/types';

interface AgreementStepProps {
  application: OnboardingApplication;
  updateApplication: (patch: Partial<OnboardingApplication>) => void;
  onContinue: () => void;
}

export function AgreementStep({ application, updateApplication, onContinue }: AgreementStepProps) {
  const [checked, setChecked] = useState(application.agreementAccepted);

  const handleContinue = () => {
    if (!checked) return;
    if (!application.agreementAccepted) {
      updateApplication({
        agreementAccepted: true,
        agreementAcceptedDate: new Date().toISOString().slice(0, 10),
      });
    }
    onContinue();
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <FileText size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Partnership Agreement</h3>
          <p className="text-sm text-neutral-500">Read and accept the terms of the NairobiX Partner Program.</p>
        </div>
      </div>

      <div className="max-h-72 space-y-4 overflow-y-auto rounded-sm border border-neutral-200 bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-700">
        <p>
          <strong className="text-neutral-900">1. Commission structure.</strong> NairobiX pays
          commissions on referrals that convert into a signed client engagement, at the rate
          communicated at the time of approval. Commissions are calculated on the first invoiced
          engagement value and paid out within 30 days of the client&rsquo;s payment clearing.
        </p>
        <p>
          <strong className="text-neutral-900">2. Code of conduct.</strong> As a NairobiX partner,
          you agree to represent NairobiX accurately and professionally, to avoid making commitments
          to prospective clients on NairobiX&rsquo;s behalf, and to route all commercial discussions
          through the NairobiX team once a referral is submitted.
        </p>
        <p>
          <strong className="text-neutral-900">3. Confidentiality.</strong> Any client, prospect or
          business information shared with you through the partner portal is confidential and may
          only be used for the purpose of supporting the referral or engagement it relates to.
        </p>
        <p>
          <strong className="text-neutral-900">4. Term and termination.</strong> This agreement
          remains in effect while your partner status is active. Either party may terminate the
          partnership with 30 days&rsquo; written notice; commissions earned prior to termination remain
          payable per the schedule above.
        </p>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-sm border border-neutral-200 p-4 hover:bg-neutral-50">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-sm text-neutral-800">
          I have read and agree to the NairobiX Partnership Agreement.
          {application.agreementAcceptedDate && (
            <span className="block text-xs text-neutral-400">
              Accepted {formatDate(application.agreementAcceptedDate)}
            </span>
          )}
        </span>
      </label>

      <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
        <Button variant="primary" onClick={handleContinue} disabled={!checked}>
          Accept &amp; Continue
        </Button>
      </div>
    </Card>
  );
}
