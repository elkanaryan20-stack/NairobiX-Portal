import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTHZ_CACHE_TAG } from '@/lib/access/server';
import { CRM_DATA_TAG } from '@/lib/portal-data/cache';

/**
 * Cache invalidation hook for Zoho CRM workflow rules.
 *
 * Point a Zoho webhook (POST) at /api/zoho/webhook with the shared secret in
 * the `x-nairobix-webhook-secret` header or a `token` URL parameter, and
 * trigger it whenever an authorization-sensitive field changes (see
 * README → Zoho webhooks). Every cached authorization decision and CRM read
 * is then discarded, so the next request re-reads the CRM.
 *
 * The request body is ignored: the hook only invalidates, it never writes.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.ZOHO_WEBHOOK_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const provided = request.headers.get('x-nairobix-webhook-secret') ?? request.nextUrl.searchParams.get('token') ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag(AUTHZ_CACHE_TAG);
  revalidateTag(CRM_DATA_TAG);
  return NextResponse.json({ revalidated: true });
}
