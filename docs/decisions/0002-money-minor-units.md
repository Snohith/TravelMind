# 0002 — Money as long (minor units), never double

Date: 2026-10-08
Status: accepted

## Context

Floating point can't represent most decimals exactly (`0.1 + 0.2 != 0.3`), and
a bill-splitting app that shows ₹199.999999 is broken on arrival.

## Decision

`Money` stores minor units (paise/cents) as long + currency code ("INR",
"USD"). Parsing/formatting lives in one place. Arithmetic uses `Math.addExact`
etc. so overflow fails loud instead of wrapping silently.

See `backend/.../expense/Money.java`. It serializes as
`{"amountMinor": 120000, "currency": "INR"}`.

## Consequences

- Good: exact splits, no float drift.
- Bad: explicit rounding on divide. Multi-currency conversion is out of scope;
  mixed currencies error loudly instead of guessing FX.
