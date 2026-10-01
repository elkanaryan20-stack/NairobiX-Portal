import { requireModule } from '@/lib/access/server';
import { getParticipantDocuments, getParticipantUnsourced } from '@/lib/portal-data/participant';
import { ParticipantResourcesView } from './view';

export default async function ParticipantResourcesPage() {
  const principal = await requireModule('/portal/participant/resources');
  const documents = await getParticipantDocuments(principal);
  const { benefits, updates, insights, demoContent } = getParticipantUnsourced(principal);
  return (
    <ParticipantResourcesView
      documents={documents}
      benefits={benefits}
      updates={updates}
      insights={insights}
      demoContent={demoContent}
    />
  );
}
