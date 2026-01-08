\
import { recommendNextSession, UserState, PlanTemplate, SessionLog } from "./adaptiveEngine";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("Assertion failed: " + msg);
}

const user: UserState = {
  userId: "t1",
  division: "Warrior",
  goal: "Mixed",
  baselineMax: 30,
  readiness: 0.8
};

const template: PlanTemplate = {
  templateId: "warrior_day1",
  dayLabel: "Day 1",
  intensity: "medium",
  variation: "Standard",
  sets: 4,
  targetReps: 15,
  restSeconds: 75,
  allowVariationSwap: true
};

const history: SessionLog[] = [
  {
    date: "2026-01-01",
    sessionId: "s1",
    templateId: "warrior_day1",
    variation: "Standard",
    sets: [
      { targetReps: 15, actualReps: 20, rir: 4, failed: false },
      { targetReps: 15, actualReps: 18, rir: 3, failed: false },
      { targetReps: 15, actualReps: 17, rir: 2, failed: false },
      { targetReps: 15, actualReps: 16, rir: 2, failed: false }
    ],
    painReported: false
  }
];

const next = recommendNextSession(user, template, history);
console.log(next);

assert(next.sets >= 4, "should keep or add sets");
assert(next.targetReps.reduce((a,b)=>a+b,0) >= 60, "should not reduce volume");
assert(next.debug.status !== "REGRESS", "should not regress when overperforming and no pain");

console.log("All tests passed.");
