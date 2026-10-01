import { requireModule } from '@/lib/access/server';
import { getParticipantDemoModules, getParticipantProfile } from '@/lib/portal-data/participant';
import { ParticipantOverviewView } from './view';

export default async function ParticipantOverviewPage() {
  const principal = await requireModule('/portal/participant');
  const profile = await getParticipantProfile(principal);
  return <ParticipantOverviewView profile={profile} demo={getParticipantDemoModules(principal)} />;
}
