# Contributing to TravelMind

Thanks for stopping by. We're small, so this is short.

## The one rule

Leave the code easier to read than you found it. If you touch a file, fix
one confusing name or one stale comment while you're there.

## How we work

1. Open an issue or just pick a `TODO(name)` you find in the code — those are real.
2. Keep PRs small. One idea per PR. A 200-line PR gets merged fast, a 2000-line one sits.
3. Add or update a test if you change behavior. No test for a typo fix, obviously.
4. Update `docs/glossary.md` if you introduce a domain word (leg? halt? stay?).

Commit messages: we use loose conventional commits — `fix:`, `feat:`, `docs:`, `chore:` —
but write like a human. `fix: stop double-saving when save is double-clicked` beats
`fix bug`. The body should say *why* if it's not obvious.

## Code style in 30 seconds

Full version lives in `docs/style-guide.md`. Short version:

- Names say what they are: `Trip`, `addStop()`, `balances`. No `dataList`, no `ManagerManager`.
- Functions do one thing. If you need "and" to describe it, split it.
- Comment the *why*. `// OSM needs no key; CARTO started key-gating` — good.
  `// loop through stops` — please don't.
- No magic numbers. `MAX_STOPS_PER_DAY = 12` with a one-line reason beats a bare `12`.
- No commented-out code. Delete it, git remembers.
- Photos go through `SafeImage` (fallback included). Never raw `next/image` for remote photos.

Run before pushing:

```bash
./node_modules/.bin/tsc --noEmit   # frontend types
npm run build                       # frontend production build
(cd backend && mvn -q verify)        # backend tests + coverage gate
```

That's it. CI runs the same trio (see `.github/workflows/`).
If the build is red on main, fixing that outranks everything else.
