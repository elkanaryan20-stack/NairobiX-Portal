'use client';

import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { usePortalSession } from '@/components/portal/PortalSession';

/** Rendered (URL unchanged) when an authorized user opens a module outside their permissions. */
export default function RestrictedModule() {
  const { navigation } = usePortalSession();
  const home = navigation[0]?.href;

  return (
    <PortalLayout pageTitle="Not available" pageSubtitle="This area isn't part of your NairobiX access">
      <div className="card mx-auto mt-6 max-w-lg p-8 text-center md:p-10">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <h3 className="mb-2 font-serif text-2xl font-medium">This area isn&apos;t available to you</h3>
        <p className="mb-7 text-sm leading-relaxed text-fg-tertiary">
          Your Portal shows the modules associated with your NairobiX relationship. If you need access to this area,
          contact your NairobiX representative.
        </p>
        {home && (
          <Link href={home} className="btn btn-primary">
            Return to your Portal
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </PortalLayout>
  );
}
