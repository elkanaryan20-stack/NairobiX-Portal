import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { resolveAccess } from '@/lib/access/resolve';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';
import { isDemoMode } from '@/lib/crm/mode';
import { createCase, CrmUnavailableError } from '@/lib/crm/zoho/client';
import { CRM_DATA_TAG } from '@/lib/portal-data/cache';
import { CaseSubmissionError, guardAndDeduplicate, parseCaseSubmission, zohoCaseFields } from '@/lib/support/case-submission';

export const dynamic = 'force-dynamic';

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('origin') !== request.nextUrl.origin) return json({ error: 'Request rejected.' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Expected JSON.' }, 415);
    const identity = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!identity) return json({ error: 'Sign in to continue.' }, 401);
    if (isDemoMode()) return json({ error: 'Request creation is unavailable.' }, 503);

    // Resolve identity and eligibility directly on every write. Do not use the
    // short-lived page authorization cache for Case creation.
    const access = await resolveAccess(identity);
    if (access.state !== 'authorized') return json({ error: 'Your access could not be confirmed.' }, access.state === 'unavailable' ? 503 : 403);
    const principal = access.principal;
    const clientRelationship = principal.relationships.find((relationship) => relationship.type === 'client');
    if (!clientRelationship || !principal.contactId || !principal.permissions.includes('client.support')) {
      return json({ error: 'Client access could not be confirmed.' }, 403);
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 35_000) return json({ error: 'Request is too large.' }, 413);
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return json({ error: 'Check the request details and try again.' }, 400);
    }
    const input = parseCaseSubmission(body);
    const effectiveInput = input.dealId || clientRelationship.dealIds?.length !== 1
      ? input
      : { ...input, dealId: clientRelationship.dealIds[0] };
    // Assemble the payload before any write; forged identity/ownership fields
    // are rejected by the strict input parser and can never reach Zoho.
    const fields = zohoCaseFields(principal, effectiveInput);
    const result = await guardAndDeduplicate(principal, effectiveInput, () => createCase(fields));
    revalidateTag(CRM_DATA_TAG);
    return json({ id: result.record.id, duplicate: result.duplicate }, result.duplicate ? 200 : 201);
  } catch (error) {
    if (error instanceof CaseSubmissionError) return json({ error: error.message }, error.status);
    if (error instanceof CrmUnavailableError) {
      console.error('[cases] Zoho rejected/unavailable; Case creation failed closed.', error.message);
      return json({ error: 'We could not submit your request. Please try again later.' }, 503);
    }
    console.error('[cases] Case creation failed closed.', (error as Error).message);
    return json({ error: 'We could not submit your request. Please try again later.' }, 503);
  }
}
