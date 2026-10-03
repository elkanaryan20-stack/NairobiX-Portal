/**
 * Identity → CRM identity → Relationships → Permissions.
 *
 * Pure server-side resolution with no framework imports, so it can be tested
 * directly and cached by lib/access/server.ts. Fails closed: if the CRM
 * cannot be consulted, the result is `unavailable` (no access).
 */

import { getPortalDirectory, type PortalDirectory } from './directory';
import { permissionsForRelationships } from './permissions';
import type { AccessResult, VerifiedIdentity } from './types';

export async function resolveAccess(
  identity: VerifiedIdentity | null,
  directory: PortalDirectory = getPortalDirectory()
): Promise<AccessResult> {
  // 1. Authentication
  if (!identity) return { state: 'unauthenticated' };

  // 2. Verified identity — an unverified email can't be matched to the CRM.
  if (!identity.emailVerified) return { state: 'unverified', email: identity.email };

  // 3. CRM identity. Any CRM failure denies access.
  let resolution;
  try {
    resolution = await directory.resolve(identity.email);
  } catch (error) {
    console.error('[access] CRM lookup failed; denying access.', (error as Error).message);
    return { state: 'unavailable', email: identity.email };
  }
  if (!resolution) return { state: 'no-access', email: identity.email };

  // 4. Relationships, Roles and Permissions.
  // Explicitly retain approved and onboarding relationships; inactive CRM
  // relationships never produce Portal permissions.
  const relationships = resolution.relationships.filter((r) => r.status === 'active' || r.status === 'onboarding');
  const permissions = permissionsForRelationships(relationships);
  if (permissions.length === 0) {
    return resolution.blocked
      ? { state: 'suspended', email: identity.email }
      : { state: 'no-access', email: identity.email };
  }

  return {
    state: 'authorized',
    principal: {
      contactId: resolution.contactId,
      crmUserId: resolution.crmUserId,
      name: resolution.name,
      email: resolution.email,
      relationships,
      permissions,
    },
  };
}
