# Alouma Web — Security

The browser is **not trusted**. Anything sent to the client can be read, copied, modified, replayed, or faked. The frontend may display state; it must never be the authority for identity, subscription, verification, entitlements, AI limits, admin status, deletion state, or object ownership.

Long-form reference: [docs/security/web-security-rules.md](docs/security/web-security-rules.md).

---

## Current P0 prototype state

As of the skeleton phase:

- There is **no** live Supabase, API routes, RevenueCat, or AI provider integration in app runtime code.
- Funnel progress uses **prototype-only** Zustand flags (`mockAuthCompleted`, `mockOnboardingCompleted`, `mockPaywallCompleted`, etc.). These are **not** authentication, entitlements, or subscription state.
- `RouteGate` is a **local development UX redirect only** — not production route protection. Production requires server middleware, session auth, RLS, and sanitized access DTOs.
- Do **not** reintroduce client-persisted or client-authoritative names such as `hasActiveSubscription`, `isLoggedIn`, or raw entitlement rows.

---

## Core invariants

### 1. Browser is not trusted

Treat as public and attacker-controlled:

- React state, serialized props, page data
- `localStorage`, `sessionStorage`, IndexedDB
- Non-HttpOnly cookies
- JavaScript bundles and network responses
- All `NEXT_PUBLIC_*` environment variables

### 2. Never expose server secrets

**Never** ship to client code or `NEXT_PUBLIC_*`:

- Supabase service role / secret keys
- Database URL or password
- RevenueCat secret or webhook signing keys
- OpenAI / Anthropic / other AI provider keys
- Webhook signing secrets, admin tokens, private integration keys

`NEXT_PUBLIC_*` is public forever. Allowed public env values only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key)
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV`

### 3. Supabase and RLS

The Supabase URL and publishable/anon key may be public **only** because RLS is the real protection.

Every user-owned table must have RLS enabled before production, including: `profiles`, `onboarding`, `resumes`, `ai_usage_daily`, `entitlements`, `analytics_events`, and any future jobs, suggestions, exports, support, files, or billing mirror tables.

**Bad:** client fetches many rows and filters by `user_id` in JS.  
**Good:** server/RLS enforces ownership; queries are scoped; returned data is minimized.

Minimum policy pattern:

```sql
using (user_id = auth.uid())
with check (user_id = auth.uid())
```

For `profiles` where `id` equals `auth.users.id`:

```sql
using (id = auth.uid())
with check (id = auth.uid())
```

### 4. No raw backend truth in the browser

Do not expose raw fields such as: `isVerified`, `hasActiveSubscription`, `isAdmin`, `entitlementStatus`, `subscriptionExpiresAt`, `revenueCatCustomerId`, `aiAssistLimit`, `aiAssistsUsed`, `deletedAt`, `scheduledPurgeAt`, internal role flags, raw entitlement/billing rows.

The client may receive **sanitized display DTOs** only, for example:

```ts
type ViewerAccessDTO = {
  canUseAi: boolean
  canExportPdf: boolean
  planLabel: 'Trial' | 'Pro' | 'Free' | 'Expired'
}
```

DTO values are for rendering only. Every protected action must still be checked server-side.

### 5. Subscription and entitlements

Authoritative chain:

**App Store / RevenueCat → RevenueCat webhook → Supabase entitlement mirror → server/Edge authorization → sanitized client DTO**

Premium actions must re-check entitlement server-side at the moment of action (AI rewrite, AI review, gated PDF export, premium templates, cloud sync, job match, full CV review, tailoring, etc.). Hiding a button is not protection.

### 6. Server-only data layer

Required pattern:

```
Client Component
  → Server Component / Server Action / API Route
  → server-only data access layer
  → Supabase (RLS) or Edge Function
  → sanitized DTO
  → Client Component
