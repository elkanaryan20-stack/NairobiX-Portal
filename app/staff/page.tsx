'use client';

import Link from 'next/link';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { mockStaffMetrics, mockStaffNeedsAttention } from '@/lib/mock-data';

export default function StaffOverview() {
  return (
    <StaffLayout
      pageTitle="Command Center"
      pageSubtitle="Manage clients, partners, projects and NairobiX operations"
    >
      {/* Key Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Operational Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <MetricCard
            label="Active Clients"
            value={mockStaffMetrics.activeClients}
            icon="👥"
          />
          <MetricCard
            label="Active Partners"
            value={mockStaffMetrics.activePartners}
            icon="🤝"
          />
          <MetricCard
            label="Active Projects"
            value={mockStaffMetrics.activeProjects}
            icon="📋"
          />
          <MetricCard
            label="Open Requests"
            value={mockStaffMetrics.openRequests}
            icon="✉️"
          />
          <MetricCard
            label="New Referrals"
            value={mockStaffMetrics.newReferrals}
            icon="🔗"
          />
          <MetricCard
            label="Pending Invoices"
            value={mockStaffMetrics.pendingInvoices}
            icon="💳"
          />
        </div>
      </div>

      {/* Needs Attention */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <span>⚠️</span> Needs Attention
        </h3>

        <div className="space-y-3">
          {mockStaffNeedsAttention.map((item) => (
            <Card key={item.id} hover className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-2xl">
                      {item.type === 'request'
                        ? '✉️'
                        : item.type === 'partner'
                        ? '🤝'
                        : item.type === 'referral'
                        ? '🔗'
                        : '💳'}
                    </p>
                    <h4 className="font-semibold text-neutral-900">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <Badge variant="warning">{item.type}</Badge>
                  <p className="text-xs text-neutral-500 mt-2">{item.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/staff/clients">
          <Card hover className="p-6 text-center h-full">
            <p className="text-3xl mb-3">👥</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Manage Clients</h4>
            <p className="text-xs text-neutral-600">
              {mockStaffMetrics.activeClients} active clients
            </p>
          </Card>
        </Link>

        <Link href="/staff/partners">
          <Card hover className="p-6 text-center h-full">
            <p className="text-3xl mb-3">🤝</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Manage Partners</h4>
            <p className="text-xs text-neutral-600">
              {mockStaffMetrics.activePartners} active partners
            </p>
          </Card>
        </Link>

        <Link href="/staff/projects">
          <Card hover className="p-6 text-center h-full">
            <p className="text-3xl mb-3">📋</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Projects</h4>
            <p className="text-xs text-neutral-600">
              {mockStaffMetrics.activeProjects} active
            </p>
          </Card>
        </Link>

        <Link href="/staff/requests">
          <Card hover className="p-6 text-center h-full">
            <p className="text-3xl mb-3">✉️</p>
            <h4 className="font-semibold text-neutral-900 mb-1">Requests</h4>
            <p className="text-xs text-neutral-600">
              {mockStaffMetrics.openRequests} pending
            </p>
          </Card>
        </Link>
      </div>

      {/* System Status */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900 mb-1">System Status</h3>
            <p className="text-neutral-700 text-sm">All systems operational</p>
          </div>
          <div className="text-4xl">🟢</div>
        </div>
      </Card>
    </StaffLayout>
  );
}
