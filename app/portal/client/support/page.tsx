import { requireModule } from '@/lib/access/server';
import { getClientProfile, getClientServiceRequests } from '@/lib/portal-data/client';
import { ClientSupportView } from './view';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_NAIROBIX_SUPPORT_EMAIL ?? 'support@nairobix.com';

export default async function ClientSupportPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const principal = await requireModule('/portal/client/support');
  const [requests, profile, params] = await Promise.all([
    getClientServiceRequests(principal),
    getClientProfile(principal),
    searchParams,
  ]);
  return (
    <ClientSupportView
      initialRequests={requests}
      authorizedDeals={profile.deals.map(({ id, name }) => ({ id, name }))}
      supportEmail={SUPPORT_EMAIL}
      startWithForm={params.new === '1'}
    />
  );
}
