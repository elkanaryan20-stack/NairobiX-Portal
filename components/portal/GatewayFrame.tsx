import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';

/**
 * Dark, full-bleed surface shared by the Portal entry, sign-in and access
 * state screens — everything a person sees before the authenticated shell.
 */
export function GatewayFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas text-fg">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/landing/portal-office.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-canvas/75" />
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-line bg-canvas/80 px-5 py-5 backdrop-blur-xl md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[15px] font-semibold tracking-tight text-fg">NairobiX</span>
        </Link>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          <Lock className="h-3 w-3" strokeWidth={2} />
          Secure access
        </span>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-5 py-10 md:px-10">{children}</main>

      <footer className="relative z-10 flex flex-col gap-1 border-t border-line px-5 py-6 text-xs text-fg-tertiary md:flex-row md:items-center md:justify-between md:px-10">
        <p>NairobiX &middot; Business Growth Systems</p>
        <p>NairobiX &copy; {new Date().getFullYear()}. All rights reserved.</p>
      </footer>
    </div>
  );
}

/** Restrained dark card used for sign-in and access states. */
export function GatewayCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-up mx-auto w-full max-w-md rounded-card border border-line bg-surface p-7 md:p-9">
      {children}
    </div>
  );
}
