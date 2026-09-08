'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, HeartHandshake, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-ink-950 overflow-hidden">
      {/* Ambient background photography */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing/hero-skyline.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.16]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/95 to-ink-950" />
        <div className="absolute inset-0 bg-grain mix-blend-overlay opacity-[0.03]" />
      </div>

      <div className="relative flex flex-col items-center px-6 py-16 md:py-24">
        {/* Wordmark */}
        <div className="animate-fade-up mb-16 flex items-center gap-2 md:mb-20">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
            NairobiX
          </span>
        </div>

        {/* Header */}
        <div className="mb-16 max-w-2xl text-center md:mb-20">
          <h1
            className="animate-fade-up mb-6 font-serif text-5xl font-medium tracking-tight text-white [animation-delay:80ms] md:text-6xl"
            style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
          >
            Your growth workspace,
            <br />
            engineered.
          </h1>
          <p className="animate-fade-up text-lg font-light text-neutral-400 [animation-delay:160ms] md:text-xl">
            One connected system for your growth partnership, referral network and internal operations.
          </p>
        </div>

        {/* Workspace Cards */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
          <WorkspaceCard
            index={0}
            title="Client"
            subtitle="Growth Workspace"
            description="Track your growth partnership, performance and projects in one place."
            href="/client"
            image="/images/landing/client-card.jpg"
            icon={<TrendingUp className="h-5 w-5" strokeWidth={1.75} />}
          />
          <WorkspaceCard
            index={1}
            title="Partner"
            subtitle="Partner Workspace"
            description="Manage referrals, opportunities, commissions and partner benefits."
            href="/partner"
            image="/images/landing/partner-card.jpg"
            icon={<HeartHandshake className="h-5 w-5" strokeWidth={1.75} />}
          />
          <WorkspaceCard
            index={2}
            title="Staff"
            subtitle="Command Center"
            description="Oversee clients, partners, projects and NairobiX operations."
            href="/staff"
            image="/images/landing/staff-card.jpg"
            icon={<ShieldCheck className="h-5 w-5" strokeWidth={1.75} />}
          />
        </div>

        {/* Footer */}
        <div className="animate-fade-in mt-20 text-center text-sm text-neutral-600 [animation-delay:400ms] md:mt-24">
          <p>Premium business growth &amp; digital transformation platform</p>
          <p className="mt-1.5">NairobiX &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

interface WorkspaceCardProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  icon: React.ReactNode;
}

function WorkspaceCard({ index, title, subtitle, description, href, image, icon }: WorkspaceCardProps) {
  return (
    <Link
      href={href}
      className="animate-fade-up group relative block h-[420px] overflow-hidden rounded-md border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-[460px]"
      style={{ animationDelay: `${240 + index * 90}ms` }}
    >
      {/* Photography */}
      <Image
        src={image}
        alt=""
        fill
        className="object-cover object-center transition-transform duration-700 ease-smooth group-hover:scale-[1.06]"
        sizes="(min-width: 768px) 33vw, 100vw"
      />

      {/* Overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/55" />
      <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-primary/60 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-7">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {title}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm">
            {icon}
          </span>
        </div>

        <h3 className="mb-2 font-serif text-2xl font-medium text-white">{subtitle}</h3>
        <p className="mb-6 text-sm leading-relaxed text-neutral-300">{description}</p>

        <div className="flex items-center gap-1.5 text-sm font-medium text-primary-400">
          <span>Enter workspace</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
