import { requireModule } from '@/lib/access/server';
import { getClientDocuments, getClientUnsourced } from '@/lib/portal-data/client';
import { dataSource } from '@/lib/portal-data/source';
import { ClientResourcesView } from './view';

export default async function ClientResourcesPage() {
  const principal = await requireModule('/portal/client/resources');
  const documents = await getClientDocuments(principal);
  return <ClientResourcesView source={dataSource()} documents={documents} benefits={getClientUnsourced(principal).benefits} />;
}
