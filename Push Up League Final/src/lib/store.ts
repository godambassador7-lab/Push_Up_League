import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Division, Goal } from './adaptiveEngine';

export interface SetData {
  targetReps: number;
  actualReps: number;
  rir?: number;
  failed?: boolean;
}

export interface Workout {
  id: string;
  date: string;
  pushups: number;
  sets?: number;
  xpEarned: number;
  coinsEarned?: number;
  goalCompleted?: boolean;
  streakMultiplier: number;
  challengeBonus: boolean;

  // Adaptive training fields
  sessionId?: string;
  templateId?: string;
  variation?: string;
  setData?: SetData[];
  restSeconds?: number;
  timeSeconds?: number;
  painReported?: boolean;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  type: 'streak' | 'volume' | 'rank' | 'consistency';
}

export interface RankData {
  rank: number;
  title: string;
  xpRequired: number;
  cumulativeXp: number;
}

const POINT_EARNING_SCALE = 0.25;

export const RANK_LADDER: RankData[] = [
  { rank: 1, title: 'Initiate', xpRequired: 500, cumulativeXp: 500 },
  { rank: 2, title: 'Iron Hand', xpRequired: 1500, cumulativeXp: 2000 },
  { rank: 3, title: 'Vanguard', xpRequired: 3000, cumulativeXp: 5000 },
  { rank: 4, title: 'Centurion', xpRequired: 5000, cumulativeXp: 10000 },
  { rank: 5, title: 'Titan', xpRequired: 8000, cumulativeXp: 18000 },
  { rank: 6, title: 'Ascendant', xpRequired: 12000, cumulativeXp: 30000 },
  { rank: 7, title: 'Mythic', xpRequired: 18000, cumulativeXp: 48000 },
  { rank: 8, title: 'Immortal', xpRequired: 25000, cumulativeXp: 73000 },
];

export const getStreakMultiplier = (days: number): number => {
  if (days <= 3) return 1.0;
  if (days <= 7) return 1.1;
  if (days <= 14) return 1.25;
  if (days <= 30) return 1.5;
  if (days <= 60) return 1.75;
  return 2.0;
};

export const calculateXP = (
  pushups: number,
  streakDays: number,
  sets?: number,
  dailyChallengeCompleted?: boolean
): number => {
  let xp = pushups * POINT_EARNING_SCALE; // Base scaled down earnings

  // Streak multiplier
  const streakMult = getStreakMultiplier(streakDays);
  xp *= streakMult;

  // Set bonus
  if (sets) {
    xp *= 1 + sets * 0.05; // +5% per set
  }

  // Daily challenge bonus
  if (dailyChallengeCompleted) {
    xp *= 1.25; // +25%
  }

  // Daily cap: 500 XP
  return Math.min(Math.floor(xp), 500);
};

export interface UserState {
  userId: string;
  username: string;
  totalXp: number;
  coins: number;
  currentRank: number;
  currentRankXp: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  workouts: Workout[];
  achievements: Achievement[];
  streakFreezes: number;

  // Adaptive training settings
  division: Division;
  goal: Goal;
  baselineMax: number;
  readiness: number;

  // Training plan
  activePlanId: string | null;
  planStartDate: string | null;

  // Calorie tracking
  bodyWeightKg: number; // User's body weight in kilograms

  // Actions
  setUsername: (name: string) => void;
  setDivision: (division: Division) => void;
  setGoal: (goal: Goal) => void;
  setBaselineMax: (max: number) => void;
  setReadiness: (readiness: number) => void;
  setActivePlan: (planId: string | null, startDate?: string) => void;
  setBodyWeight: (weightKg: number) => void;
  logWorkout: (pushups: number, sets?: number, challengeBonus?: boolean) => void;
  addCoins: (amount: number) => void;
  useStreakFreeze: () => void;
  getNextRankProgress: () => { current: number; required: number; percent: number };
  calculateCurrentRank: () => void;
  getTodayWorkout: () => Workout | undefined;
  getStreakStatus: () => { days: number; broken: boolean };
  addAchievement: (title: string, description: string, type: Achievement['type']) => void;
}

const getInitialState = () => ({
  userId: uuidv4(),
  username: 'Champion',
  totalXp: 0,
  coins: 0,
  currentRank: 1,
  currentRankXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  workouts: [],
  achievements: [],
  streakFreezes: 1,

  // Adaptive training defaults
  division: 'Rookie' as Division,
  goal: 'Mixed' as Goal,
  baselineMax: 20,
  readiness: 0.7,

  // Training plan defaults
  activePlanId: null,
  planStartDate: null,

  // Calorie tracking defaults
  bodyWeightKg: 77, // Default: 77kg (~170lbs)
});

