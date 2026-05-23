# Alouma Web — Security rules (long form)

This document is the authoritative security reference for Alouma Web. The browser is untrusted. Design every feature assuming a motivated user can read and tamper with all client-side state, storage, and API responses they receive.

Shorter entry point: [SECURITY.md](../../SECURITY.md).

---

## Current P0 prototype state

The web repo is a **mock-local skeleton** until backend wiring is explicitly requested:

- No Supabase client, API routes, or AI gateway in runtime app code yet.
- Prototype funnel flags in `lib/stores/app-store.ts` are named and documented as **temporary local UI flow only** — never treat them as auth, subscription, or entitlement truth.
- `components/navigation/route-gate.tsx` must be replaced by **server middleware + session** before production.
- Production must use: server auth → RLS → entitlement mirror → server-side checks → optional sanitized DTOs (e.g. `canExportPdf`, `planLabel`). Forbidden client field names include `hasActiveSubscription`, `isVerified`, and raw billing/entitlement rows.

---

## 1. Browser is not trusted

Anything sent to the browser can be read, copied, modified, replayed, or faked.

This includes:

- React state
- Serialized props and page data
- `localStorage`, `sessionStorage`, IndexedDB
- Non-HttpOnly cookies
- JavaScript bundles
- Network responses visible to DevTools
- Every `NEXT_PUBLIC_*` environment variable

The frontend may **display** state. It must **never** be the authority for:

- Identity
- Subscription or paid access
- Verification status
- Entitlements
- AI usage limits
- Admin status
- Account deletion state
- Object ownership (resumes, drafts, jobs, files)

If a feature “works” only because the UI hides a button or a Zustand flag says the user is subscribed, it is not secure.

---

## 2. Never expose server secrets

Never expose these to client code, client bundles, or `NEXT_PUBLIC_*`:

| Secret | Notes |
|--------|--------|
| Supabase service role key | Bypasses RLS |
| Supabase secret key | Same class as service role |
| Database URL / password | Direct DB access |
| RevenueCat secret API key | Billing manipulation |
| RevenueCat webhook secret | Forged webhooks |
| OpenAI / Anthropic / AI keys | Cost and data exfiltration |
| Webhook signing secrets | Forged events |
| Admin tokens | Privilege escalation |
| Private integration keys | Third-party abuse |

**Never** prefix a secret with `NEXT_PUBLIC_`. Anything under `NEXT_PUBLIC_` is embedded in the client bundle and is public forever.

### Allowed public environment values

Only these classes of values may be public (when backend is wired):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or anon key
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV`

Do not commit `.env` files with real secrets. Use platform secret stores for preview/staging/production.

---

## 3. Supabase rule

The Supabase project URL and publishable/anon key may be public **only because Row Level Security (RLS) is the real protection**.

### Before production

Every user-owned table must have RLS **enabled** and **tested**.

Required sensitive tables (current and planned):

- `profiles`
- `onboarding`
- `resumes`
- `ai_usage_daily`
- `entitlements`
- `analytics_events`
- Future: jobs, suggestions, exports, `support_messages`, files, billing mirror tables

No table should rely on “the client filters results in JavaScript” as security.

### Anti-pattern vs correct pattern

**Bad:** Client selects `select * from resumes` and filters `user_id === currentUser.id` in the browser.

**Good:** RLS policy ensures `auth.uid()` matches `user_id`. Queries use scoped filters. The API returns only fields needed for the screen.

### Minimum RLS policy patterns

User-owned rows keyed by `user_id`:

```sql
create policy "users_own_rows"
on public.resumes
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

Profiles where `id` matches `auth.users.id`:

```sql
create policy "users_own_profile"
on public.profiles
for all
using (id = auth.uid())
with check (id = auth.uid());
```

Test policies with multiple users. Service role keys belong only in server/Edge environments, never in the browser.

---

## 4. No raw backend truth in the browser

Do not send raw database or auth fields to the client for “convenience.” Examples of fields that must not appear in client state, props, or API JSON:

- `user.isVerified`
- `user.hasActiveSubscription`
- `user.isAdmin`
- `user.entitlementStatus`
- `user.subscriptionExpiresAt`
- `user.revenueCatCustomerId`
- `user.aiAssistLimit` / `user.aiAssistsUsed`
- `user.deletedAt` / `user.scheduledPurgeAt`
- Internal role flags
- Raw `entitlements` or billing mirror rows

### Sanitized display DTOs

The client may receive **derived, minimal** values for UI copy and affordances:

```ts
type ViewerAccessDTO = {
  canUseAi: boolean
  canExportPdf: boolean
  planLabel: 'Trial' | 'Pro' | 'Free' | 'Expired'
}
```

