# Glossary — what we actually mean

Two halves, one product. The frontend (Next.js) and backend (Spring Boot) grew
up separately, so this file is the truce. If code disagrees with it, the code
is wrong (or update this file in the same PR).

## Shared words

- **Trip** — the whole journey. Frontend: `from`/`to`/`title`/`duration`/`days`
  (`src/data/mock-itinerary.ts`). Backend: `name` + `startsOn`/`endsOn`
  (`backend/.../trip/Trip.java`). Same idea, different shapes — this file keeps
  them aligned.
- **Stop** (backend) == **Activity** (frontend) — one visit: place + start +
  duration on a date. We say "stop" in new code; "activity" stays in the
  Supabase tables + frontend types for now.
- **Day** — a date inside a trip with its stops sorted. Frontend `ItineraryDay`,
  backend `DayResponse`. Derived, not stored, on both sides.
- **Leg** — travel *between* stops. Not modelled anywhere yet. Don't use it in
  new code until it is.
- **Expense** — who paid how much for what. Backend stores minor units
  (paise/cents) as long + currency (`Money`) — never float. Frontend prices are
  display-only `priceINR` numbers.
- **Balance** — per-person net: positive "is owed", negative "owes".
  Backend says `balances` / `settleUp`, not `getPositiveDelta()`.

## Out-of-bounds words

Don't introduce without discussion: `Tour`, `Voyage`, `Item`, `Data`, `Info`,
`Manager`, `Handler`, `leg` (until modelled), `booking` (implies flights/hotels
we don't do). Backend also avoids `Util` grab-bags — three related helpers max
before it wants a real name.
