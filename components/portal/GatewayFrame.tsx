import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';

/**
 * Dark, full-bleed surface shared by the Portal entry, sign-in and access
 * state screens — everything a person sees before the authenticated shell.
 */
export function GatewayFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/landing/portal-office.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/75 to-ink-950/95" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-300">NairobiX</span>
        </Link>
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          <Lock className="h-3 w-3" strokeWidth={2} />
          Secure access
        </span>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-5 py-10 md:px-10">{children}</main>

      <footer className="relative z-10 flex flex-col gap-1 px-5 py-6 text-xs text-neutral-600 md:flex-row md:items-center md:justify-between md:px-10">
        <p>NairobiX &middot; Business Growth Systems</p>
        <p>NairobiX &copy; {new Date().getFullYear()}. All rights reserved.</p>
      </footer>
    </div>
  );
}

/** Restrained dark card used for sign-in and access states. */
export function GatewayCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-up mx-auto w-full max-w-md rounded-md border border-white/10 bg-ink-900/80 p-7 shadow-xl backdrop-blur-sm md:p-9">
      {children}
    </div>
  );
}