Even these are **hints for rendering**. Every protected action (export, AI call, premium template, sync) must re-validate on the server at execution time.

### Current codebase note

Mock/local flow flags (e.g. subscription booleans in Zustand for routing demos) are acceptable only during pre-backend prototyping. They must not ship as real authorization. Replace with server-derived DTOs before production.

---

## 5. Subscription and entitlement rule

The browser is never the source of truth for paid access.

### Authoritative chain

```
App Store / Play Store
  → RevenueCat
  → RevenueCat webhook (verified signature)
  → Supabase entitlement mirror
  → Server / Edge Function authorization
  → Sanitized ViewerAccessDTO (optional, for UI)
```

### Protected actions (non-exhaustive)

Re-check entitlement server-side immediately before:

- AI rewrite, review, summary, skills suggestions
- PDF export (if premium-gated)
- Premium template use
- Cloud sync
- Job match / tailoring
- Full CV review

UI gating (disabled buttons, hidden nav items) improves UX only; it does not replace server checks.

---

## 6. Server-only data layer

Sensitive reads and writes must follow this stack:

```
┌─────────────────┐
│ Client Component │  display + user input only
└────────┬────────┘
         │ calls
┌────────▼────────────────────────┐
│ Server Component / Action / API │
└────────┬────────────────────────┘
         │
┌────────▼────────────────────────┐
│ server-only data module          │  import 'server-only'
└────────┬────────────────────────┘
         │
┌────────▼────────────────────────┐
│ Supabase (RLS) or Edge Function │
└────────┬────────────────────────┘
         │
┌────────▼────────────────────────┐
│ Sanitized DTO → client           │
└─────────────────────────────────┘
```

### Forbidden pattern

```
Client Component
  → createBrowserClient with elevated privileges
  → SELECT raw rows
  → if (row.is_premium) { allow }
```

In Next.js:

- Put secrets and privileged Supabase clients in modules marked `import 'server-only'`.
- Never import those modules from `"use client"` files.
- Do not pass service role keys through Server Component props to the client.

---

## 7. API routes and server actions

Every private endpoint must:

1. **Authenticate** — valid session or bearer token
2. **Authorize** — user may perform this action on this resource
3. **Validate input** — Zod or equivalent schema; reject oversize payloads
4. **Prove ownership** — resume/job/draft belongs to `auth.uid()`
5. **Use RLS** — even if app code checks ownership, RLS is the last line of defense
6. **Return minimal data** — sanitized DTOs, not `select *`
7. **Fail safely** — generic errors in production; no stack traces to clients
8. **Log carefully** — no secrets, tokens, or full user content in logs

### HTTP methods

- Do not perform mutations via GET.
- State-changing operations: POST, PATCH, DELETE, or equivalent server actions with the same protections.
- If using cookie-based session auth, apply CSRF protections on mutating routes.

---

## 8. Object ownership

Never trust identifiers from the URL or request body alone.

Examples:

| Surface | Requirement |
|---------|-------------|
| `/builder/:resumeId` | Server loads resume only if `resume.user_id === auth.uid()` |
| `/api/resumes/:resumeId` | Same ownership check before read/update/delete |
| `/api/ai/review` | Resume ID in body must belong to authenticated user |

Return `404` or `403` consistently; avoid leaking whether an ID exists for another user.

---

## 9. AI gateway rules

### Hard rules

- **No** direct calls to OpenAI, Anthropic, or other providers from the browser.
- All AI traffic through Next.js API routes, Server Actions, or Supabase Edge Functions.
- Provider keys live only in server/Edge secret storage.

### Per-request requirements

- Authenticated user
- Entitlement and assist budget read **server-side**
- Rate limits by user id and IP (and app-wide caps where needed)
- Strict payload validation (shape, max length, allowed fields)
- Send minimum necessary context to the model
- Return **suggestions** only; user approves before applying to `resume_json`
- Increment `ai_usage_daily` (or equivalent) atomically
- Log metadata only by default

### Do not store or log by default

- Raw prompts
- Raw model responses
- Full CV snapshots
- Full job descriptions
- Hidden suggestion history

### Allowed AI logs (examples)

- Request id
- Endpoint name
- HTTP status
- Latency
- Token usage (if available)
- Error code (non-sensitive)
- Hashed or internal user id

Product rules (from product direction): AI suggestions are previews, never automatic overwrites.

---

## 10. CV and document data rules

`resume_json` is sensitive personal data.

- Fetch full CV JSON only in authenticated flows that need it: editor, preview/export, AI with explicit scope.
- Do **not** embed full CV JSON in dashboard list responses, global layout, marketing pages, analytics payloads, error reports, or subscription screens.
- Do not store exported PDFs in Supabase for v1 unless explicitly designed and disclosed.
- Public marketing examples: synthetic fixtures or manually approved content — never real user CVs.

