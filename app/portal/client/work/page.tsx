import { requireModule } from '@/lib/access/server';
import { getClientProjects, getClientServices, getClientUnsourced, settle } from '@/lib/portal-data/client';
import { ClientWorkView } from './view';

export default async function ClientWorkPage() {
  const principal = await requireModule('/portal/client/work');
  const [projects, services] = await Promise.all([getClientProjects(principal), settle(getClientServices(principal))]);
  const { campaigns, leads, tasks } = getClientUnsourced(principal);
  return <ClientWorkView projects={projects} services={services} campaigns={campaigns} leads={leads} initialTasks={tasks} />;
}
