import { PortalLayout } from '@/components/layout/PortalLayout';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { requireModule } from '@/lib/access/server';
import { getParticipantDemoModules } from '@/lib/portal-data/participant';
import { ParticipantReferralsView } from './view';

export default async function Page() {
  const principal = await requireModule('/portal/participant/referrals');
  const demo = getParticipantDemoModules(principal);
  if (!demo) {
    return (
      <PortalLayout pageTitle="Referrals" pageSubtitle="Businesses you have referred to NairobiX">
        <NotYetAvailable title="Referrals aren’t available yet" description="Your referrals will appear here once NairobiX connects referral attribution to your Opportunity Network participation." />
      </PortalLayout>
    );
  }
  return <ParticipantReferralsView demo={demo} />;
}
