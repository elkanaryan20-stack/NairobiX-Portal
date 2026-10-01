/**
 * Identity → Contact → Portal Access → Relationships → Permissions.
 *
 * Pure server-side resolution with no framework imports, so middleware and
 * server components share exactly the same decision.
 */

import { getPortalDirectory } from './directory';
import { permissionsForRelationships } from './permissions';
import type { AccessResult, VerifiedIdentity } from './types';

export async function resolveAccess(identity: VerifiedIdentity | null): Promise<AccessResult> {
  // 1. Authentication
  if (!identity) return { state: 'unauthenticated' };

  // 2. Verified identity — an unverified email can't be matched to a Contact.
  if (!identity.emailVerified) return { state: 'unverified', email: identity.email };

  const directory = getPortalDirectory();

  // 3. Contact resolution. No Contact (including Lead-only) → no access.
  const contact = await directory.findContactByVerifiedEmail(identity.email);
  if (!contact) return { state: 'no-access', email: identity.email };

  // 4. Portal Access must be explicitly granted and active.
  const access = await directory.getPortalAccess(contact.contactId);
  if (!access) return { state: 'no-access', email: identity.email };
  if (access.status !== 'active') return { state: 'suspended', email: identity.email };

  // 5–6. Relationships, Roles and Permissions.
  const relationships = (await directory.getRelationships(contact.contactId)).filter(
    (r) => r.status !== 'inactive'
  );
  const permissions = permissionsForRelationships(relationships);
  if (permissions.length === 0) return { state: 'no-access', email: identity.email };

  return {
    state: 'authorized',
    principal: {
      contactId: contact.contactId,
      name: contact.name,
      email: contact.email,
      relationships,
      permissions,
    },
  };
}
