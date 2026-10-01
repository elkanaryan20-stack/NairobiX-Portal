import { requireModule } from '@/lib/access/server';
import { getClientProjects, getClientUnsourced } from '@/lib/portal-data/client';
import { ClientWorkView } from './view';

export default async function ClientWorkPage() {
  const principal = await requireModule('/portal/client/work');
  const projects = await getClientProjects(principal);
  const { campaigns, leads, tasks } = getClientUnsourced(principal);
  return <ClientWorkView projects={projects} campaigns={campaigns} leads={leads} initialTasks={tasks} />;
}
