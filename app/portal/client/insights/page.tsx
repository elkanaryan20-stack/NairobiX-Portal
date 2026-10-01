import { requireModule } from '@/lib/access/server';
import { getClientUnsourced } from '@/lib/portal-data/client';
import { ClientInsightsView } from './view';

export default async function ClientInsightsPage() {
  const principal = await requireModule('/portal/client/insights');
  const { insights, metrics, reports } = getClientUnsourced(principal);
  return <ClientInsightsView insights={insights} metrics={metrics} reports={reports} />;
}
