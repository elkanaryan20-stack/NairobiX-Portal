import { requireModule } from '@/lib/access/server';
import { getParticipantUnsourced } from '@/lib/portal-data/participant';
import { ParticipantNotificationsView } from './view';

export default async function ParticipantNotificationsPage() {
  const principal = await requireModule('/portal/participant/notifications');
  return <ParticipantNotificationsView initialNotifications={getParticipantUnsourced(principal).notifications} />;
}
