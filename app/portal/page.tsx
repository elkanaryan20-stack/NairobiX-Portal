import { redirect } from 'next/navigation';
import { PORTAL_RESTRICTED_PATH, defaultModulePath } from '@/lib/access/modules';
import { getCurrentAccess } from '@/lib/access/server';

/** Portal entry fallback — middleware normally redirects /portal before this renders. */
export default async function PortalHome() {
  const access = await getCurrentAccess();
  // Non-authorized states are rendered by the Portal layout itself.
  if (access.state !== 'authorized') return null;

  redirect(defaultModulePath(access.principal) ?? PORTAL_RESTRICTED_PATH);
}
