/**
 * Identity provider seam.
 *
 * A provider's only job is Authentication: prove who someone is and whether
 * their email is verified. It never decides Portal access — that happens
 * afterwards in lib/access/resolve.ts against the NairobiX directory. There is
 * therefore no public registration: signing in with any identity grants
 * nothing unless NairobiX has granted that Contact Portal Access.
 *
 * Production needs a real provider (e.g. OIDC via Zoho, Google Workspace or
 * Microsoft Entra, or an email one-time-code / magic-link service). Until one
 * is connected, sign-in is unavailable in production builds.
 */

import type { VerifiedIdentity } from '@/lib/access/types';

export interface IdentityProvider {
  id: string;
  /** Whether this provider proves email ownership. Shown to users when it doesn't. */
  verifiesEmail: boolean;
  authenticateWithEmail(email: string): Promise<VerifiedIdentity | null>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Development-only provider: accepts an email address and treats it as
 * verified, standing in for a real provider so the Portal's access
 * resolution can be exercised locally. Refuses to load in production.
 */
const developmentProvider: IdentityProvider = {
  id: 'development',
  verifiesEmail: false,
  async authenticateWithEmail(email) {
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) return null;
    return { subject: `dev:${normalized}`, provider: 'development', email: normalized, emailVerified: true };
  },
};

export function getIdentityProvider(): IdentityProvider | null {
  if (process.env.NODE_ENV !== 'production') return developmentProvider;
  // Connect the production identity provider here.
  return null;
}
