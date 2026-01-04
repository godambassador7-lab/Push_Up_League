export type SessionChallengeType =
  | 'time_limit'      // Complete workout in X minutes
  | 'max_rest'        // No rest longer than X seconds
  | 'ladder'          // Specific set pattern (5-10-15-20)
  | 'pyramid'         // Up and down pattern (5-10-15-10-5)
  | 'emom'            // Every Minute On the Minute
  | 'tabata'          // 20 sec work, 10 sec rest
  | 'endurance';      // Complete X reps without stopping

export interface SessionChallenge {
  id: string;
  name: string;
  description: string;
  type: SessionChallengeType;
  requirement: any;
  coinReward: number;
  xpReward: number;
  icon: string;
  validateCompletion: (data: SessionWorkoutData) => boolean;
}

export interface SessionWorkoutData {
  totalPushups: number;
  sets: Array<{
    reps: number;
    type: string;
    restAfter?: number; // seconds
    timestamp?: number; // when the set was completed
  }>;
  sessionDuration: number; // total minutes
  startTime: number; // timestamp
  endTime: number; // timestamp
}

export const SESSION_CHALLENGES: SessionChallenge[] = [
  // TIME LIMIT CHALLENGES
  {
    id: 'time_10min',
    name: 'Speed Demon',
    description: 'Complete your workout in under 10 minutes',
    type: 'time_limit',
    requirement: { maxMinutes: 10 },
    coinReward: 15,
    xpReward: 50,
    icon: '⚡',
    validateCompletion: (data) => {
      return data.sessionDuration <= 10;
    },
  },
  {
    id: 'time_5min',
    name: 'Lightning Fast',
    description: 'Complete your workout in under 5 minutes',
    type: 'time_limit',
    requirement: { maxMinutes: 5 },
    coinReward: 25,
    xpReward: 100,
    icon: '⚡⚡',
    validateCompletion: (data) => {
      return data.sessionDuration <= 5;
    },
  },

  // REST PERIOD CHALLENGES
  {
    id: 'rest_90sec',
    name: 'Quick Recovery',
    description: 'No rest period longer than 90 seconds',
    type: 'max_rest',
    requirement: { maxRestSeconds: 90 },
    coinReward: 10,
    xpReward: 40,
    icon: '⏱️',
    validateCompletion: (data) => {
      if (data.sets.length <= 1) return true;
      for (const set of data.sets) {
        if (set.restAfter && set.restAfter > 90) return false;
      }
      return true;
    },
  },
  {
    id: 'rest_60sec',
    name: 'Minimal Rest',
    description: 'No rest period longer than 60 seconds',
    type: 'max_rest',
    requirement: { maxRestSeconds: 60 },
    coinReward: 15,
    xpReward: 60,
    icon: '⏱️⏱️',
    validateCompletion: (data) => {
      if (data.sets.length <= 1) return true;
      for (const set of data.sets) {
        if (set.restAfter && set.restAfter > 60) return false;
      }
      return true;
    },
  },
  {
    id: 'no_rest',
    name: 'Iron Will',
    description: 'No rest between sets',
    type: 'max_rest',
    requirement: { maxRestSeconds: 5 },
    coinReward: 30,
    xpReward: 120,
    icon: '🔥',
    validateCompletion: (data) => {
      if (data.sets.length <= 1) return true;
      for (const set of data.sets) {
        if (set.restAfter && set.restAfter > 5) return false;
      }
      return true;
    },
  },

  // PATTERN CHALLENGES
  {
    id: 'ladder_basic',
    name: 'Ladder Climber',
    description: 'Complete sets in ascending order: 5-10-15-20',
    type: 'ladder',
    requirement: { pattern: [5, 10, 15, 20] },
    coinReward: 20,
    xpReward: 80,
    icon: '📶',
    validateCompletion: (data) => {
      const pattern = [5, 10, 15, 20];
      if (data.sets.length < pattern.length) return false;

      for (let i = 0; i < pattern.length; i++) {
        if (data.sets[i].reps < pattern[i]) return false;
      }
      return true;
    },
  },
  {
    id: 'pyramid',
    name: 'Pyramid Builder',
    description: 'Complete pyramid: 5-10-15-20-15-10-5',
    type: 'pyramid',
    requirement: { pattern: [5, 10, 15, 20, 15, 10, 5] },
    coinReward: 35,
    xpReward: 150,
    icon: '🔺',
    validateCompletion: (data) => {
      const pattern = [5, 10, 15, 20, 15, 10, 5];
      if (data.sets.length < pattern.length) return false;

      for (let i = 0; i < pattern.length; i++) {
        if (data.sets[i].reps < pattern[i]) return false;
      }
      return true;
    },
  },

  // ENDURANCE CHALLENGES
  {
    id: 'endurance_50',
    name: 'Half Century',
    description: 'Complete 50 push-ups in a single set',
    type: 'endurance',
    requirement: { minReps: 50 },
    coinReward: 25,
    xpReward: 100,
    icon: '💪',
    validateCompletion: (data) => {
      return data.sets.some(set => set.reps >= 50);
    },
  },
  {
    id: 'endurance_100',
    name: 'Century Club',
    description: 'Complete 100 push-ups in a single set',
    type: 'endurance',
    requirement: { minReps: 100 },
    coinReward: 50,
    xpReward: 200,
    icon: '💯',
    validateCompletion: (data) => {
      return data.sets.some(set => set.reps >= 100);
    },
  },

  // EMOM (Every Minute On the Minute)
  {
    id: 'emom_10min',
    name: 'EMOM Master',
    description: 'Complete 10 sets, one every minute for 10 minutes',
    type: 'emom',
    requirement: { minutes: 10, sets: 10 },
    coinReward: 30,
    xpReward: 120,
    icon: '⏰',
    validateCompletion: (data) => {
      if (data.sets.length < 10) return false;
      if (data.sessionDuration > 11) return false; // Allow 1 min buffer

      // Check if sets are roughly 1 minute apart
      for (let i = 1; i < 10; i++) {
        if (!data.sets[i].timestamp || !data.sets[i-1].timestamp) return false;

        const timeDiff = (data.sets[i].timestamp! - data.sets[i-1].timestamp!) / 1000;
        // Allow 45-75 seconds between sets
        if (timeDiff < 45 || timeDiff > 75) return false;
      }
      return true;
    },
  },

  // TABATA
  {
    id: 'tabata_8rounds',
    name: 'Tabata Warrior',
    description: '8 rounds of 20 seconds work, 10 seconds rest',
    type: 'tabata',
    requirement: { rounds: 8 },
    coinReward: 25,
    xpReward: 100,
    icon: '🎯',
    validateCompletion: (data) => {
      if (data.sets.length < 8) return false;

      // Check total duration is around 4 minutes (8 rounds × 30 sec)
      if (data.sessionDuration < 3.5 || data.sessionDuration > 5) return false;

      // Check rest periods are around 10 seconds
      for (let i = 0; i < 7; i++) {
        if (!data.sets[i].restAfter) return false;
        if (data.sets[i].restAfter! < 8 || data.sets[i].restAfter! > 15) return false;
      }
      return true;
    },
  },
];

export const getAvailableSessionChallenges = (
  totalPushups: number,
  completedChallengeIds: string[]
): SessionChallenge[] => {
  // Filter challenges based on workout size and not already completed today
  return SESSION_CHALLENGES.filter(challenge => {
    // Don't show if already completed today
    if (completedChallengeIds.includes(challenge.id)) return false;

    // Filter based on workout requirements
    switch (challenge.type) {
      case 'endurance':
        // Only show if they have enough total pushups
        return totalPushups >= challenge.requirement.minReps;

      case 'ladder':
      case 'pyramid':
        // Only show if they have enough sets planned
        const requiredSets = challenge.requirement.pattern.length;
        return totalPushups >= challenge.requirement.pattern.reduce((a: number, b: number) => a + b, 0);

      default:
        return true;
    }
  });
};

export const checkSessionChallengeCompletion = (
  challengeId: string,
  workoutData: SessionWorkoutData
): { completed: boolean; challenge?: SessionChallenge } => {
  const challenge = SESSION_CHALLENGES.find(c => c.id === challengeId);

  if (!challenge) {
    return { completed: false };
  }

  const completed = challenge.validateCompletion(workoutData);

  return { completed, challenge: completed ? challenge : undefined };
};
