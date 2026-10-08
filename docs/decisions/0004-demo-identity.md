# 0004 — Start with a shared demo identity, add auth later

Date: 2026-10-08
Status: accepted

## Context

Sign-in gates everything — generating, viewing, demoing. For a project at this
stage, the gate costs more than it protects, and session machinery nobody asked
for yet would just be surface area to maintain.

## Decision

No login UI for now. Server actions resolve ownership via `lib/demo-user.ts`
(session id if one ever exists, shared `local-demo` bucket otherwise), with the
same rate limits and 50-trip quota every future account gets. That function is
the whole change when sign-in lands: return the session user id first, keep
the demo fallback for logged-out browsing or delete it outright.

## Consequences

- Good: every flow works with zero setup; no dead buttons, no redirect maze.
- Bad: the demo bucket is shared — nothing private belongs in it. RLS still
  scopes by `user_id`, just with a shared id until auth arrives.
