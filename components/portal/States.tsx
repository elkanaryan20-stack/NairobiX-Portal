'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Inbox, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Portal state system. Four deliberately different treatments:
 *
 *   EmptyState         records could exist, none do yet        solid, quiet panel
 *   NotYetAvailable    capability/data not published yet       dashed + clock (components/portal/NotYetAvailable.tsx)
 *   SectionError       we couldn't load this information       red-tinted, retry
 *   AllClear           nothing needs the person's action       positive, emerald
 *
 * Loading is handled by skeletons (app/portal/loading.tsx).
 */

interface StateAction {
  label: string;
  href: string;
}

function ActionLink({ action }: { action: StateAction }) {
  const external = /^(mailto:|https:)/.test(action.href);
  const className = 'mt-3 inline-flex text-sm font-medium text-primary hover:text-primary-300';
  return external ? (
    <a href={action.href} className={className}>
      {action.label}
    </a>
  ) : (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: StateAction;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface',
        compact ? 'flex items-start gap-3 p-4' : 'flex flex-col items-center px-6 py-12 text-center'
      )}
    >
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-fg-tertiary [&>svg]:h-4 [&>svg]:w-4',
          compact ? 'h-9 w-9' : 'mb-4 h-11 w-11'
        )}
      >
        {icon ?? <Inbox />}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className={cn('text-sm text-fg-tertiary', compact ? 'mt-0.5' : 'mx-auto mt-1 max-w-sm')}>{description}</p>
        {action && <ActionLink action={action} />}
      </div>
    </div>
  );
}

export function SectionError({ what, compact = true }: { what: string; compact?: boolean }) {
  const router = useRouter();
  return (
    <div
      role="alert"
      className={cn(
        'rounded-card border border-red-500/20 bg-red-500/[0.05]',
        compact ? 'flex items-start gap-3 p-4' : 'flex flex-col items-center px-6 py-12 text-center'
      )}
    >
      <div className={cn('flex flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-300', compact ? 'h-9 w-9' : 'mb-4 h-11 w-11')}>
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fg">We couldn&apos;t load {what}</p>
        <p className="mt-0.5 text-sm text-fg-tertiary">NairobiX records are temporarily unavailable. Nothing has changed with your account.</p>
        <button
          onClick={() => router.refresh()}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-fg-secondary hover:text-fg"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}

export function AllClear({ title = 'All caught up', description }: { title?: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="mt-0.5 text-sm text-fg-tertiary">{description}</p>
      </div>
    </div>
  );
}
