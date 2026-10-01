import { requireModule } from '@/lib/access/server';
import {
  getClientInvoices,
  getClientProfile,
  getClientProjects,
  getClientServiceRequests,
  getClientUnsourced,
} from '@/lib/portal-data/client';
import { ClientOverviewView } from './view';

export default async function ClientOverviewPage() {
  const principal = await requireModule('/portal/client');
  const [profile, projects, invoices, serviceRequests] = await Promise.all([
    getClientProfile(principal),
    getClientProjects(principal),
    getClientInvoices(principal),
    getClientServiceRequests(principal),
  ]);
  const { insights, metrics, growthPhases, tasks, growthPulse } = getClientUnsourced(principal);

  return (
    <ClientOverviewView
      profile={profile}
      projects={projects}
      invoices={invoices}
      serviceRequests={serviceRequests}
      unsourced={{ insights, metrics, growthPhases, tasks, growthPulse }}
    />
  );
}
