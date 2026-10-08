# Security notes

Threat model is small on purpose: local-first demo, no auth yet (ADR-0004).
Don't expose either server beyond localhost until auth returns.

What we do today:

- **Input validation first:** Zod schemas on every server action (city lengths,
  budget capped at 1 Cr), bean validation on the Spring API, rate limits +
  50-trip quota per owner bucket.
- **Owner scoping:** all reads/writes scope by resolved owner id; missing vs
  someone else's returns the same 404 so ids can't be probed.
- **Safe errors:** `{code, message}` envelopes with stable codes, no stack traces
  or paths in responses. Details go to server logs only.
- **No secrets in code:** Supabase keys come from `.env.local` (git-ignored,
  see `.env.example`). Dummy keys fail closed to previews, never to leaks.
- **Third-party content:** map tiles (OSM) and photos (Unsplash + picsum
  fallback) are remote images only — no scripts, no keys, attribution kept.
  CSP in `next.config.ts` already limits `img-src` and `connect-src`.

Out of scope (be honest about it):

- No authN/authZ — everyone without a session shares the `local-demo` bucket.
  Don't use it for anything private. RLS still applies, just with a shared id.
- No rate limiting on the Spring API itself, no TLS termination in-app.
- Dependencies: `npm audit` + Dependabot monthly; deserialization bugs age badly.

Reporting: open a private issue or email the maintainer. Redact trip names and
amounts before pasting anything into public issues.
