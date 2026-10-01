import { requireModule } from '@/lib/access/server';
import { getStaffInvoices } from '@/lib/portal-data/staff';
import { StaffBillingView } from './view';

export default async function StaffBillingPage() {
  const principal = await requireModule('/portal/staff/billing');
  return <StaffBillingView invoices={await getStaffInvoices(principal)} />;
}
