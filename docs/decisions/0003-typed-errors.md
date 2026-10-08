# 0003 — Typed errors + safe API envelope

Date: 2026-10-08
Status: accepted

## Context

Clients need stable, machine-readable failures; users need human messages; and
neither should ever see a stack trace or an absolute path.

## Decision

Domain errors carry a stable code (`TRIP_NOT_FOUND`, `TRIP_EXISTS`,
`VALIDATION_FAILED`, `STORAGE_ERROR`). The backend maps them to 404/409/400/500
with `{code, message, path, timestamp}` and generic 500 bodies; the Next.js
actions use the same `{ error }` shape. Causes stay in server logs.

## Consequences

- Good: CLI, UI, and API share one error language; safe to show, safe to log.
- Bad: none worth noting — the mapping lives in one handler per side.
