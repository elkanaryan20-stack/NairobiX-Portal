import { requireModule } from '@/lib/access/server';
import { getStaffCases, getStaffConversations } from '@/lib/portal-data/staff';
import { dataSource } from '@/lib/portal-data/source';
import { StaffSupportView } from './view';

export default async function StaffSupportPage() {
  const principal = await requireModule('/portal/staff/support');
  return (
    <StaffSupportView
      source={dataSource()}
      cases={await getStaffCases(principal)}
      conversations={getStaffConversations(principal)}
    />
  );
}
