import { requireModule } from '@/lib/access/server';
import { getClientProfile } from '@/lib/portal-data/client';
import { dataSource } from '@/lib/portal-data/source';
import { ClientSettingsView } from './view';

export default async function ClientSettingsPage() {
  const principal = await requireModule('/portal/client/settings');
  return <ClientSettingsView source={dataSource()} profile={await getClientProfile(principal)} />;
}
