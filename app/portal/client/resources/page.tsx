import { requireModule } from '@/lib/access/server';
import {
  getClientDocuments,
  getClientProfile,
  getClientProposals,
  getClientSignatureRequests,
  getClientUnsourced,
  settle,
} from '@/lib/portal-data/client';
import { ClientResourcesView, type ProposalLink } from './view';

export default async function ClientResourcesPage() {
  const principal = await requireModule('/portal/client/resources');
  const [profile, documents, signatureRequests, proposals] = await Promise.all([
    getClientProfile(principal),
    settle(getClientDocuments(principal)),
    settle(getClientSignatureRequests(principal)),
    settle(getClientProposals(principal)),
  ]);

  // Links recorded on the authorizing Deals (already restricted to https).
  const proposalLinks: ProposalLink[] = profile.deals.flatMap((deal) => [
    ...(deal.proposalUrl ? [{ id: `${deal.id}-proposal`, label: 'Growth proposal', dealName: deal.name, url: deal.proposalUrl }] : []),
    ...(deal.quoteUrl ? [{ id: `${deal.id}-quote`, label: 'Quote', dealName: deal.name, url: deal.quoteUrl }] : []),
  ]);

  return (
    <ClientResourcesView
      documents={documents}
      signatureRequests={signatureRequests}
      proposals={proposals}
      proposalLinks={proposalLinks}
      benefits={getClientUnsourced(principal).benefits}
    />
  );
}
