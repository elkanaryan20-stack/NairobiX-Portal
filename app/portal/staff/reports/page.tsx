import { requireModule } from '@/lib/access/server';
import { getStaffCampaigns, getStaffDocuments, getStaffReportMetrics } from '@/lib/portal-data/staff';
import { StaffReportsView } from './view';

export default async function StaffReportsPage() {
  const principal = await requireModule('/portal/staff/reports');
  const [metrics, documents, campaigns] = await Promise.all([
    getStaffReportMetrics(principal),
    getStaffDocuments(principal),
    getStaffCampaigns(principal),
  ]);
  return <StaffReportsView metrics={metrics} documents={documents} campaigns={campaigns} />;
}
