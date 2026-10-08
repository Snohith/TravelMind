# 0001 — Java Spring Boot for the API

Date: 2026-10-08
Status: accepted

## Context

The product is a trip planner with real domain rules: trip date validation,
itinerary overlap checks, and exact expense splitting. Those rules deserve a
typed home with transactions and bean validation, next to the Next.js frontend
that consumes them.

## Decision

Spring Boot 3 (Java 17) under `backend/`, layered by feature — `trip/`,
`itinerary/`, `expense/` each own entity + repository + service + controller +
DTOs, shared bits in `common/`. JPA + file-backed H2 for local runs (swap the
datasource URL for Postgres when sharing needs it). Controllers stay thin and
never return entities; money never touches float (see ADR-0002).

## Consequences

- Good: one tested place for pricing, validation, and error shape; the
  frontend gets `X-User-Id`-scoped endpoints with a stable `{code, message}`
  envelope.
- Bad: two trip stores for now (Supabase itineraries + backend trips for
  splits) — `docs/glossary.md` keeps the words aligned until they converge.
