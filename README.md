# NairobiX Portal

One secure Portal for every relationship with NairobiX — production origin
**https://portal.nairobix.com**.

There is **one** Portal. Client, Opportunity Network Participant and Staff are
**Relationships** a person holds with NairobiX, not separate portals, and users
never choose between them. **Zoho CRM is the system of record**; Supabase Auth
only proves who someone is.

```
Supabase Auth (passwordless email)      → verified email          (authentication)
  → Zoho CRM                            lib/access/zoho-directory.ts (authorization)
      Client       Contacts.Email → Contacts.Account_Name → Deal on that Account:
                   Stage = Closed Won, Portal_Required = true,
                   Contact_Name = this Contact, Primary_Contact_Confirmed = true
                   → Contacts.Portal_Access_Status = Active
      Participant  Contacts.Email → Opportunity_Network_Participants.Contact:
                   Participant_Status = Active AND Portal_Access_Status = Active
      Staff        an active Zoho CRM User
      Gates        Contact not Inactive/Archived; its Account not Inactive/Archived
  → Permissions   lib/access/permissions.ts
  → Modules + navigation lib/access/modules.ts, lib/access/navigation.ts
```

Not used for access: `Contacts.NairobiX_Relationship`, `Accounts.Relationship_Type`,
Client Onboarding status, and Participation Type (a relationship attribute, not
an entitlement). The exact field mapping lives in `lib/crm/zoho/schema.ts`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portal entry: a single “Sign in to NairobiX” gateway |
| `/login` | Email → magic link + one-time code; never asks for a relationship |
| `/auth/callback` | Magic-link landing; issues the Portal session |
| `/portal` | Unified Portal; opens the first authorized module, or renders the access state |
| `/portal/{client,participant,staff}/*` | Relationship-context modules inside the one Portal |
| `/portal/restricted` | Where a module outside the user's permissions redirects |
| `/api/zoho/webhook` | Zoho workflow hook that clears cached authorization and CRM reads |
| `/client/*`, `/partner/*`, `/staff/*`, `/portal/partner/*` | Legacy links; redirect into `/portal/...` and grant nothing |

## Enforcement

- `middleware.ts` rejects any `/portal` request without a valid signed session.
- Authorization runs on the server in `app/portal/layout.tsx`, the context
  layouts, and **every module page** (`requireModule` in `lib/access/server.ts`).
- Decisions and CRM reads are cached per email / per Account for
  `NAIROBIX_AUTHZ_CACHE_TTL_SECONDS` (default 5 minutes) in the Next.js data
  cache, so Zoho isn't called on every render. `/api/zoho/webhook` clears the
  cache when CRM data changes. Failed CRM lookups are never cached.
- **Fails closed:** no session, unknown email, ineligible relationship, non-Active
  portal access, or any CRM error → no access. Production never uses demo data.
- The session cookie (`nx_session`) is HMAC-signed and HTTP-only and holds
  **identity only**.

## Data

Pages load data server-side through `lib/portal-data/`, scoped by the
server-resolved relationship: Client → its Account's records (Engagements,
Cases, Invoices, Zoho Sign documents); Participant → its own Participant record
and linked documents; Staff → operational data across Accounts. Sections with no
authoritative CRM source show a “not yet available” state in production.

## Local development

```bash
npm install
npm run dev
npm test                 # authorization rules (no network)
npm run test:zoho-live   # read-only smoke test against the real CRM (.env.local)
```

Outside production, without Supabase configured, a **development identity
provider** accepts any email as verified, and the Portal uses demo data
(`NAIROBIX_CRM=zoho` switches development to the real CRM). Neither is
reachable in production builds.

| Demo email | Resolves to |
| --- | --- |
| `sarah@example.com` | Client (TechStart Kenya Ltd) |
| `james@partner.com` | Participant, approved (all demo capabilities) |
| `faith@printcraft.co.ke` | Participant, still onboarding |
| `grace@nairobix.com` | Staff |
| `amina@techstart.ke` | Client **and** Participant |
| `peter@example.com` | Portal access suspended |
| any other email | No active Portal access |

## Production configuration

See `.env.example` for every variable. Manual setup:

- **Vercel:** add `portal.nairobix.com`; set the variables in `.env.example`
  for Production (and separate values for Preview).
- **Cloudflare:** `CNAME portal → cname.vercel-dns.com`, DNS-only (grey cloud).
- **Supabase Auth:** Site URL `https://portal.nairobix.com`; redirect URL
  `https://portal.nairobix.com/auth/callback`; Email provider on; custom SMTP.
  In the **Magic Link** and **Confirm signup** templates, link to
  `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`
  and include the code `{{ .Token }}`.
- **Zoho CRM:** a Self Client with `ZohoCRM.modules.READ` and `ZohoCRM.users.READ`.
  Workflow rules that POST to `/api/zoho/webhook` (header
  `x-nairobix-webhook-secret`) when Contacts (`Email`, `Account_Name`,
  `Contact_Status`, `Portal_Access_Status`), Accounts (`Account_Status`),
  Deals (`Stage`, `Portal_Required`, `Contact_Name`, `Primary_Contact_Confirmed`,
  `Account_Name`) or Opportunity Network Participants (`Contact`,
  `Participant_Status`, `Portal_Access_Status`, `Participation_Type`) change.
  CRM User deactivation can't trigger a workflow; it takes effect within the cache TTL.
