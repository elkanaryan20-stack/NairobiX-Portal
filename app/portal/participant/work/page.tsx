import { PortalLayout } from '@/components/layout/PortalLayout';
import { NotYetAvailable } from '@/components/portal/NotYetAvailable';
import { requireModule } from '@/lib/access/server';
import { getParticipantDemoModules } from '@/lib/portal-data/participant';
import { ParticipantWorkView } from './view';

export default async function Page() {
  const principal = await requireModule('/portal/participant/work');
  const demo = getParticipantDemoModules(principal);
  if (!demo) {
    return (
      <PortalLayout pageTitle="Work" pageSubtitle="Projects, tasks and deliverables">
        <NotYetAvailable title="Work assignments aren’t available yet" description="Engagements you are assigned to will appear here once NairobiX connects assignments to your Opportunity Network participation." />
      </PortalLayout>
    );
  }
  return <ParticipantWorkView demo={demo} />;
}
