# Adaptive Auto-Scale — Pseudocode

Inputs:
- userState (division, goal, baselineMax, readiness 0..1, injury flags)
- planTemplate (variation, base sets x reps, intensity: easy/medium/hard/boss)
- recentHistory (last N sessions, default 6)

Compute:
- completionRate = completedSets / plannedSets
- avgRIR = mean(RIR) for non-failed sets (infer if missing)
- failRate = failedSets / totalSets
- plateau = last K sessions: no rep/volume improvement while avgRIR <= 1 and no failures

Decision:
- If pain OR failRate >= 0.25 OR completionRate < 0.85 => REGRESS
- Else if avgRIR >= 3 AND completionRate >= 0.95 AND readiness >= 0.65 => PROMOTE
- Else => HOLD (with optional +1 rep micro-progression when readiness is high)

Actions:
REGRESS:
- volume * 0.8 (deload), +15s rest, easier variation if allowed
HOLD:
- keep plan, add tempo focus if plateau
PROMOTE:
- +5–10% reps (capped), optionally +1 set, harder variation if consistently +15% over target

Output:
- nextSession {variation, sets, reps per set, rest, tempo, coaching notes, estimated XP}
