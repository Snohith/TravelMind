# 🌴 TravelMind

> AI-powered travel planner + interactive itinerary generator. Next.js 16 frontend,
> Supabase for auth + saved trips, and a Spring Boot backend for trip rules and
> expense splits. No Python anywhere — Java is the only backend language here.

## What it does

- **Smart itineraries** — context-aware days from duration, vibe, and budget tier,
  with Leaflet maps and zero-asset SVG markers.
- **Tiered budgets** — activity/transport pricing across budget, standard, luxury.
- **Expense splits** (new, via backend) — who-paid-what in exact minor units,
  balances, and settle-up lines. Floats never touch money.
- **Saved trips** — dashboard history per user, owner-scoped reads/writes.

## Run it

Needs Node 20+ for the frontend, Java 17 + Maven for the backend. No sign-in —
no sign-in yet (ADR-0004), everything works out of the box on a shared demo bucket.

```bash
# 1. frontend
cp .env.example .env.local   # fill in Supabase URL + anon key
npm install
npm run dev                  # http://localhost:3000

# 2. backend (second terminal)
cd backend && ./scripts/run.sh   # http://localhost:8080, H2 file in backend/.data
```

Backend endpoints (header `X-User-Id` set by the server layer in prod, by you in dev):

```bash
curl -s localhost:8080/actuator/health
curl -s -H 'X-User-Id: demo' localhost:8080/api/v1/trips
```

Docker: `docker compose up --build` (backend API + frontend; Supabase stays hosted).

## Layout

```
src/                 Next.js frontend (app router, components, lib, data)
  app/actions/       server actions — trips.ts owns saved-trip reads/writes
  data/              itinerary builder (mock-itinerary.ts) + city knowledge
  components/        SearchForm, maps, timeline, food/packing guides
backend/             Spring Boot API (Java 17, JPA + H2 file)
  src/main/.../trip        Trip entity/service/controller + DTOs
  src/main/.../itinerary   Stop entity, overlap + duration rules, days view
  src/main/.../expense     Money (minor units), balances, settle-up
  src/main/.../common      validation, limits, error envelope, CORS
docs/
  decisions/         ADRs — 0001 explains why Spring sits next to Supabase
  glossary.md        the word truce both halves share (stop == activity, …)
  style-guide.md     how we write + comment code here
```

Standard Maven layout in backend, App Router conventions up front. New here?
Frontend: start at `src/app/actions/trips.ts`. Backend: `backend/.../trip/TripService.java`.

## Rough edges (honest list)

- Two trip stores by design (Supabase itineraries + backend trips for splits).
  ADR-0001 owns this split — don't "fix" by deleting one side.
- Backend owner scoping is header-based in dev; must move behind the Next.js
  server layer (Supabase session) before any public exposure.
- Money is single-currency per trip; mixed currencies error loudly instead of
  guessing FX. Timezones ignored (LocalDate/LocalTime) — international trips lie.
- Overnight legs sit on the start day everywhere until `leg` is modelled.

PRs: keep them small, update the glossary if you add a domain word, and write
comments for the *why* (`docs/style-guide.md`). Details per side: `CONTRIBUTING.md`.

## License

MIT — see [`LICENSE`](LICENSE).
