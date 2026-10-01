import { NextResponse, type NextRequest } from 'next/server';
import { getIdentityProvider } from '@/lib/auth/provider';
import { LOGIN_COOKIE, readPendingLogin, setPortalSession } from '@/lib/auth/session-cookies';

/**
 * Magic-link landing: https://portal.nairobix.com/auth/callback?token_hash=…&type=email
 *
 * Proves email ownership with Supabase, issues the Portal session and sends
 * the person into the Portal, where the CRM decides what they can access.
 * Uses token_hash (not PKCE) so the link works even when opened in a
 * different browser or device from the one that requested it.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash') ?? '';
  const type = request.nextUrl.searchParams.get('type') ?? '';

  const provider = getIdentityProvider();
  const identity = provider ? await provider.verifyLink(tokenHash, type) : null;
  if (!identity) return NextResponse.redirect(new URL('/login?error=link', request.url));

  const pending = await readPendingLogin();
  await setPortalSession(identity);

  const response = NextResponse.redirect(new URL(pending?.next ?? '/portal', request.url));
  response.cookies.delete(LOGIN_COOKIE);
  return response;
}
