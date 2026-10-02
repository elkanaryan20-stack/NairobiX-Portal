/**
 * Server-component / server-action access helpers — where authorization is
 * enforced. middleware.ts only checks that a valid session exists; every
 * Portal layout and module page resolves access here before rendering.
 *
 * Authorization decisions are cached per email for a short time (Next.js
 * data cache, shared across server instances) so Zoho is not called on every
 * page render. The cache is cleared by the Zoho webhook
 * (app/api/zoho/webhook/route.ts) whenever authorization-sensitive CRM data
 * changes, and expires after NAIROBIX_AUTHZ_CACHE_TTL_SECONDS regardless.
 * Failed CRM lookups are never cached.
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';
import { cacheTtlSeconds } from '@/lib/cache-ttl';
import { isDemoMode } from '@/lib/crm/mode';
import { resolveAccess } from './resolve';
import { PORTAL_MODULES, PORTAL_RESTRICTED_PATH } from './modules';
import type { Permission } from './permissions';
import type { AccessResult, PortalPrincipal, RelationshipType, VerifiedIdentity } from './types';

export const AUTHZ_CACHE_TAG = 'authz';

class UnavailableResult extends Error {}

/** Resolves access through the shared cache. An `unavailable` result is thrown out of the cache so it isn't stored. */
async function cachedResolve(identity: VerifiedIdentity): Promise<AccessResult> {
  if (isDemoMode()) return resolveAccess(identity);

  const email = identity.email.trim().toLowerCase();
  const resolveCached = unstable_cache(
    async () => {
      const result = await resolveAccess({ ...identity, email });
      if (result.state === 'unavailable') throw new UnavailableResult();
      return result;
    },
    ['portal-access', email, String(identity.emailVerified)],
    { revalidate: cacheTtlSeconds(), tags: [AUTHZ_CACHE_TAG, `${AUTHZ_CACHE_TAG}:${email}`] }
  );

  try {
    return await resolveCached();
  } catch (error) {
    if (!(error instanceof UnavailableResult)) console.error('[access] Authorization cache failed; denying access.', error);
    return { state: 'unavailable', email };
  }
}

/** Resolves the current request's access once per render. */
export const getCurrentAccess = cache(async (): Promise<AccessResult> => {
  const cookieStore = await cookies();
  const identity = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!identity) return { state: 'unauthenticated' };
  return cachedResolve(identity);
});

/** The authorized principal, or a redirect to the Portal entry (which renders the correct access state). */
export async function requirePrincipal(): Promise<PortalPrincipal> {
  const access = await getCurrentAccess();
  if (access.state === 'unauthenticated') redirect('/login');
  if (access.state !== 'authorized') redirect('/portal');
  return access.principal;
}

export async function requireRelationship(type: RelationshipType): Promise<PortalPrincipal> {
  const principal = await requirePrincipal();
  if (!principal.relationships.some((r) => r.type === type)) redirect(PORTAL_RESTRICTED_PATH);
  return principal;
}

export async function requirePermission(permission: Permission): Promise<PortalPrincipal> {
  const principal = await requirePrincipal();
  if (!principal.permissions.includes(permission)) redirect(PORTAL_RESTRICTED_PATH);
  return principal;
}

/** Enforces the permission the module registry assigns to a module page. */
export async function requireModule(href: string): Promise<PortalPrincipal> {
  const portalModule = PORTAL_MODULES.find((m) => m.href === href);
  if (!portalModule) throw new Error(`No Portal module is registered for ${href}.`);
  return requirePermission(portalModule.permission);
}

/** Only same-origin Portal paths are accepted as post-sign-in destinations. */
export function safeReturnPath(value: unknown): string {
  if (typeof value !== 'string') return '/portal';
  if (!/^\/portal(\/[A-Za-z0-9\-/]*)?$/.test(value) || value.includes('//')) return '/portal';
  return value;
}
