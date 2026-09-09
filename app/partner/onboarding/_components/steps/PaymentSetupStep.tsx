'use client';

import { useState } from 'react';
import { Lock, Wallet, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import type { OnboardingApplication } from '@/lib/types';

interface PaymentSetupStepProps {
  application: OnboardingApplication;
  updateApplication: (patch: Partial<OnboardingApplication>) => void;
}

export function PaymentSetupStep({ application, updateApplication }: PaymentSetupStepProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const isUnlocked = application.reviewStatus === 'approved';

  if (!isUnlocked) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <Lock size={20} />
          </div>
          <h3 className="mb-1.5 text-lg font-semibold text-neutral-900">Payment &amp; Commission Setup</h3>
          <p className="max-w-sm text-sm text-neutral-500">
            This step unlocks once your application is approved by NairobiX. Complete Review &amp;
            Approval to check your current status.
          </p>
        </div>
      </Card>
    );
  }

  if (application.paymentSetupComplete) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="mb-1.5 text-lg font-semibold text-neutral-900">You&rsquo;re all set!</h3>
          <p className="max-w-sm text-sm text-neutral-500">
            Your payment details are on file. Welcome to the NairobiX Partner Program.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Wallet size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Payment &amp; Commission Setup</h3>
          <p className="text-sm text-neutral-500">Congratulations — add your payout details to finish onboarding.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-900">Bank name</label>
          <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Equity Bank" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-900">Account number</label>
          <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" />
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
        <Button
          variant="primary"
          disabled={!bankName || !accountNumber}
          onClick={() => updateApplication({ paymentSetupComplete: true })}
        >
          Complete Onboarding
        </Button>
      </div>
    </Card>
  );
}
