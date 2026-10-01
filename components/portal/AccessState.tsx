import { Lock, LogOut, Mail, MailWarning, ShieldAlert } from 'lucide-react';
import { GatewayCard, GatewayFrame } from '@/components/portal/GatewayFrame';
import { signOut } from '@/lib/auth/actions';
import type { AccessResult } from '@/lib/access/types';

// Where people without access are sent for help. Confirm the address before launch.
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_NAIROBIX_SUPPORT_EMAIL ?? 'support@nairobix.com';

type DeniedState = Exclude<AccessResult, { state: 'authorized' } | { state: 'unauthenticated' }>;

// User-facing copy deliberately doesn't say *why* (no Contact, Lead only, no
// Relationship…) so the Portal never discloses what NairobiX's CRM holds.
const COPY: Record<DeniedState['state'], { icon: React.ReactNode; title: string; body: string; hint: string }> = {
  'no-access': {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: 'No active Portal access',
    body: 'Your account has been authenticated, but no active NairobiX Portal access is associated with this account.',
    hint: 'If you work with NairobiX and expected access, contact us and we’ll review it.',
  },
  suspended: {
    icon: <Lock className="h-5 w-5" />,
    title: 'Access unavailable',
    body: 'Portal access for this account is currently unavailable.',
    hint: 'If you believe this is a mistake, contact NairobiX.',
  },
  unavailable: {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: 'Access can’t be confirmed right now',
    body: 'We couldn’t confirm your NairobiX Portal access at the moment, so access is paused for your security.',
    hint: 'Please try again in a few minutes. If this continues, contact NairobiX.',
  },
  unverified: {
    icon: <MailWarning className="h-5 w-5" />,
    title: 'Verify your email address',
    body: 'You’re signed in, but your email address hasn’t been verified yet.',
    hint: 'Verify it with your sign-in provider, then sign in again.',
  },
};

export function AccessState({ access }: { access: DeniedState }) {
  const copy = COPY[access.state];

  return (
    <GatewayFrame>
      <div className="w-full">
        <GatewayCard>
          <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary-400">
            {copy.icon}
          </span>
          <h1 className="mb-3 font-serif text-3xl font-medium tracking-tight text-white">{copy.title}</h1>
          <p className="mb-3 text-sm leading-relaxed text-neutral-300">{copy.body}</p>
          <p className="mb-8 text-sm leading-relaxed text-neutral-500">{copy.hint}</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('NairobiX Portal access')}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              <Mail className="h-4 w-4" />
              Contact NairobiX
            </a>
            <form action={signOut} className="flex-1">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/15 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <LogOut className="h-4 w-4" />
                Use another account
              </button>
            </form>
          </div>

          <p className="mt-7 border-t border-white/10 pt-5 text-xs text-neutral-500">
            Signed in as <span className="text-neutral-300">{access.email}</span>
          </p>
        </GatewayCard>
      </div>
    </GatewayFrame>
  );
}
