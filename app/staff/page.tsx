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
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { mockStaffMetrics, mockStaffNeedsAttention } from '@/lib/mock-data';

const attentionIcons: Record<string, React.ReactNode> = {
  request: <Inbox size={18} />,
  partner: <HeartHandshake size={18} />,
  referral: <Share2 size={18} />,
  invoice: <CreditCard size={18} />,
};

export default function StaffOverview() {
  return (
    <StaffLayout
      pageTitle="Command Center"
      pageSubtitle="Manage clients, partners, projects and NairobiX operations"
    >
      {/* Key Metrics */}
      <div className="mb-10">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Operational Overview
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Active Clients" value={mockStaffMetrics.activeClients} icon={<Users />} />
          <MetricCard label="Active Partners" value={mockStaffMetrics.activePartners} icon={<HeartHandshake />} />
          <MetricCard label="Active Projects" value={mockStaffMetrics.activeProjects} icon={<FolderKanban />} />
          <MetricCard label="Open Requests" value={mockStaffMetrics.openRequests} icon={<Inbox />} />
          <MetricCard label="New Referrals" value={mockStaffMetrics.newReferrals} icon={<Share2 />} />
          <MetricCard label="Pending Invoices" value={mockStaffMetrics.pendingInvoices} icon={<CreditCard />} />
        </div>
      </div>

      {/* Needs Attention */}
      <div className="mb-10">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          <AlertTriangle size={15} className="text-amber-500" /> Needs Attention
        </h3>

        <div className="space-y-2.5">
          {mockStaffNeedsAttention.map((item) => (
            <Card key={item.id} hover className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    {attentionIcons[item.type] ?? <Inbox size={18} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-neutral-900">{item.title}</h4>
                    <p className="mt-0.5 text-sm text-neutral-600">{item.description}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <Badge variant="warning">{item.type}</Badge>
                  <p className="mt-2 text-xs text-neutral-500">{item.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/staff/clients', icon: <Users />, label: 'Manage Clients', stat: `${mockStaffMetrics.activeClients} active clients` },
            { href: '/staff/partners', icon: <HeartHandshake />, label: 'Manage Partners', stat: `${mockStaffMetrics.activePartners} active partners` },
            { href: '/staff/projects', icon: <FolderKanban />, label: 'Projects', stat: `${mockStaffMetrics.activeProjects} active` },
            { href: '/staff/requests', icon: <Inbox />, label: 'Requests', stat: `${mockStaffMetrics.openRequests} pending` },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="group flex h-full flex-col items-center gap-3 p-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-primary-50 group-hover:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{action.label}</h4>
                  <p className="mt-0.5 text-xs text-neutral-500">{action.stat}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight size={12} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <Card className="flex items-center justify-between border-emerald-200 bg-emerald-50/60 p-6">
        <div>
          <h3 className="mb-1 font-semibold text-neutral-900">System Status</h3>
          <p className="text-sm text-neutral-600">All systems operational</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={22} />
        </div>
      </Card>
    </StaffLayout>
  );
}
