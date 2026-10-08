# Changelog

## 1.0.1

First versioned release.

- AI-planned itineraries from duration, vibe, and budget tier, with day-wise
  timelines, food guides, and keyless OpenStreetMap routing (nearest-first walk
  order, transit legs kept off the walking line).
- Photos throughout with graceful fallbacks — a dead remote image degrades to a
  placeholder, never a broken icon.
- Browser-persisted previews: trips built without a database stay available
  across visits under an "In this browser" badge.
- Spring Boot API (Java 17) for trip rules and exact expense splits
  (minor-units money, balances, settle-up) with a typed error envelope.
- Zero-setup demo identity: no sign-in required; rate limits and trip quotas
  apply per demo bucket.
