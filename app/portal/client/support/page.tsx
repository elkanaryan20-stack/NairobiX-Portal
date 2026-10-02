import { requireModule } from '@/lib/access/server';
import { getClientServiceRequests } from '@/lib/portal-data/client';
import { dataSource } from '@/lib/portal-data/source';
import { ClientSupportView } from './view';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_NAIROBIX_SUPPORT_EMAIL ?? 'support@nairobix.com';

export default async function ClientSupportPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const principal = await requireModule('/portal/client/support');
  const [requests, params] = await Promise.all([getClientServiceRequests(principal), searchParams]);
  return (
    <ClientSupportView
      source={dataSource()}
      initialRequests={requests}
      supportEmail={SUPPORT_EMAIL}
      startWithForm={params.new === '1'}
    />
  );
}