export const useUserStore = create<UserState>((set, get) => ({
  ...getInitialState(),

  setUsername: (name: string) => set({ username: name }),
  setDivision: (division: Division) => set({ division }),
  setGoal: (goal: Goal) => set({ goal }),
  setBaselineMax: (max: number) => set({ baselineMax: max }),
  setReadiness: (readiness: number) => set({ readiness: Math.max(0, Math.min(1, readiness)) }),
  setActivePlan: (planId: string | null, startDate?: string) => {
    const date = startDate || new Date().toISOString().split('T')[0];
    set({ activePlanId: planId, planStartDate: planId ? date : null });
  },

  setBodyWeight: (weightKg: number) => set({ bodyWeightKg: Math.max(40, Math.min(200, weightKg)) }),

  logWorkout: (pushups: number, sets?: number, challengeBonus?: boolean) => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = state.lastWorkoutDate;

    // Calculate streak
    let newStreak = state.currentStreak;
    let streakBroken = false;

    if (lastDate) {
      const last = new Date(lastDate);
      const now = new Date(today);
      const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, don't increment
        newStreak = state.currentStreak;
      } else if (daysDiff === 1) {
        // Next day, increment
        newStreak = state.currentStreak + 1;
      } else {
        // Streak broken
        streakBroken = true;
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, state.longestStreak);

    // Calculate XP
    const xpEarned = calculateXP(pushups, newStreak, sets, challengeBonus);
    const newTotalXp = state.totalXp + xpEarned;

    // Calculate rank
    let newRank = 1;
    for (const rankData of RANK_LADDER) {
      if (newTotalXp >= rankData.cumulativeXp) {
        newRank = rankData.rank;
      }
    }

    const rankData = RANK_LADDER[newRank - 1];
    const currentRankXp = newTotalXp - (newRank > 1 ? RANK_LADDER[newRank - 2].cumulativeXp : 0);

    // Add coins
    const coinsEarned = Math.max(1, Math.floor((10 + (sets ? sets * 2 : 0)) * POINT_EARNING_SCALE)); // 10 base + 2 per set then scaled
    const newCoins = state.coins + coinsEarned;

    const newWorkout: Workout = {
      id: uuidv4(),
      date: today,
      pushups,
      sets,
      xpEarned,
      streakMultiplier: getStreakMultiplier(newStreak),
      challengeBonus: challengeBonus || false,
    };

    // Check for achievements
    const achievements = [...state.achievements];
    if (newStreak === 7 && !achievements.some(a => a.title === 'The Week')) {
      achievements.push({
        id: uuidv4(),
        title: 'The Week',
        description: '7-day streak achieved',
        unlockedAt: new Date().toISOString(),
        type: 'streak',
      });
    }
    if (newStreak === 30 && !achievements.some(a => a.title === 'The Month')) {
      achievements.push({
        id: uuidv4(),
        title: 'The Month',
        description: '30-day streak achieved',
        unlockedAt: new Date().toISOString(),
        type: 'streak',
      });
    }

    set({
      totalXp: newTotalXp,
      coins: newCoins,
      currentRank: newRank,
      currentRankXp,
      currentStreak: newStreak,
      longestStreak,
      lastWorkoutDate: today,
      workouts: [...state.workouts, newWorkout],
      achievements,
    });
  },

  addCoins: (amount: number) => set((state) => ({ coins: state.coins + amount })),

  useStreakFreeze: () => {
    const state = get();
    if (state.streakFreezes > 0) {
      set({ streakFreezes: state.streakFreezes - 1 });
    }
  },

  getNextRankProgress: () => {
    const state = get();
    const currentRankData = RANK_LADDER[state.currentRank - 1];
    const nextRankData = RANK_LADDER[state.currentRank];

    if (!nextRankData) {
      return { current: currentRankData.xpRequired, required: currentRankData.xpRequired, percent: 100 };
    }

    const prevRankXp = state.currentRank > 1 ? RANK_LADDER[state.currentRank - 2].cumulativeXp : 0;
    const currentRelativeXp = state.totalXp - prevRankXp;
    const requiredForNext = nextRankData.xpRequired;
    const percent = Math.min(100, Math.floor((currentRelativeXp / requiredForNext) * 100));

    return { current: currentRelativeXp, required: requiredForNext, percent };
  },

  calculateCurrentRank: () => {
    const state = get();
    let newRank = 1;
    for (const rankData of RANK_LADDER) {
      if (state.totalXp >= rankData.cumulativeXp) {
        newRank = rankData.rank;
      }
    }
    set({ currentRank: newRank });
  },

  getTodayWorkout: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    return state.workouts.find(w => w.date === today);
  },

  getStreakStatus: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    const todayWorkout = state.workouts.find(w => w.date === today);

    return {
      days: state.currentStreak,
      broken: !todayWorkout && state.lastWorkoutDate !== today,
    };
  },

  addAchievement: (title: string, description: string, type: Achievement['type']) => {
    set((state) => ({
      achievements: [
        ...state.achievements,
        {
          id: uuidv4(),
          title,
          description,
          unlockedAt: new Date().toISOString(),
          type,
        },
      ],
    }));
  },
}));
