import Link from 'next/link';
import { ArrowRight, Fingerprint, KeyRound, LayoutGrid, Lock } from 'lucide-react';
import { GatewayFrame } from '@/components/portal/GatewayFrame';

/**
 * NairobiX Portal entry. One Portal, one way in: people sign in and the
 * Portal determines their NairobiX relationship. Nobody is asked to choose
 * Client, Partner or Staff.
 */
export default function PortalEntry() {
  return (
    <GatewayFrame>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <section>
          <p className="animate-fade-up mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <span className="h-px w-8 bg-primary/60" />
            NairobiX Portal
          </p>

          <h1
            className="animate-fade-up mb-6 max-w-xl font-serif text-[2.6rem] font-medium leading-[1.08] tracking-tight text-fg [animation-delay:80ms] md:text-6xl"
            style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
          >
            One secure workspace for your relationship with NairobiX.
          </h1>

          <p className="animate-fade-up mb-10 max-w-lg text-base font-light leading-relaxed text-fg-secondary [animation-delay:160ms] md:text-lg">
            Access your authorized NairobiX services, engagements, resources and business relationship from one
            secure environment.
          </p>

          <div className="animate-fade-up flex flex-col items-start gap-5 [animation-delay:240ms] sm:flex-row sm:items-center sm:gap-7">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98]"
            >
              Sign in to NairobiX
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <p className="flex items-center gap-2 text-sm text-fg-tertiary">
              <Lock className="h-3.5 w-3.5 flex-shrink-0" />
              Access is restricted to authorized NairobiX users.
            </p>
          </div>
        </section>

        <AccessFlow />
      </div>
    </GatewayFrame>
  );
}

const ACCESS_STEPS = [
  {
    icon: <Fingerprint className="h-4 w-4" />,
    title: 'Verified identity',
    detail: 'You sign in once with your NairobiX account.',
  },
  {
    icon: <KeyRound className="h-4 w-4" />,
    title: 'Relationship recognised',
    detail: 'Your authorized relationship with NairobiX is resolved securely on our side.',
  },
  {
    icon: <LayoutGrid className="h-4 w-4" />,
    title: 'Your workspace',
    detail: 'Only the services, engagements and resources you are authorized for.',
  },
];

/** Explains how access works — without ever asking the visitor who they are. */
function AccessFlow() {
  return (
    <aside
      aria-label="How Portal access works"
      className="animate-fade-up rounded-card border border-line bg-surface p-6 [animation-delay:320ms] md:p-8"
    >
      <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">How access works</p>
      <ol className="relative space-y-7">
        <span className="absolute bottom-3 left-[17px] top-3 w-px bg-line" aria-hidden />
        {ACCESS_STEPS.map((step, index) => {
          const isLast = index === ACCESS_STEPS.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4">
              <span
                className={
                  isLast
                    ? 'relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary'
                    : 'relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-tertiary'
                }
              >
                {step.icon}
              </span>
              <div className="pt-1.5">
                <p className="text-sm font-medium text-fg">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-tertiary">{step.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
