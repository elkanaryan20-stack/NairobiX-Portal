import { requireModule } from '@/lib/access/server';
import { getClientInvoices, getClientProfile } from '@/lib/portal-data/client';
import { dataSource } from '@/lib/portal-data/source';
import { ClientBillingView } from './view';

export default async function ClientBillingPage() {
  const principal = await requireModule('/portal/client/billing');
  const [profile, invoices] = await Promise.all([getClientProfile(principal), getClientInvoices(principal)]);
  return <ClientBillingView source={dataSource()} profile={profile} invoices={invoices} />;
}
