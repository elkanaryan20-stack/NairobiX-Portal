import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Lock, MailCheck } from 'lucide-react';
import { GatewayCard, GatewayFrame } from '@/components/portal/GatewayFrame';
import { SignInForm } from '@/components/portal/SignInForm';
import { VerifyCodeForm } from '@/components/portal/VerifyCodeForm';
import { getCurrentAccess, safeReturnPath } from '@/lib/access/server';
import { getIdentityProvider } from '@/lib/auth/provider';
import { readPendingLogin } from '@/lib/auth/session-cookies';

export const metadata: Metadata = {
  title: 'Sign in · NairobiX Portal',
  robots: { index: false },
};

const ERRORS: Record<string, string> = {
  invalid: 'Enter a valid email address to continue.',
  unavailable: 'Sign-in is temporarily unavailable. Please try again later.',
  send: 'We couldn’t send your sign-in email just now. Please wait a moment and try again.',
  code: 'That code is invalid or has expired. Check the latest email, or request a new code.',
  link: 'That sign-in link is invalid or has expired. Enter your email to receive a new one.',
  expired: 'Your sign-in request expired. Enter your email to receive a new code.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; step?: string }>;
}) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);

  // Already signed in: the Portal decides what this identity can see.
  const access = await getCurrentAccess();
  if (access.state !== 'unauthenticated') redirect(next);

  const provider = getIdentityProvider();
  const error = params.error ? ERRORS[params.error] : undefined;
  const pending = params.step === 'code' ? await readPendingLogin() : null;

  return (
    <GatewayFrame>
      <div className="w-full">
        <GatewayCard>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-primary-400">NairobiX Portal</p>

          {provider && pending ? (
            <>
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary-400">
                <MailCheck className="h-5 w-5" />
              </span>
              <h1 className="mb-2 font-serif text-3xl font-medium tracking-tight text-white">Check your email</h1>
              <p className="mb-8 text-sm leading-relaxed text-neutral-400">
                We sent a sign-in link and code to <span className="text-neutral-200">{pending.email}</span>. Open the
                link, or enter the code below.
              </p>
              <VerifyCodeForm error={error} />
              <p className="mt-5 text-center text-xs text-neutral-500">
                Wrong address or no email?{' '}
                <Link href={`/login?next=${encodeURIComponent(pending.next)}`} className="text-neutral-300 underline-offset-2 hover:underline">
                  Start again
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 font-serif text-3xl font-medium tracking-tight text-white">Sign in to NairobiX</h1>
              <p className="mb-8 text-sm leading-relaxed text-neutral-400">
                Use the email address associated with your NairobiX relationship. We&apos;ll email you a secure sign-in
                link — no password needed.
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
                  Development sign-in: email ownership is not verified in this environment. Configure Supabase Auth
                  before deploying.
                </p>
              )}
            </>
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
