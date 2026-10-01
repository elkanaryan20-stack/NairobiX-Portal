import { requireModule } from '@/lib/access/server';
import { getStaffAccounts } from '@/lib/portal-data/staff';
import { StaffAccountsView } from './view';

export default async function StaffAccountsPage() {
  const principal = await requireModule('/portal/staff/accounts');
  const { clients, participants } = await getStaffAccounts(principal);
  return <StaffAccountsView clients={clients} participants={participants} />;
}
