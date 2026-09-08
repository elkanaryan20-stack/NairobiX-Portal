'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Badge, Button } from '@/components/ui/Card';
import { mockClientReports } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Download, Eye } from 'lucide-react';

export default function ClientReports() {
  return (
    <ClientLayout
      pageTitle="Reports"
      pageSubtitle="View and download your growth reports and performance analysis"
    >
      {/* Reports Library */}
      <div className="space-y-4">
        {mockClientReports.map((report) => (
          <Card key={report.id} className="p-6">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Report Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {report.title}
                  </h3>
                  <Badge variant="neutral">{report.type}</Badge>
                </div>
                <p className="text-neutral-600 text-sm mb-2">{report.summary}</p>
                <p className="text-xs text-neutral-500">
                  Published: {formatDate(report.publishedDate)}
                </p>
              </div>

              {/* Period */}
              <div className="text-center md:text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-1">Period</p>
                <p className="text-lg font-semibold text-neutral-900">{report.period}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Eye size={16} />}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download size={16} />}
                >
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="mt-8 border-primary-200 bg-primary-50/40 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">
              Need a custom report?
            </h4>
            <p className="text-neutral-700 text-sm">
              Request a specialized analysis or custom report tailored to your needs
            </p>
          </div>
          <Button variant="primary">Request Custom Report</Button>
        </div>
      </Card>
    </ClientLayout>
  );
}
