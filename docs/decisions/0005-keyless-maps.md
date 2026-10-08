# 0005 — Keyless map tiles (OpenStreetMap standard)

Date: 2026-10-08
Status: accepted

## Context

Key-gated tile providers watermark or blank the map the moment a key lapses —
exactly what happened with CARTO raster. A travel app with a broken map is a
broken app, and demo environments shouldn't depend on provisioned keys.

## Decision

OSM standard tiles: no key, no account, no billing, attribution kept
(`© OpenStreetMap contributors`). Light-styled against our dark UI — accepted
tradeoff, noted in `RealMap.tsx`. All photos render through `SafeImage` with a
deterministic fallback for the same reason: remote assets rot, the UI must not.

## Consequences

- Good: maps work with zero setup, forever, within OSM's tile policy.
- Bad: light tiles on a dark theme; heavy traffic needs a keyed provider or
  self-hosted tiles first — the revisit trigger sits in the code comment.
