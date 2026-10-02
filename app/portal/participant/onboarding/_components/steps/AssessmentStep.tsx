'use client';

import { useMemo, useState } from 'react';
import { ClipboardCheck, ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Card';
import { Textarea, Alert } from '@/components/ui/Form';
import { formatDate, cn } from '@/lib/utils';
import type { AssessmentQuestion, AssessmentResponse, PartnerAssessment } from '@/lib/types';

interface AssessmentStepProps {
  questions: AssessmentQuestion[];
  assessment: PartnerAssessment;
  updateAssessment: (patch: Partial<PartnerAssessment>) => void;
  onContinue: () => void;
}

const CATEGORIES = ['Experience', 'Network & Reach', 'Service Capability', 'NairobiX Fit'] as const;

export function AssessmentStep({ questions, assessment, updateAssessment, onContinue }: AssessmentStepProps) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>(() =>
    Object.fromEntries(assessment.responses.map((r) => [r.questionId, r.value]))
  );

  const isSubmitted = assessment.status === 'submitted' || assessment.status === 'reviewed';
  const category = CATEGORIES[categoryIndex];
  const questionsInCategory = useMemo(
    () => questions.filter((q) => q.category === category),
    [questions, category]
  );
  const isLastCategory = categoryIndex === CATEGORIES.length - 1;
  const categoryAnswered = questionsInCategory.every((q) => {
    const v = responses[q.id];
    return v !== undefined && v !== '';
  });

  const setResponse = (questionId: string, value: string | number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const persistProgress = () => {
    const list: AssessmentResponse[] = Object.entries(responses).map(([questionId, value]) => ({
      questionId,
      value,
    }));
    updateAssessment({ responses: list, status: 'in-progress' });
  };

  const handleNext = () => {
    persistProgress();
    if (isLastCategory) {
      const list: AssessmentResponse[] = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value,
      }));
      updateAssessment({
        responses: list,
        status: 'submitted',
        submittedDate: new Date().toISOString().slice(0, 10),
      });
    } else {
      setCategoryIndex((i) => i + 1);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-6">
        <div className="mb-2 flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/[0.06] text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-fg">Partner Assessment</h3>
            <p className="text-sm text-fg-tertiary">Your responses have been submitted.</p>
          </div>
        </div>
        <Alert
          type="success"
          title="Assessment submitted for review"
          description={`Submitted ${assessment.submittedDate ? formatDate(assessment.submittedDate) : 'recently'}. A NairobiX team member will review your responses alongside your application — you don't need to do anything further here.`}
        />
        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <Button variant="primary" onClick={onContinue}>
            Continue to Review
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary">
            <ClipboardCheck size={18} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-fg">Partner Assessment</h3>
            <p className="text-sm text-fg-tertiary">
              A short qualification review — not a test. Answer honestly; NairobiX staff use this to
              match you with the right opportunities.
            </p>
          </div>
        </div>
        <Badge variant="neutral">
          {categoryIndex + 1} of {CATEGORIES.length}
        </Badge>
      </div>

      <div className="mb-5 flex gap-1.5">
        {CATEGORIES.map((c, i) => (
          <div
            key={c}
            className={cn(
              'h-1 flex-1 rounded-full',
              i <= categoryIndex ? 'bg-primary' : 'bg-white/10'
            )}
          />
        ))}
      </div>

      <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">{category}</h4>

      <div className="space-y-6">
        {questionsInCategory.map((q) => (
          <div key={q.id}>
            <p className="mb-1 font-medium text-fg">{q.question}</p>
            {q.helperText && <p className="mb-2.5 text-xs text-fg-tertiary">{q.helperText}</p>}

            {q.type === 'scale' && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setResponse(q.id, n)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                      responses[q.id] === n
                        ? 'border-primary bg-primary text-canvas'
                        : 'border-line text-fg-secondary hover:border-line-strong'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'choice' && (
              <div className="flex flex-wrap gap-2">
                {q.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setResponse(q.id, opt)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      responses[q.id] === opt
                        ? 'border-primary bg-primary/10 text-primary-400'
                        : 'border-line text-fg-secondary hover:border-line-strong'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'text' && (
              <Textarea
                rows={3}
                value={(responses[q.id] as string) ?? ''}
                onChange={(e) => setResponse(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        <Button
          variant="ghost"
          icon={<ChevronLeft size={15} />}
          onClick={() => setCategoryIndex((i) => Math.max(0, i - 1))}
          disabled={categoryIndex === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          rightIcon={isLastCategory ? <Send size={15} /> : <ChevronRight size={15} />}
          onClick={handleNext}
          disabled={!categoryAnswered}
        >
          {isLastCategory ? 'Submit Assessment' : 'Next Category'}
        </Button>
      </div>
    </Card>
  );
}
