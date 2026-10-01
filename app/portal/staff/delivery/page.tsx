import { requireModule } from '@/lib/access/server';
import { getStaffEngagements, getStaffTasks } from '@/lib/portal-data/staff';
import { StaffDeliveryView } from './view';

export default async function StaffDeliveryPage() {
  const principal = await requireModule('/portal/staff/delivery');
  const [engagements, tasks] = await Promise.all([getStaffEngagements(principal), getStaffTasks(principal)]);
  return <StaffDeliveryView engagements={engagements} tasks={tasks} />;
}
