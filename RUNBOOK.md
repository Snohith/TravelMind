# Runbook — when TravelMind misbehaves

## Quick health

```bash
curl -s localhost:3000/                          # frontend shell
curl -s localhost:8080/actuator/health           # backend: {"status":"UP"}
docker compose ps
```

## Where data lives

- Saved itineraries: Supabase (`trips`, `itinerary_days`, `activities`).
  No keys locally → generation falls back to in-browser previews (`tm-previews`
  in localStorage, capped at 20). That's expected, not an incident.
- Backend demo data: H2 file under `backend/.data`. `rm -rf backend/.data` resets it.
- Map tiles: OSM standard, no key. A watermarked tile means someone pointed the
  layer back at a key-gated provider — see `RealMap.tsx`.

## Common incidents

### Itinerary page shows an error instead of a trip

Generation survived but saving didn't (or vice versa). Check the dev terminal:
`trip insert failed, returning preview` means the DB is unreachable and the user
got a preview — fine for demo. A hard error means `getTripByRoute` itself blew
up; look at the city fallback in `src/data/mock-itinerary.ts`.

### Photos broken or blank

All photos go through `SafeImage` (picsum fallback), so a broken icon means the
component was bypassed, not that a URL died. If many fallbacks show at once, an
ID batch rotted — audit with the one-liner in `docs/style-guide.md` §9 and swap
verified-200 IDs only.

### Map shows watermarked tiles

Tile provider started key-gating again. Swap `RealMap.tsx` to a keyless source
(OSM standard is the default for exactly this reason) and fix the attribution
string in the same edit — stale credit is a bug too.

### Port taken

Frontend `PORT=3001 npm run dev`. Backend: `--server.port=8081` after
`spring-boot:run`. Two `next dev` copies running is the usual culprit —
`pkill -f "next dev"` and start one.

## Logs

- Frontend: dev terminal (server-action logs) + browser console (client).
  `console.error` lines carry the day number / message — start there.
- Backend: Spring console via Logback. 5xx responses log full cause;
  4xx log nothing (user error, not an incident).
