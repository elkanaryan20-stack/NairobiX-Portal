'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card, Badge } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-blue-700">
            {formatCurrency(totalRevenue)}
          </p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(paidAmount)}
          </p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-sm text-neutral-600 font-medium mb-2">
            Pending/Overdue
          </p>
          <p className="text-3xl font-bold text-red-700">
            {formatCurrency(pendingAmount)}
          </p>
        </Card>
      </div>

      {/* Invoices */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Invoice History
      </h3>

      <div className="space-y-3">
        {mockInvoices.map((inv) => (
          <Card key={inv.id} hover className="p-4">
            <div className="grid md:grid-cols-5 gap-4 items-center">
              <div>
                <h4 className="font-medium text-neutral-900">{inv.client}</h4>
                <p className="text-sm text-neutral-600">INV-{inv.id}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Amount</p>
                <p className="text-lg font-bold text-neutral-900">
                  {formatCurrency(inv.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Invoice Date</p>
                <p className="text-sm text-neutral-900">
                  {formatDate(inv.date)}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-600 font-medium">Due Date</p>
                <p className="text-sm text-neutral-900">
                  {formatDate(inv.dueDate)}
                </p>
              </div>

              <div className="text-right">
                <Badge
                  variant={
                    inv.status === 'paid'
                      ? 'success'
                      : inv.status === 'overdue'
                      ? 'warning'
                      : 'primary'
                  }
                >
                  {inv.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
