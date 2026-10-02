import { requireModule } from '@/lib/access/server';
import {
  getClientDocuments,
  getClientInvoices,
  getClientMeetings,
  getClientOnboarding,
  getClientProfile,
  getClientProjects,
  getClientProposals,
  getClientServiceRequests,
  getClientServices,
  getClientSignatureRequests,
  getClientUnsourced,
  settle,
} from '@/lib/portal-data/client';
import { deriveAttention, deriveUpcoming, nairobiToday } from '@/lib/portal-data/client-agenda';
import { ClientOverviewView } from './view';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_NAIROBIX_SUPPORT_EMAIL ?? 'support@nairobix.com';

export default async function ClientOverviewPage() {
  const principal = await requireModule('/portal/client');

  // Identity is required; every other section loads independently so one
  // unavailable CRM source shows its own error instead of failing the page.
  const profile = await getClientProfile(principal);
  const [projects, invoices, requests, documents, onboarding, services, proposals, signatures, meetings] = await Promise.all([
    settle(getClientProjects(principal)),
    settle(getClientInvoices(principal)),
    settle(getClientServiceRequests(principal)),
    settle(getClientDocuments(principal)),
    settle(getClientOnboarding(principal)),
    settle(getClientServices(principal)),
    settle(getClientProposals(principal)),
    settle(getClientSignatureRequests(principal)),
    settle(getClientMeetings(principal)),
  ]);
  const unsourced = getClientUnsourced(principal);

  const now = new Date();
  const agendaInput = {
    today: nairobiToday(now),
    now: now.toISOString(),
    deals: profile.deals,
    projects: projects.ok ? projects.data : [],
    invoices: invoices.ok ? invoices.data : [],
    serviceRequests: requests.ok ? requests.data : [],
    proposals: proposals.ok ? proposals.data : [],
    signatureRequests: signatures.ok ? signatures.data : [],
    onboarding: onboarding.ok ? onboarding.data : [],
    meetings: meetings.ok ? meetings.data : [],
  };
  // If a source behind the agenda failed, the agenda is shown as incomplete rather than "all clear".
  const attentionComplete = [projects, invoices, requests, proposals, signatures].every((s) => s.ok);
  const upcomingComplete = [projects, invoices, meetings].every((s) => s.ok);

  return (
    <ClientOverviewView
      profile={profile}
      projects={projects}
      onboarding={onboarding}
      services={services}
      attention={deriveAttention(agendaInput)}
      attentionComplete={attentionComplete}
      upcoming={deriveUpcoming(agendaInput)}
      upcomingComplete={upcomingComplete}
      requests={requests}
      documentCount={documents.ok ? documents.data.length : null}
      invoices={invoices}
      metrics={unsourced.metrics}
      growthPhases={unsourced.growthPhases}
      reportCount={unsourced.reports.length + unsourced.insights.length}
      supportEmail={SUPPORT_EMAIL}
    />
  );
}
