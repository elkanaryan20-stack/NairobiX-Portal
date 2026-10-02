'use client';

import { RefreshCw, ShieldAlert } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';

/**
 * A Portal page whose CRM data could not be loaded. Nothing partial or
 * cached-from-elsewhere is shown in its place.
 */
export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <PortalLayout pageTitle="Temporarily unavailable" pageSubtitle="We couldn't load this information right now">
      <div className="card mx-auto mt-6 max-w-lg p-8 text-center md:p-10">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <h3 className="mb-2 font-serif text-2xl font-medium">This information can&apos;t be loaded</h3>
        <p className="mb-7 text-sm leading-relaxed text-fg-tertiary">
          NairobiX records are temporarily unavailable. Please try again in a few minutes.
        </p>
        <button onClick={reset} className="btn btn-primary">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </PortalLayout>
  );
}
