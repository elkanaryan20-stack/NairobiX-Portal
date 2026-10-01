/** Cookie helpers shared by the sign-in actions and the /auth/callback route. */

import { cookies } from 'next/headers';
import { safeReturnPath } from '@/lib/access/server';
import type { VerifiedIdentity } from '@/lib/access/types';
import { normalizeEmail } from './provider';
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from './session';

/** Email + return path between "send the email" and "enter the code / open the link". Holds no credential. */
export const LOGIN_COOKIE = 'nx_login';

export const pendingLoginCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 30,
};

export async function readPendingLogin(): Promise<{ email: string; next: string } | null> {
  const raw = (await cookies()).get(LOGIN_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: unknown; next?: unknown };
    const email = normalizeEmail(parsed.email);
    return email ? { email, next: safeReturnPath(parsed.next) } : null;
  } catch {
    return null;
  }
}

export async function setPortalSession(identity: VerifiedIdentity) {
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(identity), sessionCookieOptions);
}
