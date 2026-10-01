import { requireModule } from '@/lib/access/server';
import { isDemoMode } from '@/lib/crm/mode';
import { getStaffApplications } from '@/lib/portal-data/staff';
import { CrmPipelineView } from './crm-view';
import { DemoPipelineView } from './view';

export default async function StaffPipelinePage() {
  const principal = await requireModule('/portal/staff/pipeline');

  if (isDemoMode()) {
    const { mockPartnerApplications, mockPartnerReferrals, mockOnboardingApplication, mockPartnerAssessment } = await import(
      '@/lib/mock-data'
    );
    return (
      <DemoPipelineView
        demo={{
          applications: mockPartnerApplications,
          referrals: mockPartnerReferrals,
          onboardingApplication: mockOnboardingApplication,
          assessment: mockPartnerAssessment,
        }}
      />
    );
  }

  return <CrmPipelineView applications={await getStaffApplications(principal)} />;
}
