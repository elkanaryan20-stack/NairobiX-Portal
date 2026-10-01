import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { GatewayCard, GatewayFrame } from '@/components/portal/GatewayFrame';
import { SignInForm } from '@/components/portal/SignInForm';
import { getCurrentAccess, safeReturnPath } from '@/lib/access/server';
import { getIdentityProvider } from '@/lib/auth/provider';

export const metadata: Metadata = {
  title: 'Sign in · NairobiX Portal',
  robots: { index: false },
};

const ERRORS: Record<string, string> = {
  invalid: 'Enter a valid email address to continue.',
  unavailable: 'Sign-in is temporarily unavailable. Please try again later.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);

  // Already signed in: the Portal decides what this identity can see.
  const access = await getCurrentAccess();
  if (access.state !== 'unauthenticated') redirect(next);

  const provider = getIdentityProvider();
  const error = params.error ? ERRORS[params.error] : undefined;

  return (
    <GatewayFrame>
      <div className="w-full">
        <GatewayCard>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-primary-400">NairobiX Portal</p>
          <h1 className="mb-2 font-serif text-3xl font-medium tracking-tight text-white">Sign in to NairobiX</h1>
          <p className="mb-8 text-sm leading-relaxed text-neutral-400">
            Use the email address associated with your NairobiX relationship.
          </p>

          {provider ? (
            <SignInForm next={next} error={error} />
          ) : (
            <p className="rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-neutral-300">
              Sign-in is not available yet. Please contact your NairobiX representative.
            </p>
          )}

          {provider && !provider.verifiesEmail && (
            <p className="mt-6 rounded-sm border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5 text-xs leading-relaxed text-amber-200/80">
              Development sign-in: email ownership is not verified in this environment. Connect an identity provider
              before deploying.
            </p>
          )}

          <div className="mt-8 flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-neutral-500">
            <Lock className="h-3.5 w-3.5 flex-shrink-0" />
            Access is restricted to authorized NairobiX users.
          </div>
        </GatewayCard>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </div>
    </GatewayFrame>
  );
}
