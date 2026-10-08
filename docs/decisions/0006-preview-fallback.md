# 0006 — Build before you save (preview fallback)

Date: 2026-10-08
Status: accepted

## Context

Generating an itinerary and storing it are two different jobs, but the page
coupled them: a failed save discarded a perfectly good trip and showed a
dead-end error instead.

## Decision

`generateTrip` returns the built trip as `{ preview }` when persistence fails,
and the client renders it with browser persistence (`preview-store`,
localStorage, capped) so it survives reloads and appears in My Trips with an
"In this browser" badge. Hard errors stay for generation itself failing.

## Consequences

- Good: viewing never depends on saving; demo works fully offline.
- Bad: browser-saved trips don't sync across devices — stated in the UI badge.
