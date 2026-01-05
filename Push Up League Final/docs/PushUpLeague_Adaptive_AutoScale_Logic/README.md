# Push-Up League — AI Adaptive Auto-Scale Logic (Explainable Rules Engine)

This ZIP contains a practical adaptive training engine you can run entirely **on-device** (or server-side)
to automatically scale a user's next Push-Up League session based on performance.

It is **not** a black-box ML model. It’s a deterministic rules engine designed for:
- fast iteration
- explainable scaling
- safe progression
- easy logging + tuning

## What it does
Given recent workout history (sets, reps, RIR/RPE, failures, pain flags, completion time),
it outputs:
- next session prescription (variation, sets, reps, tempo/holds, rest)
- progression recommendation (increase reps/sets, increase difficulty, deload)
- XP multiplier suggestions
- coaching notes

## Files
- `adaptiveEngine.ts` — main engine (TypeScript; works as JS with small edits)
- `schema.json` — suggested data contracts
- `exampleData.json` — sample user + history
- `pseudocode.md` — plain-English algorithm notes
- `adaptiveEngine.test.ts` — lightweight tests (simple assertions)

## Quick Use
1. Store workout history as JSON per `schema.json`
2. Call `recommendNextSession(userState, planTemplate, recentHistory)`
3. Save the returned prescription as the next workout day

## Tuning knobs
Search for `TUNABLE` inside `adaptiveEngine.ts`.

---
Generated: 2026-01-04
