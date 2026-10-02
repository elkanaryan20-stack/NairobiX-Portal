'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDot,
  CreditCard,
  FileSignature,
  FileText,
  FolderOpen,
  LifeBuoy,
  Mail,
  Plus,
  Rocket,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { AllClear, EmptyState, SectionError } from '@/components/portal/States';
import { StatusBadge } from '@/components/ui/Card';
import { MetricCard, ProgressBar } from '@/components/ui/Form';
import { cn, formatDate } from '@/lib/utils';
import type { AgendaItem, AgendaKind } from '@/lib/portal-data/client-agenda';
import type {
  ClientOnboardingView,
  ClientProfileView,
  ClientServiceView,
  Loaded,
} from '@/lib/portal-data/client';
import type { GrowthPhase, Invoice, PerformanceMetric, Project, ServiceRequest } from '@/lib/types';

type ProjectRow = Project & { stageLabel?: string; typeLabel?: string };

export interface ClientOverviewProps {
  profile: ClientProfileView;
  projects: Loaded<ProjectRow[]>;
  onboarding: Loaded<ClientOnboardingView[]>;
  services: Loaded<ClientServiceView[]>;
  attention: AgendaItem[];
  attentionComplete: boolean;
  upcoming: AgendaItem[];
  upcomingComplete: boolean;
  requests: Loaded<ServiceRequest[]>;
  documentCount: number | null;
  invoices: Loaded<Invoice[]>;
  metrics: PerformanceMetric[];
  growthPhases: GrowthPhase[];
  reportCount: number;
  supportEmail: string;
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function Section({
  title,
  link,
  children,
  className,
}: {
  title: string;
  link?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">{title}</h3>
        {link && (
          <Link href={link.href} className="inline-flex items-center gap-1 text-xs font-medium text-fg-secondary hover:text-fg">
            {link.label}
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

const KIND_ICON: Record<AgendaKind, React.ReactNode> = {
  invoice: <CreditCard />,
  signature: <FileSignature />,
  proposal: <FileText />,
  engagement: <Briefcase />,
  onboarding: <Rocket />,
  meeting: <CalendarClock />,
  request: <LifeBuoy />,
  document: <FolderOpen />,
};

/** Dates are rendered in Nairobi time so server and browser agree. */
function formatAgendaDate(value: string): string {
  const hasTime = value.length > 10;
  const date = hasTime ? new Date(value) : new Date(`${value}T00:00:00Z`);
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(hasTime ? { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' } : { timeZone: 'UTC' }),
  });
}

function AgendaRow({ item, tone }: { item: AgendaItem; tone: 'attention' | 'neutral' }) {
  const body = (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border [&>svg]:h-3.5 [&>svg]:w-3.5',
          tone === 'attention' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-line bg-white/[0.03] text-fg-tertiary'
        )}
      >
        {KIND_ICON[item.kind]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{item.title}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-fg-tertiary">{item.detail}</p>
        {item.actionLabel && <p className="mt-1.5 text-xs font-medium text-primary">{item.actionLabel}</p>}
      </div>
      {item.date && (
        <div className="flex-shrink-0 text-right">
          {item.dateLabel && <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg-tertiary">{item.dateLabel}</p>}
          <p className="mt-0.5 whitespace-nowrap text-xs font-medium text-fg-secondary">{formatAgendaDate(item.date)}</p>
        </div>
      )}
    </div>
  );
  return item.href ? (
    <Link href={item.href} className="block transition-colors hover:bg-white/[0.02]">
      {body}
    </Link>
  ) : (
    body
  );
}

function AgendaList({ items, tone }: { items: AgendaItem[]; tone: 'attention' | 'neutral' }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {items.map((item) => (
        <AgendaRow key={item.id} item={item} tone={tone} />
      ))}
    </div>
  );
}

function StatusTile({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: string | number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
    >
      <p className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-fg-tertiary sm:text-[10px]">{label}</p>
      <p className={cn('mt-1.5 text-xl font-medium tabular-nums', highlight ? 'text-primary' : 'text-fg')}>{value}</p>
    </Link>
  );
}

function CheckRow({ label, state }: { label: string; state: 'done' | 'progress' | 'pending' | 'unknown'; detail?: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2.5 text-sm text-fg-secondary">
        {state === 'done' ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : state === 'progress' ? (
          <CircleDot size={16} className="text-primary" />
        ) : (
          <Circle size={16} className="text-fg-tertiary" />
        )}
        {label}
      </span>
      <span className="text-xs text-fg-tertiary">
        {state === 'done' ? 'Done' : state === 'progress' ? 'In progress' : state === 'pending' ? 'Not yet' : '—'}
      </span>
    </li>
  );
}

function statusState(value?: string): 'done' | 'progress' | 'pending' | 'unknown' {
  if (!value) return 'unknown';
  if (/^(complete|completed|ready|done)$/i.test(value)) return 'done';
  if (/progress/i.test(value)) return 'progress';
  return 'pending';
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function WhereThingsStand({
  profile,
  onboarding,
  growthPhases,
}: {
  profile: ClientProfileView;
  onboarding: Loaded<ClientOnboardingView[]>;
  growthPhases: GrowthPhase[];
}) {
  const currentPhase = growthPhases.find((p) => p.status === 'current');
  const record = onboarding.ok ? onboarding.data.find((r) => r.status !== 'Cancelled') : undefined;
  const deal = profile.deals[0];
  const onboardingStatus = record?.status ?? deal?.onboardingStatus;

  return (
    <div className="space-y-3">
      {(record || deal) && (
        <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">Onboarding</p>
              <p className="mt-1 text-base font-semibold text-fg">{record?.name ?? deal?.name}</p>
            </div>
            {onboardingStatus && <StatusBadge status={onboardingStatus.toLowerCase().replace(/\s+/g, '-')} />}
          </div>
          <ul className="mt-2 divide-y divide-line">
            {record ? (
              <>
                <CheckRow label="Requirements" state={statusState(record.requirements)} />
                <CheckRow label="Access & assets" state={statusState(record.accessAssets)} />
                <CheckRow label="Readiness" state={record.readiness === 'Ready' ? 'done' : statusState(record.readiness)} />
              </>
            ) : null}
            {deal && (
              <>
                <CheckRow label="Scope confirmed" state={deal.scopeConfirmed ? 'done' : 'pending'} />
                <CheckRow label="Billing confirmed" state={deal.billingConfirmed ? 'done' : 'pending'} />
              </>
            )}
          </ul>
          {(record?.startDate || deal?.onboardingStart) && (
            <p className="mt-2 text-xs text-fg-tertiary">
              Started {formatDate((record?.startDate ?? deal?.onboardingStart) as string)}
              {record?.completionDate ? ` · Completed ${formatDate(record.completionDate)}` : ''}
            </p>
          )}
        </div>
      )}

      {!onboarding.ok && <SectionError what="your onboarding progress" />}

      {currentPhase ? (
        <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">Growth journey</p>
          <p className="mt-1 text-base font-semibold text-primary">{currentPhase.name}</p>
          <p className="mt-1 text-sm text-fg-tertiary">{currentPhase.objective}</p>
          <div className="mt-4 flex gap-1">
            {growthPhases.map((phase) => (
              <span
                key={phase.id}
                title={phase.name}
                className={cn(
                  'h-1 flex-1 rounded-full',
                  phase.status === 'completed' ? 'bg-emerald-400' : phase.status === 'current' ? 'bg-primary' : 'bg-white/10'
                )}
              />
            ))}
          </div>
          <Link href="/portal/client/growth" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-fg-secondary hover:text-fg">
            View growth journey <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <NotYetAvailable
          compact
          title="Growth journey"
          description="Your growth phases and milestones will appear here once NairobiX publishes your growth plan to the Portal."
        />
      )}
    </div>
  );
}

function ActiveWork({ projects }: { projects: Loaded<ProjectRow[]> }) {
  if (!projects.ok) return <SectionError what="your work" />;
  const open = projects.data.filter((p) => p.status !== 'completed');
  if (open.length === 0) {
    return (
      <EmptyState
        compact
        icon={<Briefcase />}
        title="Nothing active right now"
        description="When NairobiX begins an engagement for you, it will appear here with its status and dates."
      />
    );
  }
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {open.slice(0, 4).map((project) => (
        <Link key={project.id} href="/portal/client/work" className="block px-4 py-3.5 transition-colors hover:bg-white/[0.02]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">{project.name}</p>
              <p className="mt-0.5 truncate text-[13px] text-fg-tertiary">
                {[project.typeLabel, project.endDate ? `Target ${formatDate(project.endDate)}` : undefined].filter(Boolean).join(' · ') ||
                  'Engagement'}
              </p>
            </div>
            <span className="flex flex-shrink-0 items-center gap-2">
              <StatusBadge status={project.stageLabel ? project.stageLabel.toLowerCase().replace(/\s+/g, '-') : project.status} />
              <ChevronRight size={15} className="text-fg-tertiary" />
            </span>
          </div>
          {project.progress !== undefined && (
            <div className="mt-3">
              <ProgressBar value={project.progress} showLabel={false} size="sm" />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

function SupportPanel({ requests, supportEmail }: { requests: Loaded<ServiceRequest[]>; supportEmail: string }) {
  const open = requests.ok ? requests.data.filter((r) => r.status !== 'resolved') : [];
  const latest = open[0];
  return (
    <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-fg-tertiary">
          <LifeBuoy size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">Need help from NairobiX?</p>
          <p className="mt-0.5 text-[13px] text-fg-tertiary">
            {!requests.ok
              ? 'Your existing requests are temporarily unavailable.'
              : open.length === 0
                ? 'You have no open support requests.'
                : `${open.length} open request${open.length === 1 ? '' : 's'}${latest ? ` · latest: ${latest.title}` : ''}`}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/portal/client/support?new=1" className="btn btn-primary px-4 py-2 text-[13px]">
          <Plus size={14} />
          New request
        </Link>
        <Link href="/portal/client/support" className="btn btn-secondary px-4 py-2 text-[13px]">
          View requests
        </Link>
        <a href={`mailto:${supportEmail}`} className="btn btn-ghost px-3 py-2 text-[13px]">
          <Mail size={14} />
          Email
        </a>
      </div>
    </div>
  );
}

function LibraryLinks({
  documentCount,
  reportCount,
  invoices,
  proposalUrl,
}: {
  documentCount: number | null;
  reportCount: number;
  invoices: Loaded<Invoice[]>;
  proposalUrl?: string;
}) {
  const unpaid = invoices.ok ? invoices.data.filter((i) => i.status !== 'paid' && i.status !== 'draft').length : null;
  const rows = [
    {
      href: '/portal/client/resources',
      icon: <FolderOpen size={15} />,
      label: 'Documents',
      meta:
        documentCount === null
          ? 'Unavailable right now'
          : documentCount > 0
            ? `${documentCount} document${documentCount === 1 ? '' : 's'}`
            : proposalUrl
              ? 'Your growth proposal'
              : 'None yet',
    },
    {
      href: '/portal/client/insights',
      icon: <BarChart3 size={15} />,
      label: 'Insights & reports',
      meta: reportCount > 0 ? `${reportCount} published` : 'Not yet published',
    },
    {
      href: '/portal/client/billing',
      icon: <CreditCard size={15} />,
      label: 'Billing',
      meta: unpaid === null ? 'Unavailable right now' : unpaid > 0 ? `${unpaid} unpaid invoice${unpaid === 1 ? '' : 's'}` : 'No outstanding invoices',
    },
  ];
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {rows.map((row) => (
        <Link key={row.href} href={row.href} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
          <span className="text-fg-tertiary">{row.icon}</span>
          <span className="flex-1 text-sm font-medium text-fg">{row.label}</span>
          <span className="text-xs text-fg-tertiary">{row.meta}</span>
          <ChevronRight size={15} className="text-fg-tertiary" />
        </Link>
      ))}
    </div>
  );
}

function WhatsNext({ upcoming, complete }: { upcoming: AgendaItem[]; complete: boolean }) {
  if (upcoming.length > 0) return <AgendaList items={upcoming.slice(0, 5)} tone="neutral" />;
  if (!complete) return <SectionError what="your upcoming dates" />;
  return (
    <EmptyState
      compact
      icon={<CalendarClock />}
      title="Nothing scheduled"
      description="Meetings, deadlines and due dates linked to your account will appear here."
    />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ClientOverviewView(props: ClientOverviewProps) {
  const { profile, projects, attention, attentionComplete, upcoming, upcomingComplete, requests, metrics } = props;
  const deal = profile.deals[0];
  const services = props.services.ok ? props.services.data : [];
  const focusAreas = [...new Set([...props.profile.deals.flatMap((d) => d.solutionFamilies), ...services.map((s) => s.solutionFamily).filter((s): s is string => !!s)])];
  const goals = [...new Set(profile.deals.flatMap((d) => d.desiredOutcomes))];
  const openWork = projects.ok ? projects.data.filter((p) => p.status !== 'completed').length : null;
  const openRequests = requests.ok ? requests.data.filter((r) => r.status !== 'resolved').length : null;
  const meta = [profile.clientSince ? `Client since ${formatDate(profile.clientSince)}` : undefined, profile.industry, profile.location].filter(Boolean);

  return (
    <PortalLayout pageTitle="Overview" pageSubtitle="Your NairobiX workspace at a glance">
      {/* Identity */}
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Client workspace</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-serif text-[2rem] font-medium leading-tight tracking-tight text-fg sm:text-4xl">{profile.businessName}</h1>
          <p className="text-xs text-fg-tertiary sm:text-right">
            Signed in as <span className="text-fg-secondary">{profile.contactName}</span>
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="badge badge-success">
            <span className="badge-dot" aria-hidden />
            Active client
          </span>
          {meta.map((m) => (
            <span key={m} className="text-xs text-fg-tertiary">
              {m}
            </span>
          ))}
        </div>
        {(focusAreas.length > 0 || goals.length > 0) && (
          <dl className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
            {focusAreas.length > 0 && (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">Engaged for</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {focusAreas.map((area) => (
                    <span key={area} className="rounded-full border border-line px-2.5 py-1 text-xs text-fg-secondary">
                      {area}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {goals.length > 0 && (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">Your goals</dt>
                <dd className="mt-1.5 text-sm text-fg-secondary">{goals.join(' · ')}</dd>
              </div>
            )}
          </dl>
        )}
      </header>

      {/* Status strip */}
      <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3">
        <StatusTile
          label="Needs you"
          value={attentionComplete ? attention.length : '—'}
          href="#attention"
          highlight={attention.length > 0}
        />
        <StatusTile label="Open work" value={openWork ?? '—'} href="/portal/client/work" />
        <StatusTile label="Requests" value={openRequests ?? '—'} href="/portal/client/support" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          <Section title="Needs attention">
            <div id="attention" className="scroll-mt-28">
              {attention.length > 0 ? (
                <AgendaList items={attention} tone="attention" />
              ) : attentionComplete ? (
                <AllClear description="Nothing needs your action right now. Signature requests, invoices and approvals will appear here when they need you." />
              ) : (
                <SectionError what="everything that needs your attention" />
              )}
            </div>
          </Section>

          <Section title="Where things stand">
            <WhereThingsStand profile={profile} onboarding={props.onboarding} growthPhases={props.growthPhases} />
          </Section>

          <Section title="Your work" link={{ href: '/portal/client/work', label: 'View all work' }}>
            <ActiveWork projects={projects} />
          </Section>

          <Section title="What's next" className="lg:hidden">
            <WhatsNext upcoming={upcoming} complete={upcomingComplete} />
          </Section>

          <Section title="Performance">
            {metrics.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {metrics.slice(0, 4).map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.title}
                    value={metric.value}
                    subtitle={metric.unit}
                    trend={metric.trend !== 'stable' ? { value: Math.abs(metric.change), direction: metric.trend } : undefined}
                  />
                ))}
              </div>
            ) : (
              <NotYetAvailable
                compact
                title="Performance tracking"
                description="Your performance data will appear here as NairobiX publishes reporting to your Portal."
              />
            )}
          </Section>
        </div>

        {/* Side column */}
        <div className="space-y-8">
          <Section title="What's next" className="hidden lg:block">
            <WhatsNext upcoming={upcoming} complete={upcomingComplete} />
          </Section>

          <Section title="Support" className="max-lg:!mt-0">
            <SupportPanel requests={requests} supportEmail={props.supportEmail} />
          </Section>

          <Section title="Library">
            <LibraryLinks
              documentCount={props.documentCount}
              reportCount={props.reportCount}
              invoices={props.invoices}
              proposalUrl={deal?.proposalUrl}
            />
          </Section>
        </div>
      </div>
    </PortalLayout>
  );
}
