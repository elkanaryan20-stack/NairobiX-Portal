/**
 * Identity provider seam.
 *
 * A provider's only job is Authentication: prove that the person controls an
 * email address. It never decides Portal access — that happens afterwards in
 * lib/access/ against the NairobiX CRM. Anyone can therefore start a sign-in
 * (a first sign-in creates the Supabase identity), but it grants nothing
 * unless the CRM says so.
 *
 * Production uses Supabase Auth passwordless email: one email carries both a
 * magic link (→ /auth/callback) and a one-time code typed on /login. Supabase
 * sessions are not kept — once the email is proven, the Portal issues its own
 * session cookie (lib/auth/session.ts) and ends the Supabase session.
 */

import { createClient, type EmailOtpType, type User } from '@supabase/supabase-js';
import type { VerifiedIdentity } from '@/lib/access/types';

export type SignInStart =
  | { status: 'signed-in'; identity: VerifiedIdentity }
  | { status: 'code-sent' }
  | { status: 'failed' };

export interface IdentityProvider {
  id: string;
  /** Whether this provider proves email ownership. Shown to users when it doesn't. */
  verifiesEmail: boolean;
  /** Begins sign-in for an email address. */
  start(email: string, callbackUrl: string): Promise<SignInStart>;
  /** Completes sign-in with the one-time code from the email. */
  verifyCode(email: string, code: string): Promise<VerifiedIdentity | null>;
  /** Completes sign-in from the magic link (/auth/callback). */
  verifyLink(tokenHash: string, type: string): Promise<VerifiedIdentity | null>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return EMAIL_PATTERN.test(email) && email.length <= 254 ? email : null;
}

// ---------------------------------------------------------------------------
// Supabase Auth (production)
// ---------------------------------------------------------------------------

const LINK_TYPES: readonly EmailOtpType[] = ['email', 'magiclink', 'signup'];

function supabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: 'implicit' },
  });
}

function identityFromUser(user: User | null | undefined): VerifiedIdentity | null {
  const email = normalizeEmail(user?.email);
  if (!user || !email) return null;
  return { subject: user.id, provider: 'supabase', email, emailVerified: !!user.email_confirmed_at };
}

async function finish(client: ReturnType<typeof supabase>, user: User | null | undefined) {
  const identity = identityFromUser(user);
  // The Portal keeps its own session; revoke the Supabase one so no second session lingers.
  await client.auth.signOut({ scope: 'local' }).catch(() => undefined);
  return identity;
}

const supabaseProvider: IdentityProvider = {
  id: 'supabase',
  verifiesEmail: true,

  async start(email, callbackUrl) {
    const { error } = await supabase().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: callbackUrl },
    });
    if (error) {
      console.error('[auth] Supabase could not send the sign-in email:', error.status, error.message);
      return { status: 'failed' };
    }
    return { status: 'code-sent' };
  },

  async verifyCode(email, code) {
    const token = code.replace(/\s+/g, '');
    if (!/^\d{6,10}$/.test(token)) return null;
    const client = supabase();
    const { data, error } = await client.auth.verifyOtp({ email, token, type: 'email' });
    if (error) return null;
    return finish(client, data.user);
  },

  async verifyLink(tokenHash, type) {
    if (!tokenHash || !LINK_TYPES.includes(type as EmailOtpType)) return null;
    const client = supabase();
    const { data, error } = await client.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType });
    if (error) return null;
    return finish(client, data.user);
  },
};

// ---------------------------------------------------------------------------
// Development provider (never in production)
// ---------------------------------------------------------------------------

/**
 * Accepts an email address and treats it as verified, so access resolution
 * can be exercised locally without Supabase. Refuses to load in production.
 */
const developmentProvider: IdentityProvider = {
  id: 'development',
  verifiesEmail: false,
  async start(email) {
    return { status: 'signed-in', identity: { subject: `dev:${email}`, provider: 'development', email, emailVerified: true } };
  },
  async verifyCode() {
    return null;
  },
  async verifyLink() {
    return null;
  },
};

export function getIdentityProvider(): IdentityProvider | null {
  if (supabaseConfigured()) return supabaseProvider;
  if (process.env.NODE_ENV !== 'production') return developmentProvider;
  return null;
}
