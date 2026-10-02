'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, StatusBadge } from '@/components/ui/Card';
import { EmptyState, MetricCard } from '@/components/ui/Form';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Wallet, CheckCircle2, AlertTriangle, CreditCard } from 'lucide-react';
import type { StaffInvoiceRow } from '@/lib/portal-data/staff';

export function StaffBillingView({ invoices }: { invoices: StaffInvoiceRow[] }) {
  const currency = invoices[0]?.currency;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <PortalLayout
      pageTitle="Billing"
      pageSubtitle="Manage invoices and client payments"
    >
      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Total Invoiced" value={formatCurrency(totalRevenue, currency)} icon={<Wallet />} />
        <MetricCard label="Paid" value={formatCurrency(paidAmount, currency)} icon={<CheckCircle2 />} />
        <MetricCard label="Unpaid / Overdue" value={formatCurrency(pendingAmount, currency)} icon={<AlertTriangle />} />
      </div>

      {/* Invoices */}
      <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
        Invoice History
      </h3>

      <div className="space-y-2.5">
        {invoices.length === 0 && (
          <EmptyState icon={<CreditCard />} title="No invoices" description="Invoices recorded in the CRM appear here." />
        )}
        {invoices.map((inv) => (
          <Card key={inv.id} hover className="p-4">
            <div className="grid items-center gap-4 md:grid-cols-5">
              <div>
                <h4 className="font-medium text-fg">{inv.client}</h4>
                <p className="text-sm text-fg-tertiary">{inv.invoiceNumber}</p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Amount</p>
                <p className="text-lg font-semibold text-fg">
                  {formatCurrency(inv.amount, inv.currency)}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Invoice Date</p>
                <p className="text-sm text-fg">
                  {inv.date ? formatDate(inv.date) : '—'}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Due Date</p>
                <p className="text-sm text-fg">
                  {inv.dueDate ? formatDate(inv.dueDate) : '—'}
                </p>
              </div>

              <div className="text-right">
                <StatusBadge status={inv.status} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}
