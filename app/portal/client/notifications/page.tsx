import { requireModule } from '@/lib/access/server';
import { getClientUnsourced } from '@/lib/portal-data/client';
import { ClientNotificationsView } from './view';

export default async function ClientNotificationsPage() {
  const principal = await requireModule('/portal/client/notifications');
  return <ClientNotificationsView initialNotifications={getClientUnsourced(principal).notifications} />;
}
