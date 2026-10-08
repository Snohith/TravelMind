# How we write code here

This is our house style. It borrows from Martin's *Clean Code* (names, tiny
functions), Stack Overflow's commenting rules, and a couple of bruises from
reviewing AI-assisted PRs. Short version: write for the next tired human.

Sources we actually read (not just cited):
- Martin, *Clean Code* — Ch. 2 Names, Ch. 3 Functions, Ch. 4 Comments
- Stack Overflow Blog, "Best practices for writing code comments" (2021) — rules 1–9
- DataCamp "Coding Best Practices" (2026), daily.dev "10 Code Commenting Best Practices"
- Broad Institute CommKit "Coding and Comment Style"
- Eat.Sleep.Prompt, "How to spot code written by AI" (2025) — what *not* to look like
- CodeRabbit, "State of AI vs Human Code Generation" (2025, 470 PRs) — where AI PRs slip
- Tian et al., arXiv:2508.21634 (ISSRE 2025) — defects/vulns in AI vs human code
- Conventional Commits 1.0.0; CASRAI/Harvard file-naming notes

## 1. Structure: boring on purpose

Next.js App Router up front, Spring feature packages in back. Lowercase folders,
no spaces, `_` or `-` only. A README at the root explains the tree (CASRAI rule:
document the scheme where it lives, or nobody follows it).

```
src/app/...          routes + server actions (trips.ts owns saved-trip I/O)
src/components/...   UI (Timeline, maps, SafeImage for every photo)
src/lib/...          supabase clients, demo identity, env guards
src/data/...         itinerary builder + city knowledge
backend/src/main/.../trip|itinerary|expense  entity + repo + service + controller
backend/src/main/.../common                   validation, limits, error envelope
docs/decisions/      ADRs, newest last
```

One domain per package (`trip`, `itinerary`, `expense`). If two packages import
each other both ways, the boundary is wrong — merge or move something.

## 2. Names: say what it is

- Classes are nouns: `Trip`, `ExpenseService`, `ItineraryService`.
- Methods are verbs: `addStop()`, `balancesFor()`, `settleUp()`. If you need "and"
  to describe a method (`parseAndSaveAndNotify`), split it.
- Scope decides length: `i` is fine inside a 3-line loop, `dayIndex` is not.
  Public API gets full words: `findByName()`, not `find()`.
