/**
 * Portal session: an HMAC-signed, HTTP-only cookie carrying the
 * authenticated identity — and nothing else.
 *
 * Authentication ≠ Authorization. The session proves who the user is; it
 * never stores Relationships, Roles or Permissions. Those are re-resolved on
 * the server for every request (lib/access/resolve.ts), so revoking access in
 * the directory takes effect immediately and a tampered cookie can't grant
 * anything — a modified payload fails signature verification.
 *
 * Uses Web Crypto only, so the same code runs in middleware (edge) and in
 * server components / actions (Node).
 */

import type { VerifiedIdentity } from '@/lib/access/types';

export const SESSION_COOKIE = 'nx_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const DEV_FALLBACK_SECRET = 'nairobix-development-only-session-secret';

interface SessionPayload {
  sub: string;
  prv: string;
  email: string;
  ev: boolean;
  iat: number;
  exp: number;
}

/** Signing secret. In production a missing secret disables sessions entirely rather than falling back. */
function getSessionSecret(): string | null {
  const secret = process.env.NAIROBIX_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== 'production') return DEV_FALLBACK_SECRET;
  return null;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

export async function createSessionToken(identity: VerifiedIdentity): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error('NAIROBIX_SESSION_SECRET is not configured (min. 32 characters).');

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: identity.subject,
    prv: identity.provider,
    email: identity.email,
    ev: identity.emailVerified,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign('HMAC', await getKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the identity for a valid, unexpired token; null for anything else. Never throws. */
export async function verifySessionToken(token: string | undefined): Promise<VerifiedIdentity | null> {
  if (!token) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra !== undefined) return null;

  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await getKey(secret),
      fromBase64Url(signature),
      encoder.encode(body)
    );
    if (!valid) return null;

    const payload = JSON.parse(decoder.decode(fromBase64Url(body))) as Partial<SessionPayload>;
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.prv !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.ev !== 'boolean' ||
      typeof payload.exp !== 'number' ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { subject: payload.sub, provider: payload.prv, email: payload.email, emailVerified: payload.ev };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
