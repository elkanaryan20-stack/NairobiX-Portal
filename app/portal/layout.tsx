import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccessState } from '@/components/portal/AccessState';
import { PortalSessionProvider } from '@/components/portal/PortalSession';
import { buildNavigation } from '@/lib/access/navigation';
import { getCurrentAccess } from '@/lib/access/server';

export const metadata: Metadata = {
  title: 'NairobiX Portal',
  robots: { index: false, follow: false },
};

/**
 * The one authenticated NairobiX Portal. Resolves the signed-in identity to
 * its NairobiX Relationships on the server, then either renders the correct
 * access state or the Portal shell with navigation built from permissions.
 */
export default async function PortalRootLayout({ children }: { children: React.ReactNode }) {
  const access = await getCurrentAccess();

  if (access.state === 'unauthenticated') redirect('/login');
  if (access.state !== 'authorized') return <AccessState access={access} />;

  const { principal } = access;
  return (
    <PortalSessionProvider
      value={{
        name: principal.name,
        email: principal.email,
        relationships: principal.relationships.map((r) => ({
          type: r.type,
          accountName: r.accountName,
          status: r.status,
        })),
        permissions: principal.permissions,
        navigation: buildNavigation(principal),
      }}
    >
      {children}
    </PortalSessionProvider>
  );
}