- No encodings in names (`nameString`, `amountFloat`) and no lies
  (`accountList` when it's not a List). If the type changes, the name shouldn't have to.
- Positive names beat negative ones: `isEnabled`, not `isNotDisabled`.
- Domain words over generic ones: `stop`, `trip`, `balance` — not `item`, `data`, `info`.
  When in doubt, check `docs/glossary.md`.

Bad → good (real ones we fixed):

```java
// bad: what is "data"? what does "process" do?
Map<String, Long> process_data_2(List<Expense> dataList)

// good: says what goes in and what comes out
Map<String, Money> balancesFor(List<Expense> expenses)
```

## 3. Functions: small, one job, early exits

- One level of abstraction per function. `TripService.create()` validates, then
  delegates — it doesn't also format dates and write JSON.
- Guard clauses first, happy path last. Avoids the triangle of doom.
- ~15 lines is a smell, not a law. Split when you start narrating with "and then".

## 4. Comments: explain why, not what

This is where AI-looking code gives itself away (uniform docstring on every
getter, `# loop through stops`). We do the opposite:

- **Do comment:** business reason, workaround + link, non-obvious threshold,
  bug that bit us, deliberate shortcut.
- **Don't comment:** what the code already says, commented-out code (delete it),
  `@author` headers on every file (git knows), empty javadoc.

Good:

```java
// Overnight buses cross midnight; we split at 00:00 for now so day totals stay sane.
// Revisit when we model Leg properly — see glossary + issue #18.
```

```java
// Receipts round to the nearest rupee, Expedia rounds down. We match receipts.
long rounded = Math.round(raw);
```

```java
// TODO(snohith, Oct): "12,500" (Indian grouping) fails here. Accept commas next.
```

Bad:

```java
// increment total by expense amount
total += expense.amount();

// Adds two numbers and returns the result. (please no)
```

Javadoc only on public domain types where the *contract* isn't obvious
(`Money`, `ItineraryPlanner`). Getters/setters never get javadoc.

Rule of thumb from review: if you can delete the comment and nothing is lost,
delete it. If you can't write a clear comment, the code is probably confusing —
rename or split first (SO rule 3).

## 5. Constants, not magic numbers

Every bare number needs a name + a one-line why. `MAX_STOPS_PER_DAY = 12`
exists because the day view breaks past that, not because 12 is pretty.

```java
// Day view starts scrolling badly past ~12 stops on a phone (checked on Pixel 6a).
static final int MAX_STOPS_PER_DAY = 12;
```

Same for timeouts, limits, regexes. Link the source if you copied it
(SO rule 6) — future you will want the context.

## 6. What we deliberately *don't* do

- No defensive over-engineering: no try/catch around code that can't throw,
  no custom exception hierarchy for a 3-call path, no logging ceremony where
  one line suffices. Add it when it hurts (CodeRabbit found AI PRs over-wrap
  error handling ~2x).
- No unused imports / dead flags. If your IDE greys it, delete it before pushing.
- No mixed styles in one file (`user_input` next to `userInput`). Pick the file's
  existing style; the project standard is camelCase for methods/vars, PascalCase for classes.
- No `Manager`/`Util` grab-bags. If a helper grows past ~3 related methods, it wants
  a real name or a new home.

## 7. Tests read like stories

Name tests `shouldXWhenY`. Keep given/when/then visible only when the setup is
non-trivial. One behavior per test. A disabled test must say why + when to re-enable:

```java
@Disabled("flaky around midnight IST until Leg is modelled — re-enable with #18")
```

## 8. Commits tell the story

Loose conventional commits (`fix:`, `feat:`, `docs:`), but with a human body when
the why isn't obvious. Small, reviewable chunks. `wip:` is fine on a branch,
not on main. If you fixed a bug, reference it: `Fixes #23`.

## 9. Frontend (TypeScript) notes

Same spirit, JS syntax. House rules:

- No tutorial JSDoc on every server action (`@param x (Input)` / `Why it exists:`).
  Two lines on why + who owns the data beats a form letter.
- No `as any` to silence Supabase joins — type the joined shape once, locally.
  A cast with a comment beats ten silent ones.
- No empty `catch {}`. Log it (`console.error` with the day number, the message)
  or say why swallowing is correct. Same for `if (err) {}` with nothing inside.
- Dead code goes, even if "we might need it": unused `delicacies` const, `as any`
  on a number that's already a number, magic `+ 5 days` (name it).
- Build before you save: generation must return something viewable even when
  persistence fails. `generateTrip` falls back to `{ preview }` and the page
  renders it with browser persistence — never gate viewing on saving.
- Perf is measured, not felt: dev cold-compile (≈5s first hit) is not app
  speed — verify against `npm start` (we see 5–50ms). Fail fast on
  unconfigured backends (`lib/env.ts`) instead of burning network timeouts,
  preconnect image/tile hosts in `layout.tsx`, `priority` the LCP image,
  `optimizePackageImports` for the heavy libs. Re-check with numbers, not vibes.
- Zod schemas mirror backend limits (`docs/glossary.md` numbers). If backend
  caps names at 80, the form shouldn't allow 200.

## 10. Backend (Spring Boot) notes

Layered by feature: `trip/`, `itinerary/`, `expense/` each own their
entity + repository + service + controller + DTOs. Shared bits live in `common/`.

- Controllers are thin: parse, delegate, return DTOs. Never entities (proxies
  leak), never business rules.
- One `@Service` class per feature, no interface+impl split until a second
  implementation actually appears. `@Transactional` on write methods.
- Money stays exact (long minor units) on both sides of the wire; the API prints
  `INR 300.00` strings so float never sneaks back in via JSON numbers.
- Owner scoping in every query (`findByIdAndOwnerId`), same 404 for missing vs
  someone else's — don't build an id oracle. Header auth is dev-only (see ADR-0001).
