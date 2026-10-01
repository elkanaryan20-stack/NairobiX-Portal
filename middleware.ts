import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';
import { PORTAL_ROOT } from '@/lib/access/modules';

/**
 * Portal gate — authentication only. Runs on every /portal request (full
 * page loads and client-side navigations) and rejects anything without a
 * valid signed session before any Portal code runs.
 *
 * Authorization (CRM Relationships → Permissions) is decided on the server
 * by the Portal layout and by every module page (lib/access/server.ts), which
 * share a short-lived authorization cache. Doing it here would mean a CRM
 * call per request, because middleware cannot use that cache.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const identity = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (identity) return NextResponse.next();

  const login = new URL('/login', request.url);
  if (pathname !== PORTAL_ROOT) login.searchParams.set('next', pathname);
  const response = NextResponse.redirect(login);
  // Drop an invalid or expired cookie so it isn't re-sent.
  if (request.cookies.has(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: ['/portal', '/portal/:path*'],
};
