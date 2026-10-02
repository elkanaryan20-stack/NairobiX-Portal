import { requireModule } from '@/lib/access/server';
import {
  getClientDocuments,
  getClientInvoices,
  getClientOnboarding,
  getClientProjects,
  getClientServiceRequests,
  settle,
} from '@/lib/portal-data/client';
import { deriveActivity, nairobiToday } from '@/lib/portal-data/client-agenda';
import { ClientNotificationsView } from './view';

export default async function ClientNotificationsPage() {
  const principal = await requireModule('/portal/client/notifications');
  const [invoices, requests, projects, documents, onboarding] = await Promise.all([
    settle(getClientInvoices(principal)),
    settle(getClientServiceRequests(principal)),
    settle(getClientProjects(principal)),
    settle(getClientDocuments(principal)),
    settle(getClientOnboarding(principal)),
  ]);

  const updates = deriveActivity({
    today: nairobiToday(),
    invoices: invoices.ok ? invoices.data : [],
    serviceRequests: requests.ok ? requests.data : [],
    projects: projects.ok ? projects.data : [],
    documents: documents.ok ? documents.data : [],
    onboarding: onboarding.ok ? onboarding.data : [],
  });
  const complete = [invoices, requests, projects, documents, onboarding].every((s) => s.ok);

  return <ClientNotificationsView updates={updates} complete={complete} />;
}
