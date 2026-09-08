'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { mockClientInvoices } from '@/lib/mock-data';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Download, Eye } from 'lucide-react';

export default function ClientBilling() {
  const currentInvoice = mockClientInvoices[0];
  const invoiceHistory = mockClientInvoices;

  return (
    <ClientLayout
      pageTitle="Billing"
      pageSubtitle="Manage your NairobiX partnership invoices"
    >
      {/* Current Partnership & Invoice */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Partnership Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Current Partnership
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Engagement Type
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                Growth Partnership
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Status</p>
              <Badge variant="success">Active</Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Partnership Start
              </p>
              <p className="text-neutral-900 font-medium">
                June 15, 2023
              </p>
            </div>
          </div>
        </Card>

        {/* Current Invoice */}
        {currentInvoice && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Current Invoice
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Amount</p>
                <p className="text-3xl font-semibold text-neutral-900">
                  {formatCurrency(currentInvoice.amount)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Due Date
                  </p>
                  <p className="font-medium text-neutral-900">
                    {formatDate(currentInvoice.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Status</p>
                  <StatusBadge status={currentInvoice.status} />
                </div>
              </div>
              <Button variant="primary" className="w-full mt-2">
                Pay Invoice
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Invoice History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Invoice History
        </h3>

        <div className="space-y-3">
          {invoiceHistory.map((invoice) => (
            <Card key={invoice.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Invoice Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-neutral-900">
                      {invoice.invoiceNumber}
                    </h4>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <p className="text-xs text-neutral-600">
                    {formatDate(invoice.issueDate)} • Due{' '}
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 rounded-sm transition-colors" title="View">
                    <Eye size={17} />
                  </button>
                  <button className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 rounded-sm transition-colors" title="Download">
                    <Download size={17} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Payment Methods
        </h3>
        <p className="text-neutral-600 mb-4">
          Update your payment method or add a new one
        </p>
        <Button variant="secondary">Manage Payment Methods</Button>
      </Card>
    </ClientLayout>
  );
}
