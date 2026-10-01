import { requireModule } from '@/lib/access/server';
import { getStaffOverview } from '@/lib/portal-data/staff';
import { dataSource } from '@/lib/portal-data/source';
import { StaffOverviewView } from './view';

export default async function StaffOverviewPage() {
  const principal = await requireModule('/portal/staff');
  const { metrics, attention } = await getStaffOverview(principal);
  return <StaffOverviewView source={dataSource()} metrics={metrics} attention={attention} />;
}
