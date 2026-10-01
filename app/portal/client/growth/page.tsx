import { requireModule } from '@/lib/access/server';
import { getClientUnsourced } from '@/lib/portal-data/client';
import { ClientGrowthView } from './view';

export default async function ClientGrowthPage() {
  const principal = await requireModule('/portal/client/growth');
  return <ClientGrowthView growthPhases={getClientUnsourced(principal).growthPhases} />;
}
