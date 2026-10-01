import { requireModule } from '@/lib/access/server';
import { getParticipantProfile } from '@/lib/portal-data/participant';
import { dataSource } from '@/lib/portal-data/source';
import { ParticipantSettingsView } from './view';

export default async function ParticipantSettingsPage() {
  const principal = await requireModule('/portal/participant/settings');
  return <ParticipantSettingsView source={dataSource()} profile={await getParticipantProfile(principal)} />;
}
