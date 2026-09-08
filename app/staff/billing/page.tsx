'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/Form';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Wallet, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StaffBilling() {
  const mockInvoices = [
    {
      id: 'inv1',
      client: 'TechVision Ltd',
      amount: 450000,
      status: 'paid' as const,
      date: '2024-02-15',
      dueDate: '2024-03-15',
    },
    {
      id: 'inv2',
      client: 'RetailMax Solutions',
      amount: 320000,
      status: 'pending' as const,
      date: '2024-03-01',
      dueDate: '2024-04-01',
    },
    {
      id: 'inv3',
      client: 'HealthTech Kenya',
      amount: 280000,
      status: 'overdue' as const,
      date: '2024-01-15',
      dueDate: '2024-02-15',
    },
  ];

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = mockInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = mockInvoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <StaffLayout
      pageTitle="Billing"
      pageSubtitle="Manage invoices and client payments"
    >
      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<Wallet />} />
        <MetricCard label="Paid" value={formatCurrency(paidAmount)} icon={<CheckCircle2 />} />
        <MetricCard label="Pending / Overdue" value={formatCurrency(pendingAmount)} icon={<AlertTriangle />} />
      </div>

      {/* Invoices */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Invoice History
      </h3>

      <div className="space-y-2.5">
        {mockInvoices.map((inv) => (
          <Card key={inv.id} hover className="p-4">
            <div className="grid items-center gap-4 md:grid-cols-5">
              <div>
                <h4 className="font-medium text-neutral-900">{inv.client}</h4>
                <p className="text-sm text-neutral-500">INV-{inv.id}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Amount</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {formatCurrency(inv.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Invoice Date</p>
                <p className="text-sm text-neutral-900">
                  {formatDate(inv.date)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Due Date</p>
                <p className="text-sm text-neutral-900">
                  {formatDate(inv.dueDate)}
                </p>
              </div>

              <div className="text-right">
                <StatusBadge status={inv.status} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
