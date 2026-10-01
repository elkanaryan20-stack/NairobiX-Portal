'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { safeReturnPath } from '@/lib/access/server';
import { getIdentityProvider } from './provider';
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from './session';

/**
 * Authenticates only. Whether the identity has Portal access is decided on
 * the next request by lib/access/resolve.ts, so this action deliberately
 * behaves the same for every well-formed email — it never reveals whether an
 * address is known to NairobiX.
 */
export async function signIn(formData: FormData) {
  const next = safeReturnPath(formData.get('next'));
  const email = formData.get('email');

  const provider = getIdentityProvider();
  if (!provider) redirect('/login?error=unavailable');

  const identity = typeof email === 'string' ? await provider.authenticateWithEmail(email) : null;
  if (!identity) redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionToken(identity), sessionCookieOptions);
  redirect(next);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}
