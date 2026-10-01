import { PortalLayout } from '@/components/layout/PortalLayout';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { requireModule } from '@/lib/access/server';
import { getParticipantDemoModules } from '@/lib/portal-data/participant';
import { ParticipantOnboardingView } from './view';

export default async function Page() {
  const principal = await requireModule('/portal/participant/onboarding');
  const demo = getParticipantDemoModules(principal);
  if (!demo) {
    return (
      <PortalLayout pageTitle="Onboarding" pageSubtitle="Your Opportunity Network onboarding">
        <NotYetAvailable title="Onboarding isn’t available in the Portal" description="NairobiX will contact you directly about your Opportunity Network onboarding." />
      </PortalLayout>
    );
  }
  return <ParticipantOnboardingView demo={demo} />;
}