```

Forbidden:

```
Client Component → direct privileged query → raw row → client decides access
```

Use `import 'server-only'` in server-only modules. No Client Component may import server-only env/config/data files.

### 7. API routes and server actions

All private routes/actions must:

- Require authentication
- Verify authorization and object ownership
- Validate input with a schema
- Rely on RLS as the final boundary
- Return minimal sanitized data
- Avoid raw stack traces in production
- Avoid logging secrets or sensitive user content

No mutations via GET. Use POST/PATCH/DELETE or protected server actions. If cookie auth is used, protect mutations against CSRF.

### 8. Object ownership

Never trust route params (`resumeId`, `draftId`, `jobId`, `userId`). The server must prove the object belongs to the current user before read or write.

### 9. AI gateway

- No direct AI provider calls from the browser
- All AI through server routes or Supabase Edge Functions
- Authenticate, check entitlement and assist budget server-side, rate-limit, validate payload size/shape, use server-only keys, return suggestions only (never auto-overwrite CV), increment usage atomically
- Log metadata only — not raw prompts, responses, full CV snapshots, or full job descriptions by default

### 10. CV / document data

`resume_json` is sensitive. Fetch full CV JSON only for authenticated builder/editor/export flows that need it. Do not include full CV JSON in dashboards, layout state, landing pages, analytics, error logs, AI logs, or subscription pages. Public examples must be synthetic or manually approved.

### 11. XSS and user content

CV text, job descriptions, links, and AI output are untrusted. Render as text by default. Avoid `dangerouslySetInnerHTML` unless strictly sanitized with an allowlist. Validate URLs (`https`, `mailto`, `tel` only where appropriate); reject `javascript:`, unsafe `data:`, and malformed URLs.

### 12. Logging and analytics

Use minimal milestone-style events only. Never log CV text, job descriptions, AI prompts/responses, auth tokens, cookies, authorization headers, service keys, or raw request bodies with user content.

### 13. Security headers (production)

Baseline: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, restrictive `Permissions-Policy`, frame protection (`X-Frame-Options` or CSP `frame-ancestors`), and a strict Content-Security-Policy. Document any third-party script: why, data collected, CSP origin, privacy impact.

### 14. CORS

CORS is not authentication. No wildcard CORS on authenticated routes; no wildcard with credentials. Use explicit origin allowlists; separate public marketing from authenticated product APIs.

### 15. Account deletion and privacy

Support deletion flows: fresh auth verification, mark deletion requested, block product access, soft-delete user rows, schedule purge, permanent delete after grace period. Required/recommended pages: `/privacy`, `/terms`, `/support`, `/privacy-choices`, `/delete-account`, `/cookies` (if cookies/analytics are used).

### 16. Environments and deployment

Use separate local, preview, staging, and production environments. Do not use production Supabase/RevenueCat/AI secrets in preview unless explicitly reviewed. Production deploy should require build, typecheck, lint, secret scan, env audit, and security review for auth/payments/AI/data changes.

### 17. Dependencies

Before adding packages: necessity, client-side execution, data collection, script injection, CSP origins, maintenance, bundle size. Keep lockfile committed. Avoid unnecessary analytics/tag managers.

---

## Pull request security checklist

For every PR touching **auth, data, AI, subscriptions, billing, API routes, server actions, Supabase, or environment variables**, confirm:

- [ ] No secrets exposed to the client
- [ ] No new `NEXT_PUBLIC_` secret or misnamed public env
- [ ] No raw user/profile/entitlement/resume rows returned to the client
- [ ] RLS still protects all user-owned tables
- [ ] Object ownership is verified server-side (not route params alone)
- [ ] Premium access is checked server-side at action time
- [ ] AI endpoints do not expose provider keys
- [ ] AI endpoints do not log raw prompts/responses
- [ ] Inputs are schema-validated
- [ ] Mutations are not GET routes
- [ ] Logs redact sensitive content
- [ ] Third-party scripts/services are documented (CSP, privacy)
- [ ] CSP / security headers remain valid

---

## Reporting issues

Report suspected vulnerabilities privately to the project maintainers. Do not open public issues for undisclosed security bugs.

---

## Related docs

- [docs/security/web-security-rules.md](docs/security/web-security-rules.md) — full rules and examples
- `.cursor/rules/web-security.mdc` — agent enforcement rules
