\
/**
 * Push-Up League — Adaptive Auto-Scale Engine
 * TypeScript (works in JS with minor edits: remove types)
 */

export type Division = "Rookie" | "Warrior" | "Elite";
export type Goal = "Endurance" | "Strength" | "Hypertrophy" | "Mixed";
export type Intensity = "easy" | "medium" | "hard" | "boss";

export type InjuryFlags = {
  wristPain?: boolean;
  shoulderPain?: boolean;
  elbowPain?: boolean;
  otherPain?: boolean;
};

export type UserState = {
  userId: string;
  level?: number;
  division: Division;
  goal: Goal;
  baselineMax: number;
  readiness?: number; // 0..1
  injuryFlags?: InjuryFlags;
};

export type SetLog = {
  targetReps: number;
  actualReps: number;
  rir?: number;     // optional
  failed?: boolean;
};

export type SessionLog = {
  date: string;
  sessionId: string;
  templateId?: string;
  variation: string;
  sets: SetLog[];
  restSeconds?: number;
  timeSeconds?: number;
  painReported?: boolean;
  notes?: string;
};

export type PlanTemplate = {
  templateId: string;
  dayLabel: string;
  intensity: Intensity;
  variation: string;
  sets: number;
  targetReps: number;
  restSeconds: number;
  tempo?: string;
  allowVariationSwap?: boolean;
};

export type NextSession = {
  templateId: string;
  variation: string;
  sets: number;
  targetReps: number[];
  restSeconds: number;
  tempo?: string;
  coachingNotes: string[];
  xp: {
    baseXPPerRep: number;
    estimatedXP: number;
    multipliers: Record<string, number>;
  };
  debug: {
    status: "PROMOTE" | "HOLD" | "REGRESS";
    plateau: boolean;
    avgRIR: number | null;
    completionRate: number;
    failRate: number;
    readiness: number;
  };
};

// ------------------------ TUNABLE ------------------------
const TUNABLE = {
  weekly_volume_step: 0.07,
  max_weekly_increase: 0.15,
  deload_factor: 0.80,
  promote_avgRIR: 3,
  regress_failRate: 0.25,
  regress_completionRate: 0.85,
  plateau_sessions: 3,
  readiness_default: 0.7,
  base_xp_per_rep: 1
};

export const VARIATION_MULT: Record<string, number> = {
  Knee: 0.75,
  Incline: 0.85,
  Standard: 1.0,
  Wide: 1.05,
  HandRelease: 1.08,
  Tempo: 1.10,
  Diamond: 1.15,
  Decline: 1.20,
  Spiderman: 1.25,
  Explosive: 1.28,
  Pike: 1.30,
  Archer: 1.35,
  Hindu: 1.35,
  PseudoPlanche: 1.50
};

export const DIVISION_MULT: Record<Division, number> = {
  Rookie: 1.0,
  Warrior: 1.25,
  Elite: 1.5
};

