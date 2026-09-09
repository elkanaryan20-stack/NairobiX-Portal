'use client';

import { useEffect, useState } from 'react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { mockOnboardingApplication, mockPartnerAssessment } from '@/lib/mock-data';
import type { OnboardingApplication, OnboardingStepId, PartnerAssessment } from '@/lib/types';
import { OnboardingProgress } from './_components/OnboardingProgress';
import {
  PartnerDetailsStep,
  BusinessInfoStep,
  LocationStep,
  ExperienceStep,
} from './_components/steps/DetailSteps';
import { DocumentsStep } from './_components/steps/DocumentsStep';
import { VerificationStep } from './_components/steps/VerificationStep';
import { AgreementStep } from './_components/steps/AgreementStep';
import { AssessmentStep } from './_components/steps/AssessmentStep';
import { ReviewStep } from './_components/steps/ReviewStep';
import { PaymentSetupStep } from './_components/steps/PaymentSetupStep';

const APPLICATION_KEY = 'nairobix-partner-onboarding';
const ASSESSMENT_KEY = 'nairobix-partner-assessment';

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
    // Ignore write failures (e.g. private browsing storage limits).
  }
}

const STEP_ORDER: OnboardingStepId[] = [
  'partner-details',
  'business-info',
  'location',
  'experience',
  'documents',
  'verification',
  'agreement',
  'assessment',
  'review',
  'payment-setup',
];

export default function PartnerOnboarding() {
  const [application, setApplication] = useState<OnboardingApplication>(mockOnboardingApplication);
  const [assessment, setAssessment] = useState<PartnerAssessment>(mockPartnerAssessment);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setApplication(loadFromStorage(APPLICATION_KEY, mockOnboardingApplication));
    setAssessment(loadFromStorage(ASSESSMENT_KEY, mockPartnerAssessment));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateApplication = (patch: Partial<OnboardingApplication>) => {
    setApplication((prev) => {
      const next: OnboardingApplication = {
        ...prev,
        ...patch,
        lastSavedDate: new Date().toISOString().slice(0, 10),
      };
      // Approval unlocks payment setup; nothing else can.
      if (patch.reviewStatus === 'approved') {
        next.steps = next.steps.map((s) =>
          s.id === 'payment-setup' && s.status === 'locked' ? { ...s, status: 'pending' } : s
        );
      }
      saveToStorage(APPLICATION_KEY, next);
      return next;
    });
  };

  const updateAssessment = (patch: Partial<PartnerAssessment>) => {
    setAssessment((prev) => {
      const next = { ...prev, ...patch };
      saveToStorage(ASSESSMENT_KEY, next);
      return next;
    });
  };

  const advanceFrom = (stepId: OnboardingStepId) => {
    const currentIndex = STEP_ORDER.indexOf(stepId);
    const nextId = STEP_ORDER[currentIndex + 1];

    setApplication((prev) => {
      const next: OnboardingApplication = {
        ...prev,
        steps: prev.steps.map((s) => {
          if (s.id === stepId) return { ...s, status: 'completed' };
          if (nextId && s.id === nextId && s.status === 'pending') return { ...s, status: 'in-progress' };
          return s;
        }),
        currentStepId: nextId ?? stepId,
        lastSavedDate: new Date().toISOString().slice(0, 10),
      };
      saveToStorage(APPLICATION_KEY, next);
      return next;
    });
  };

  const goToStep = (id: OnboardingStepId) => {
    const step = application.steps.find((s) => s.id === id);
    if (!step || (step.status !== 'completed' && step.status !== 'in-progress')) return;
    setApplication((prev) => ({ ...prev, currentStepId: id }));
  };

  if (!hydrated) return null;

  const stepProps = { application, updateApplication };

  return (
    <PartnerLayout
      pageTitle="Partner Onboarding"
      pageSubtitle="A guided, step-by-step path to becoming a full NairobiX partner"
    >
      <OnboardingProgress
        steps={application.steps}
        currentStepId={application.currentStepId}
        onSelectStep={goToStep}
      />

      {application.currentStepId === 'partner-details' && (
        <PartnerDetailsStep {...stepProps} onContinue={() => advanceFrom('partner-details')} />
      )}
      {application.currentStepId === 'business-info' && (
        <BusinessInfoStep {...stepProps} onContinue={() => advanceFrom('business-info')} />
      )}
      {application.currentStepId === 'location' && (
        <LocationStep {...stepProps} onContinue={() => advanceFrom('location')} />
      )}
      {application.currentStepId === 'experience' && (
        <ExperienceStep {...stepProps} onContinue={() => advanceFrom('experience')} />
      )}
      {application.currentStepId === 'documents' && (
        <DocumentsStep {...stepProps} onContinue={() => advanceFrom('documents')} />
      )}
      {application.currentStepId === 'verification' && (
        <VerificationStep application={application} onContinue={() => advanceFrom('verification')} />
      )}
      {application.currentStepId === 'agreement' && (
        <AgreementStep {...stepProps} onContinue={() => advanceFrom('agreement')} />
      )}
      {application.currentStepId === 'assessment' && (
        <AssessmentStep
          assessment={assessment}
          updateAssessment={updateAssessment}
          onContinue={() => advanceFrom('assessment')}
        />
      )}
      {application.currentStepId === 'review' && (
        <ReviewStep {...stepProps} onContinue={() => advanceFrom('review')} />
      )}
      {application.currentStepId === 'payment-setup' && (
        <PaymentSetupStep application={application} updateApplication={updateApplication} />
      )}
    </PartnerLayout>
  );
}
