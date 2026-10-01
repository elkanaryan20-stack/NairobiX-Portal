import { PortalLayout } from '@/components/layout/PortalLayout';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { requireModule } from '@/lib/access/server';
import { getParticipantDemoModules } from '@/lib/portal-data/participant';
import { ParticipantEarningsView } from './view';

export default async function Page() {
  const principal = await requireModule('/portal/participant/earnings');
  const demo = getParticipantDemoModules(principal);
  if (!demo) {
    return (
      <PortalLayout pageTitle="Earnings" pageSubtitle="Commissions and rewards">
        <NotYetAvailable title="Earnings aren’t available yet" description="Commissions and rewards will appear here once NairobiX connects them to your Opportunity Network participation." />
      </PortalLayout>
    );
  }
  return <ParticipantEarningsView demo={demo} />;
}