export const INTENSITY_MULT: Record<Intensity, number> = {
  easy: 0.9,
  medium: 1.0,
  hard: 1.1,
  boss: 1.25
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mean(nums: number[]) {
  return nums.length ? nums.reduce((a,b)=>a+b,0) / nums.length : 0;
}

function inferRIR(set: SetLog): number | null {
  if (typeof set.rir === "number") return clamp(set.rir, 0, 10);
  const diff = set.actualReps - set.targetReps;
  if (diff >= 6) return 4;
  if (diff >= 4) return 3;
  if (diff >= 2) return 2;
  if (diff >= 0) return 1;
  return 0;
}

function normalizeVariationName(v: string): string {
  const map: Record<string,string> = {
    "Hand-Release": "HandRelease",
    "Hand Release": "HandRelease",
    "Pseudo-Planche": "PseudoPlanche",
    "Pseudo Planche": "PseudoPlanche"
  };
  return map[v] || v;
}

function isPain(user: UserState, last?: SessionLog): boolean {
  const f = user.injuryFlags || {};
  const anyFlag = !!(f.wristPain || f.shoulderPain || f.elbowPain || f.otherPain);
  return anyFlag || !!last?.painReported;
}

function easierVariation(v: string): string {
  const ladder = ["Knee","Incline","Standard","Wide","HandRelease","Tempo","Diamond","Decline","Spiderman","Explosive","Archer","PseudoPlanche"];
  const idx = ladder.indexOf(normalizeVariationName(v));
  if (idx <= 0) return ladder[0];
  return ladder[idx-1];
}

function harderVariation(v: string): string {
  const ladder = ["Knee","Incline","Standard","Wide","HandRelease","Tempo","Diamond","Decline","Spiderman","Explosive","Archer","PseudoPlanche"];
  const idx = ladder.indexOf(normalizeVariationName(v));
  if (idx < 0) return v;
  if (idx >= ladder.length-1) return ladder[ladder.length-1];
  return ladder[idx+1];
}

function getMultipliers(user: UserState, variation: string, intensity: Intensity) {
  const vKey = normalizeVariationName(variation);
  const v = VARIATION_MULT[vKey] ?? 1.0;
  const d = DIVISION_MULT[user.division];
  const i = INTENSITY_MULT[intensity];
  return { variation: v, division: d, intensity: i };
}

export function summarizeRecentPerformance(recent: SessionLog[], template?: PlanTemplate) {
  if (!recent.length) {
    return { avgRIR: null as number | null, completionRate: 1, failRate: 0, totalTarget: 0, totalActual: 0 };
  }
  const allSets: SetLog[] = recent.flatMap(s => s.sets);
  const plannedSets = template?.sets ?? allSets.length;

  const failedSets = allSets.filter(x => x.failed || x.actualReps < x.targetReps).length;
  const completedSets = allSets.length - failedSets;

  const rirs = allSets.map(inferRIR).filter((x): x is number => x !== null);
  const avgRIR = rirs.length ? mean(rirs) : null;

  const totalTarget = allSets.reduce((a,s)=>a + (s.targetReps || 0), 0);
  const totalActual = allSets.reduce((a,s)=>a + (s.actualReps || 0), 0);

  const completionRate = plannedSets > 0 ? clamp(completedSets / plannedSets, 0, 1) : 1;
  const failRate = allSets.length > 0 ? clamp(failedSets / allSets.length, 0, 1) : 0;

  return { avgRIR, completionRate, failRate, totalTarget, totalActual };
}

export function detectPlateau(recent: SessionLog[], k = TUNABLE.plateau_sessions): boolean {
  if (recent.length < k) return false;
  const slice = recent.slice(-k);
  const totals = slice.map(s => s.sets.reduce((a,x)=>a+x.actualReps,0));
  const last = totals[totals.length-1];
  const prevMax = Math.max(...totals.slice(0, -1));
  const noImprovement = last <= prevMax;

  const rirs = slice.flatMap(s => s.sets.map(inferRIR)).filter((x): x is number => x !== null);
  const avgRIR = rirs.length ? mean(rirs) : 1;

  const noFailures = slice.every(s => s.sets.every(x => !x.failed));
  return noImprovement && avgRIR <= 1.1 && noFailures;
}

export function recommendNextSession(
  user: UserState,
  template: PlanTemplate,
  recentHistory: SessionLog[]
): NextSession {

  const readiness = clamp(user.readiness ?? TUNABLE.readiness_default, 0, 1);
  const last = recentHistory[recentHistory.length-1];
  const pain = isPain(user, last);

  const comparable = recentHistory
    .filter(s => (template.templateId ? s.templateId === template.templateId : true))
    .slice(-6);

  const summary = summarizeRecentPerformance(comparable, template);
  const plateau = detectPlateau(recentHistory);

  let status: "PROMOTE" | "HOLD" | "REGRESS" = "HOLD";

  if (pain) status = "REGRESS";
  else if (summary.failRate >= TUNABLE.regress_failRate) status = "REGRESS";
  else if (summary.completionRate < TUNABLE.regress_completionRate) status = "REGRESS";
  else if ((summary.avgRIR ?? 1) >= TUNABLE.promote_avgRIR && summary.completionRate >= 0.95 && readiness >= 0.65) status = "PROMOTE";
  else status = "HOLD";

  let nextVariation = normalizeVariationName(template.variation);
  let nextSets = template.sets;
  let repTargets = Array.from({ length: template.sets }, () => template.targetReps);
  let nextRest = template.restSeconds;
  let nextTempo = template.tempo;

  const notes: string[] = [];

  if (plateau && status !== "REGRESS") {
    notes.push("Plateau detected: adding tempo focus and slightly more rest (stimulus change).");
    if (!nextTempo) nextTempo = "3-0-1";
    nextRest = clamp(nextRest + 10, 30, 180);
    status = "HOLD";
  }

  if (status === "REGRESS") {
    notes.push("Regression triggered: deloading volume + simplifying variation.");
    repTargets = repTargets.map(r => Math.max(1, Math.floor(r * TUNABLE.deload_factor)));
    if (nextSets >= 5) {
      nextSets -= 1;
      repTargets = repTargets.slice(0, nextSets);
    }
    if (template.allowVariationSwap !== false) {
      nextVariation = easierVariation(nextVariation);
      notes.push(`Easier variation: ${nextVariation}`);
    }
    nextRest = clamp(nextRest + 15, 45, 210);
    if (!nextTempo) nextTempo = "2-0-1";
  }

  if (status === "HOLD") {
    notes.push("Hold: keep progression steady. Prioritize strict form.");
    if (readiness >= 0.8 && (summary.avgRIR ?? 1) >= 2 && template.intensity !== "boss") {
      repTargets = repTargets.map(r => r + 1);
      notes.push("Micro-progression: +1 rep per set (high readiness).");
    }
  }

  if (status === "PROMOTE") {
    notes.push("Promote: increasing workload within caps.");
    const step = clamp(TUNABLE.weekly_volume_step * (0.8 + 0.4 * readiness), 0, TUNABLE.max_weekly_increase);
    const addReps = Math.max(1, Math.floor(template.targetReps * step));
    repTargets = repTargets.map(r => r + addReps);

    if (nextSets < 6 && readiness >= 0.75 && template.intensity !== "boss") {
      nextSets += 1;
      repTargets.push(repTargets[repTargets.length - 1]);
      notes.push("Added 1 set (volume progression).");
    }

    if (template.allowVariationSwap !== false && summary.totalTarget > 0) {
      const overBy = summary.totalActual / Math.max(1, summary.totalTarget);
      if (overBy >= 1.15) {
        nextVariation = harderVariation(nextVariation);
        notes.push(`Harder variation: ${nextVariation}`);
      }
    }

    if (template.intensity !== "boss" && !nextTempo) {
      nextRest = clamp(nextRest - 5, 30, 180);
    }
  }

  // Goal-based finishing touches
  if (user.goal === "Strength") {
    repTargets = repTargets.map(r => clamp(Math.round(r * 0.85), 3, 20));
    nextRest = clamp(nextRest + 15, 45, 240);
    notes.push("Strength focus: fewer reps, more rest.");
  } else if (user.goal === "Endurance") {
    repTargets = repTargets.map(r => clamp(Math.round(r * 1.05), 5, 40));
    nextRest = clamp(nextRest - 5, 20, 180);
    notes.push("Endurance focus: slightly higher reps, slightly lower rest.");
  } else if (user.goal === "Hypertrophy") {
    repTargets = repTargets.map(r => clamp(r, 6, 25));
    nextRest = clamp(nextRest, 45, 120);
    notes.push("Hypertrophy focus: moderate reps & rest window.");
  }

  // Safety cap based on baseline max (keeps per-set targets realistic)
  const cap = Math.max(8, Math.floor(user.baselineMax * 0.85));
  repTargets = repTargets.map(r => clamp(r, 1, cap));

  const mult = getMultipliers(user, nextVariation, template.intensity);
  const multipliers = { division: mult.division, variation: mult.variation, intensity: mult.intensity, streak: 1.0 };
  const totalPlanned = repTargets.reduce((a,b)=>a+b,0);
  const estimatedXP = Math.round(totalPlanned * TUNABLE.base_xp_per_rep * multipliers.division * multipliers.variation * multipliers.intensity * multipliers.streak);

  return {
    templateId: template.templateId,
    variation: nextVariation,
    sets: nextSets,
    targetReps: repTargets,
    restSeconds: nextRest,
    tempo: nextTempo,
    coachingNotes: notes,
    xp: { baseXPPerRep: TUNABLE.base_xp_per_rep, estimatedXP, multipliers },
    debug: {
      status,
      plateau,
      avgRIR: summary.avgRIR,
      completionRate: summary.completionRate,
      failRate: summary.failRate,
      readiness
    }
  };
}
