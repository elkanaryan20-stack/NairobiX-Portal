/**
 * Server-component / server-action access helpers. Middleware enforces every
 * request first; these re-check inside the render so a misconfigured matcher
 * can never expose a Portal module on its own (defense in depth).
 */

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';
import { resolveAccess } from './resolve';
import { PORTAL_RESTRICTED_PATH } from './modules';
import type { Permission } from './permissions';
import type { AccessResult, PortalPrincipal, RelationshipType } from './types';

/** Resolves the current request's access once per render. */
export const getCurrentAccess = cache(async (): Promise<AccessResult> => {
  const cookieStore = await cookies();
  const identity = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  return resolveAccess(identity);
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

/** Only same-origin Portal paths are accepted as post-sign-in destinations. */
export function safeReturnPath(value: unknown): string {
  if (typeof value !== 'string') return '/portal';
  if (!/^\/portal(\/[A-Za-z0-9\-/]*)?$/.test(value) || value.includes('//')) return '/portal';
  return value;
}
