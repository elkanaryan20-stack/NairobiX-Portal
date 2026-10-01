import { requireModule } from '@/lib/access/server';
import { dataSource } from '@/lib/portal-data/source';
import { StaffSettingsView } from './view';

export default async function StaffSettingsPage() {
  await requireModule('/portal/staff/settings');
  return <StaffSettingsView source={dataSource()} />;
}
