import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';
import { resolveAccess } from '@/lib/access/resolve';
import { PORTAL_RESTRICTED_PATH, PORTAL_ROOT, defaultModulePath, moduleForPath } from '@/lib/access/modules';

/**
 * Portal gate. Runs on every /portal request — full page loads and
 * client-side navigations (RSC requests) alike — and decides from the
 * server-resolved principal only. Nothing in the URL, headers or client
 * storage is consulted for authorization.
 *
 *   no valid session           → /login
 *   authenticated, not authorized → /portal (renders the access state)
 *   authorized, at /portal     → first authorized module
 *   authorized, module denied  → restricted view (URL unchanged)
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const identity = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const access = await resolveAccess(identity);

  if (access.state === 'unauthenticated') {
    const login = new URL('/login', request.url);
    if (pathname !== PORTAL_ROOT) login.searchParams.set('next', pathname);
    const response = NextResponse.redirect(login);
    // Drop an invalid or expired cookie so it isn't re-sent.
    if (request.cookies.has(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (access.state !== 'authorized') {
    return pathname === PORTAL_ROOT ? NextResponse.next() : NextResponse.redirect(new URL(PORTAL_ROOT, request.url));
  }

  if (pathname === PORTAL_ROOT) {
    const home = defaultModulePath(access.principal) ?? PORTAL_RESTRICTED_PATH;
    return NextResponse.redirect(new URL(home, request.url));
  }

  const portalModule = moduleForPath(pathname);
  if (portalModule && !access.principal.permissions.includes(portalModule.permission)) {
    return NextResponse.rewrite(new URL(PORTAL_RESTRICTED_PATH + search, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal', '/portal/:path*'],
};