---

## 11. XSS and untrusted content

User-provided and AI-generated content is untrusted:

- CV sections, job descriptions, company names, links, support messages

Defaults:

- Render plain text.
- Avoid `dangerouslySetInnerHTML`.
- If rich text is required, use a strict HTML allowlist sanitizer and document the threat model.

### URLs

Validate user-supplied URLs:

- Allow `https:`, and `mailto:` / `tel:` where product-appropriate
- Reject `javascript:`, dangerous `data:` URLs, malformed URLs, and hidden control characters

---

## 12. Logging and analytics

Analytics must be minimal and privacy-preserving unless explicit product/legal approval exists.

### Allowed milestone-style events (examples)

- `account_created`
- `onboarding_started` / `onboarding_completed`
- `resume_created` / `resume_duplicated`
- `target_job_added`
- `ai_experience_rewrite_used`, `ai_skills_used`, `ai_summary_used`, `ai_cv_review_used`
- `pdf_exported`
- `trial_started`, `subscription_activated`
- `account_deletion_requested`

### Never log

- CV text or job description text
- AI prompts or responses
- Auth tokens, cookies, or `Authorization` headers
- Service keys
- Raw request bodies containing user content
- Full email or profile payloads in analytics

Do not add third-party analytics or tracking scripts without explicit instruction and documentation (CSP, privacy policy).

---

## 13. Security headers (production)

Production deployments should set at least:

| Header | Purpose |
|--------|---------|
| `Strict-Transport-Security` | Force HTTPS |
| `X-Content-Type-Options: nosniff` | Reduce MIME sniffing |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | Disable camera/mic/geo/payment unless needed |
| `X-Frame-Options` or CSP `frame-ancestors` | Clickjacking protection |
| `Content-Security-Policy` | Restrict script/style/connect sources |

CSP should default to `'self'` and allow external origins only when documented and necessary.

Before adding any third-party script, document:

- Why it is required
- What data it collects
- Required CSP origins
- Privacy policy impact

---

## 14. CORS

CORS configures which browsers may read responses; it does **not** authenticate users.

- No `Access-Control-Allow-Origin: *` on authenticated API routes
- No wildcard origin with `credentials: include`
- Maintain an explicit origin allowlist per environment
- Keep public marketing endpoints separate from authenticated product APIs

---

## 15. Account deletion and privacy

Web flows must align with mobile app commitments:

1. Verify fresh authentication (re-auth or recent session)
2. Mark account deletion requested
3. Block further product access
4. Soft-delete user-owned rows
5. Schedule permanent purge after grace period
6. Permanently delete after grace; retain only truly anonymous aggregates if legally/operationally required

### Recommended public routes

- `/privacy`
- `/terms`
- `/support`
- `/privacy-choices`
- `/delete-account`
- `/cookies` (if cookies or analytics cookies are used)

Do not claim privacy features in UI that are not implemented.

---

## 16. Deployment and environments

| Environment | Purpose |
|-------------|---------|
| local | Developer machines |
| preview | PR previews |
| staging | Pre-production integration |
| production | Real users |

- Do not point preview deployments at production Supabase, RevenueCat, or AI billing without explicit review.
- Production release checklist: build, typecheck, lint, secret scanning, env var audit, security review for auth/payments/AI/data changes.

---

## 17. Dependency and supply chain

Before adding a dependency:

- Is it necessary?
- Does it run in the browser?
- Does it phone home or collect telemetry?
- Does it inject third-party scripts?
- Does it require new CSP `connect-src` or `script-src` entries?
- Is it maintained?
- How much does it add to the bundle?

Keep `package-lock.json` committed. Avoid tag managers and passive analytics SDKs unless approved.

---

## 18. Pull request security checklist

Use this for PRs touching auth, data, AI, subscriptions, billing, API routes, server actions, Supabase, or environment variables:

- [ ] No secrets in client code or `NEXT_PUBLIC_*`
- [ ] No raw profile/entitlement/resume rows to the client
- [ ] RLS enabled and tested on affected tables
- [ ] Object ownership verified server-side
- [ ] Premium/AI actions gated server-side at action time
- [ ] AI routes use server-only keys; no prompt/response logging
- [ ] Inputs validated with schemas
- [ ] No state-changing GET routes
- [ ] Logs and analytics redact sensitive content
- [ ] Third-party scripts documented; CSP/headers still valid

---

## Agent and IDE rules

Cursor agents should follow `.cursor/rules/web-security.mdc` in addition to this document. Older `.cursor/rules/50-security-backend.mdc` covers Supabase wiring timing and product-specific AI/privacy defaults; when rules conflict, **this document and `web-security.mdc` win** for security posture.
