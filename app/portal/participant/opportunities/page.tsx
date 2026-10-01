import { PortalLayout } from '@/components/layout/PortalLayout';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { requireModule } from '@/lib/access/server';
import { getParticipantDemoModules } from '@/lib/portal-data/participant';
import { ParticipantOpportunitiesView } from './view';

export default async function Page() {
  const principal = await requireModule('/portal/participant/opportunities');
  const demo = getParticipantDemoModules(principal);
  if (!demo) {
    return (
      <PortalLayout pageTitle="Opportunities" pageSubtitle="Opportunities from your referrals">
        <NotYetAvailable title="Opportunities aren’t available yet" description="Opportunities attributed to you will appear here once NairobiX connects them to your Opportunity Network participation." />
      </PortalLayout>
    );
  }
  return <ParticipantOpportunitiesView demo={demo} />;
}
