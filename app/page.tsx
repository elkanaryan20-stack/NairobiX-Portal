'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-20 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          NairobiX Portal
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300 font-light">
          Your growth. Your systems. One connected workspace.
        </p>
      </div>

      {/* Workspace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Client Card */}
        <WorkspaceCard
          title="CLIENT"
          subtitle="Growth Workspace"
          description="Manage your growth partnership, performance, projects, insights and resources."
          href="/client"
          accentColor="from-blue-600 to-blue-700"
          icon="📈"
        />

        {/* Partner Card */}
        <WorkspaceCard
          title="PARTNER"
          subtitle="Partner Workspace"
          description="Manage referrals, opportunities, commissions, resources and partner benefits."
          href="/partner"
          accentColor="from-emerald-600 to-emerald-700"
          icon="🤝"
        />

        {/* Staff Card */}
        <WorkspaceCard
          title="STAFF"
          subtitle="Command Center"
          description="Manage clients, partners, projects and NairobiX operations."
          href="/staff"
          accentColor="from-violet-600 to-violet-700"
          icon="⚙️"
        />
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-neutral-500 text-sm">
        <p>Premium business growth & digital transformation platform</p>
        <p className="mt-2">NairobiX © 2024. All rights reserved.</p>
      </div>
    </div>
  );
}

interface WorkspaceCardProps {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accentColor: string;
  icon: string;
}

function WorkspaceCard({
  title,
  subtitle,
  description,
  href,
  accentColor,
  icon,
}: WorkspaceCardProps) {
  return (
    <Link href={href}>
      <div className="group h-full cursor-pointer">
        {/* Card Container */}
        <div className="h-full bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${accentColor} h-32 flex items-end justify-center pb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
            </div>
            <div className="text-5xl">{icon}</div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <div className="inline-block px-3 py-1 bg-neutral-700 rounded-full text-xs font-medium text-neutral-300 mb-3">
                {title}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">{subtitle}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex items-center text-primary font-medium group-hover:gap-2 transition-all">
              <span>Access Workspace</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
