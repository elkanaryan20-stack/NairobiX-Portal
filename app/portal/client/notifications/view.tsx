'use client';

import Link from 'next/link';
import { Bell, Briefcase, ChevronRight, CreditCard, FileSignature, FileText, FolderOpen, LifeBuoy, Rocket, CalendarClock } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { EmptyState, SectionError } from '@/components/portal/States';
import type { AgendaItem, AgendaKind } from '@/lib/portal-data/client-agenda';

const KIND_ICON: Record<AgendaKind, React.ReactNode> = {
  invoice: <CreditCard size={15} />,
  signature: <FileSignature size={15} />,
  proposal: <FileText size={15} />,
  engagement: <Briefcase size={15} />,
  onboarding: <Rocket size={15} />,
  meeting: <CalendarClock size={15} />,
  request: <LifeBuoy size={15} />,
  document: <FolderOpen size={15} />,
};

function monthLabel(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function dayLabel(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/**
 * Updates on the client's account, derived from dated CRM records. There is
 * no read/unread state because nothing stores it — the feed never implies
 * activity that didn't happen.
 */
export function ClientNotificationsView({ updates, complete }: { updates: AgendaItem[]; complete: boolean }) {
  const groups: { month: string; items: AgendaItem[] }[] = [];
  for (const item of updates) {
    const month = item.date ? monthLabel(item.date) : 'Earlier';
    const last = groups[groups.length - 1];
    if (last?.month === month) last.items.push(item);
    else groups.push({ month, items: [item] });
  }

  return (
    <PortalLayout pageTitle="Updates" pageSubtitle="Recent activity on your NairobiX account">
      {!complete && (
        <div className="mb-6">
          <SectionError what="every update on your account" />
        </div>
      )}

      {updates.length === 0 && complete && (
        <EmptyState
          icon={<Bell />}
          title="Nothing new"
          description="Invoices, documents, support requests and engagement updates on your account will appear here as they happen."
        />
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.month}>
            <h3 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">{group.month}</h3>
            <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {group.items.map((item) => {
                const row = (
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-fg-tertiary">
                      {KIND_ICON[item.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg">{item.title}</p>
                      <p className="truncate text-[13px] text-fg-tertiary">{item.detail}</p>
                    </div>
                    {item.date && <span className="flex-shrink-0 text-xs text-fg-tertiary">{dayLabel(item.date)}</span>}
                    {item.href && <ChevronRight size={15} className="flex-shrink-0 text-fg-tertiary" />}
                  </div>
                );
                return item.href ? (
                  <Link key={item.id} href={item.href} className="block transition-colors hover:bg-white/[0.02]">
                    {row}
                  </Link>
                ) : (
                  <div key={item.id}>{row}</div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PortalLayout>
  );
}
