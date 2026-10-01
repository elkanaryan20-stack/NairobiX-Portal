'use client';

import { useRef } from 'react';
import { FileUp, FileCheck2, Upload } from 'lucide-react';
import { Card, Button, StatusBadge } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { OnboardingApplication, OnboardingDocument } from '@/lib/types';

interface DocumentsStepProps {
  application: OnboardingApplication;
  updateApplication: (patch: Partial<OnboardingApplication>) => void;
  onContinue: () => void;
}

const requirementLabel: Record<OnboardingDocument['requirement'], string> = {
  id: 'Identification',
  'business-registration': 'Business Registration',
  portfolio: 'Portfolio',
  cv: 'CV / Resume',
  other: 'Other',
};

export function DocumentsStep({ application, updateApplication, onContinue }: DocumentsStepProps) {
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const allUploaded = application.documents.every((d) => d.status !== 'not-uploaded');

  const handleUpload = (docId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    updateApplication({
      documents: application.documents.map((d) =>
        d.id === docId ? { ...d, status: 'uploaded', uploadedDate: today } : d
      ),
    });
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <FileUp size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Supporting Documents</h3>
          <p className="text-sm text-neutral-500">
            Upload the documents NairobiX needs to verify your business.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {application.documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-neutral-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <FileCheck2 size={16} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">{doc.name}</p>
                <p className="text-xs text-neutral-500">
                  {requirementLabel[doc.requirement]}
                  {doc.uploadedDate ? ` · Uploaded ${formatDate(doc.uploadedDate)}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={doc.status} />
              {doc.status === 'not-uploaded' && (
                <>
                  <input
                    ref={(el) => {
                      fileInputs.current[doc.id] = el;
                    }}
                    type="file"
                    className="hidden"
                    onChange={() => handleUpload(doc.id)}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Upload size={14} />}
                    onClick={() => fileInputs.current[doc.id]?.click()}
                  >
                    Upload
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
        <Button variant="primary" onClick={onContinue} disabled={!allUploaded}>
          Save &amp; Continue
        </Button>
      </div>
    </Card>
  );
}
