'use client';

import Link from 'next/link';
import {
  Users,
  HeartHandshake,
  FolderKanban,
  Inbox,
  Share2,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Badge } from '@/components/ui/Card';
import { EmptyState, MetricCard } from '@/components/ui/Form';
import { formatDate } from '@/lib/utils';
import type { AttentionItem, StaffMetrics } from '@/lib/portal-data/staff';
import type { DataSource } from '@/lib/portal-data/source';

const attentionIcons: Record<AttentionItem['type'], React.ReactNode> = {
  request: <Inbox size={18} />,
  participant: <HeartHandshake size={18} />,
  invoice: <CreditCard size={18} />,
};

const attentionLabels: Record<AttentionItem['type'], string> = {
  request: 'case',
  participant: 'application',
  invoice: 'invoice',
};

export function StaffOverviewView({
  source,
  metrics,
  attention,
}: {
  source: DataSource;
  metrics: StaffMetrics;
  attention: AttentionItem[];
}) {
  return (
    <PortalLayout
      pageTitle="Command Center"
      pageSubtitle="Manage clients, Opportunity Network Participants, engagements and NairobiX operations"
    >
      {/* Key Metrics */}
      <div className="mb-10">
        <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          Operational Overview
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Active Clients" value={metrics.activeClients} icon={<Users />} />
          <MetricCard label="Active Participants" value={metrics.activeParticipants} icon={<HeartHandshake />} />
          <MetricCard label="Active Engagements" value={metrics.activeEngagements} icon={<FolderKanban />} />
          <MetricCard label="Open Cases" value={metrics.openCases} icon={<Inbox />} />
          <MetricCard label="Applications in Review" value={metrics.applicationsInReview} icon={<Share2 />} />
          <MetricCard label="Unpaid Invoices" value={metrics.unpaidInvoices} icon={<CreditCard />} />
        </div>
      </div>

      {/* Needs Attention */}
      <div className="mb-10">
        <h3 className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          <AlertTriangle size={15} className="text-amber-500" /> Needs Attention
        </h3>

        {attention.length === 0 && (
          <EmptyState icon={<CheckCircle2 />} title="Nothing needs attention" description="No escalated cases, applications awaiting review or overdue invoices." />
        )}
        <div className="space-y-2.5">
          {attention.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card hover className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/[0.06] text-amber-400">
                      {attentionIcons[item.type] ?? <Inbox size={18} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-fg">{item.title}</h4>
                      <p className="mt-0.5 text-sm text-fg-secondary">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <Badge variant="warning">{attentionLabels[item.type]}</Badge>
                    {item.date && <p className="mt-2 text-xs text-fg-tertiary">{formatDate(item.date)}</p>}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/portal/staff/accounts', icon: <Users />, label: 'Manage Accounts', stat: `${metrics.activeClients} clients · ${metrics.activeParticipants} participants` },
            { href: '/portal/staff/pipeline', icon: <HeartHandshake />, label: 'Review Pipeline', stat: `${metrics.applicationsInReview} awaiting review` },
            { href: '/portal/staff/delivery', icon: <FolderKanban />, label: 'Delivery', stat: `${metrics.activeEngagements} active` },
            { href: '/portal/staff/support', icon: <Inbox />, label: 'Support', stat: `${metrics.openCases} open` },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="group flex h-full flex-col items-center gap-3 p-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary transition-colors group-hover:bg-primary/10 group-hover:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-fg">{action.label}</h4>
                  <p className="mt-0.5 text-xs text-fg-tertiary">{action.stat}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight size={12} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status — demo only: no monitoring source backs this claim */}
      {source === 'demo' && (
      <Card className="flex items-center justify-between border-emerald-500/20 bg-emerald-500/[0.06] p-6">
        <div>
          <h3 className="mb-1 font-semibold text-fg">System Status</h3>
          <p className="text-sm text-fg-secondary">All systems operational</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 size={22} />
        </div>
      </Card>
      )}
    </PortalLayout>
  );
}
