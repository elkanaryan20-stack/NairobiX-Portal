# NairobiX Portal

One secure Portal for every relationship with NairobiX.

There is **one** Portal. Client, Partner and Staff are **Relationships** a
Contact holds with NairobiX, not separate portals, and users never choose
between them. After sign-in, the server resolves:

```
Identity (authenticated + verified)
  → Contact              lib/access/directory.ts
  → Portal Access        active / suspended / revoked (granted explicitly; Lead ≠ Portal User)
  → Relationships        Client / Partner / Staff, each scoped to an Account
  → Role                 per Relationship
  → Permissions          lib/access/permissions.ts
  → Modules + navigation lib/access/modules.ts, lib/access/navigation.ts
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portal entry: a single “Sign in to NairobiX” gateway |
| `/login` | Authentication only; never asks for a relationship |
| `/portal` | Unified authenticated Portal; opens the first authorized module, or renders the access state |
| `/portal/{client,partner,staff}/*` | Relationship-context modules inside the one Portal |
| `/portal/restricted` | Shown (URL unchanged) when a module is outside the user's permissions |
| `/client/*`, `/partner/*`, `/staff/*` | Legacy links; redirect into `/portal/...` and grant nothing themselves |

## Enforcement

- `middleware.ts` runs on every `/portal` request, including client-side
  navigations. It verifies the signed session, resolves access, and checks
  the permission for the requested module.
- `app/portal/layout.tsx` and the `app/portal/{client,partner,staff}/layout.tsx`
  context layouts re-check on the server (defense in depth).
- The session cookie (`nx_session`) is HMAC-signed and HTTP-only, and holds
  **identity only**. Relationships and permissions are re-resolved on every
  request, so the browser (query strings, localStorage, cookies) can never
  grant a privilege.

## Local development

```bash
npm install
npm run dev
```

Outside production, a **development identity provider** accepts an email
address and treats it as verified. It is disabled in production builds.

| Email | Resolves to |
| --- | --- |
| `sarah@example.com` | Client (TechStart Kenya Ltd) |
| `james@partner.com` | Partner, approved (Mwangi Business Solutions) |
| `faith@printcraft.co.ke` | Partner, still onboarding: Overview, Onboarding, Resources only |
| `grace@nairobix.com` | Staff |
| `amina@techstart.ke` | Client **and** Partner: one identity, one Portal, grouped navigation |
| `peter@example.com` | Portal access suspended → “Access unavailable” |
| any other email | Authenticated but not authorized → “No active Portal access” |

## Before production

- Connect a real identity provider in `lib/auth/provider.ts` (OIDC or email
  one-time code). Until then, production sign-in is disabled.
- Set `NAIROBIX_SESSION_SECRET` (≥ 32 chars). Without it, production sessions are rejected.
- Replace `mockPortalDirectory` (`lib/access/directory.ts`) with a CRM-backed `PortalDirectory`.
- Optionally set `NEXT_PUBLIC_NAIROBIX_SUPPORT_EMAIL` (defaults to `support@nairobix.com`).
