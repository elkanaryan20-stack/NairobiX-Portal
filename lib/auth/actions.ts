'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { safeReturnPath } from '@/lib/access/server';
import { PORTAL_ORIGIN } from '@/lib/site';
import { getIdentityProvider, normalizeEmail } from './provider';
import { SESSION_COOKIE } from './session';
import { LOGIN_COOKIE, readPendingLogin, setPortalSession, pendingLoginCookieOptions } from './session-cookies';

/**
 * Authenticates only. Whether the identity has Portal access is decided on
 * the next request by lib/access/ against the CRM, so these actions behave
 * the same for every well-formed email — they never reveal whether an
 * address is known to NairobiX.
 */
export async function signIn(formData: FormData) {
  const next = safeReturnPath(formData.get('next'));
  const provider = getIdentityProvider();
  if (!provider) redirect('/login?error=unavailable');

  const email = normalizeEmail(formData.get('email'));
  if (!email) redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);

  const result = await provider.start(email, `${PORTAL_ORIGIN}/auth/callback`);

  if (result.status === 'signed-in') {
    await setPortalSession(result.identity);
    redirect(next);
  }
  if (result.status === 'failed') redirect(`/login?error=send&next=${encodeURIComponent(next)}`);

  const cookieStore = await cookies();
  cookieStore.set(LOGIN_COOKIE, JSON.stringify({ email, next }), pendingLoginCookieOptions);
  redirect('/login?step=code');
}

export async function verifyCode(formData: FormData) {
  const provider = getIdentityProvider();
  const pending = await readPendingLogin();
  if (!provider || !pending) redirect('/login?error=expired');

  const code = formData.get('code');
  const identity = typeof code === 'string' ? await provider.verifyCode(pending.email, code) : null;
  if (!identity) redirect('/login?step=code&error=code');

  await setPortalSession(identity);
  (await cookies()).delete(LOGIN_COOKIE);
  redirect(pending.next);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}
