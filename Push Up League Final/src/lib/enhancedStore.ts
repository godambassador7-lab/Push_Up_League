import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ProficiencyLevel, checkIntegrity, calculateDailyGoal, WORLD_RECORDS } from './worldRecords';
import { PushUpType } from './pushupTypes';
import { ActivePowerUp, PowerUpType } from './powerUps';
import { Quest } from './quests';

export interface WorkoutSet {
  reps: number;
  type: PushUpType;
  restAfter?: number; // seconds
}

export interface Workout {
  id: string;
  date: string;
  pushups: number;
  sets?: WorkoutSet[]; // Changed from number to detailed sets
  xpEarned: number;
  coinsEarned: number;
  streakMultiplier: number;
  challengeBonus: boolean;
  isLocked: boolean;
  lockedAt?: string;
  goalCompleted: boolean;
  sessionDuration?: number; // minutes
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  type: 'streak' | 'volume' | 'rank' | 'consistency' | 'variation' | 'comeback';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
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
  let xp = pushups * POINT_EARNING_SCALE;
  const streakMult = getStreakMultiplier(streakDays);
  xp *= streakMult;

  if (sets) {
    xp *= 1 + sets * 0.05;
  }

  if (dailyChallengeCompleted) {
    xp *= 1.25;
  }

  return Math.min(Math.floor(xp), 500);
};

export interface UserState {
  // Auth & Profile
  userId: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
  proficiency: ProficiencyLevel;
  maxPushupsInOneSet: number;
  accountCreatedAt: string | null;
  isWorldRecordCandidate: boolean;
  waiverAccepted: boolean;

  // Game Progress
  totalXp: number;
  coins: number;
  currentRank: number;
  currentRankXp: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  workouts: Workout[];
  achievements: Achievement[];
  unlockedAchievements: string[]; // Array of achievement IDs
  achievementToasts: string[]; // Queue of achievement IDs to show as toasts
  streakFreezes: number;

  // Shop & Titles
  purchasedTitles: string[]; // Array of title IDs
  activeTitle: string | null; // Currently equipped title ID

  // Power-Ups & Quests
  activePowerUps: ActivePowerUp[];
  powerUpPurchaseHistory: Record<PowerUpType, string[]>;
  quests: Quest[];
  totalLifetimePushups: number;
  variationStats: Record<PushUpType, number>; // Track reps per variation

  // Goals & Records
  dailyGoal: number;
  personalBest: number;
  variationPBs: Record<PushUpType, number>;

  // Actions
  setUsername: (name: string) => void;
  setUserProfile: (email: string, proficiency: ProficiencyLevel, maxPushups: number) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, proficiency: ProficiencyLevel, maxPushups: number) => void;
  logout: () => void;
  acceptWaiver: () => void;
  logWorkout: (pushups: number, sets?: WorkoutSet[], challengeBonus?: boolean, sessionDuration?: number) => { success: boolean; message: string; warnings?: string[] };
  lockDay: (date: string) => void;
  isDayLocked: (date: string) => boolean;
  addCoins: (amount: number) => void;
  useStreakFreeze: () => void;
  purchaseTitle: (titleId: string, price: number) => { success: boolean; message: string };
  equipTitle: (titleId: string | null) => void;
  purchasePowerUp: (powerUpType: PowerUpType) => { success: boolean; message: string };
  activatePowerUp: (powerUpType: PowerUpType) => { success: boolean; message: string };
  updateQuests: () => void;
  claimQuestReward: (questId: string) => { success: boolean; message: string };
  checkAndUnlockAchievements: () => void;
  dismissAchievementToast: () => void;
  getNextRankProgress: () => { current: number; required: number; percent: number };
  calculateCurrentRank: () => void;
  getTodayWorkout: () => Workout | undefined;
  getWorkoutByDate: (date: string) => Workout | undefined;
  getStreakStatus: () => { days: number; broken: boolean };
  addAchievement: (title: string, description: string, type: Achievement['type']) => void;
  updateDailyGoal: () => void;
}

const getPowerUpPurchaseDefaults = () => ({
  streak_freeze: [],
  double_xp: [],
  challenge_reroll: [],
  goal_reducer: [],
});

const getMissedDayPenalty = (missedDays: number) => {
  if (missedDays <= 0) {
    return { xpPenalty: 0, coinPenalty: 0 };
  }
  const multiplier = Math.pow(2, missedDays) - 1;
  return {
    xpPenalty: 2 * multiplier,
    coinPenalty: 1 * multiplier,
  };
};

const getInitialState = () => ({
  userId: uuidv4(),
  username: 'Champion',
  email: '',
  isAuthenticated: false,
  proficiency: 'beginner' as ProficiencyLevel,
  maxPushupsInOneSet: 10,
  accountCreatedAt: null,
  isWorldRecordCandidate: false,
  waiverAccepted: false,
  totalXp: 0,
  coins: 100,
  currentRank: 1,
  currentRankXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  workouts: [],
  achievements: [],
  unlockedAchievements: [],
  achievementToasts: [],
  streakFreezes: 1,
  purchasedTitles: [],
  activeTitle: null,
  activePowerUps: [],
  powerUpPurchaseHistory: getPowerUpPurchaseDefaults(),
  quests: [],
  totalLifetimePushups: 0,
  variationStats: {
    standard: 0,
    wide: 0,
    diamond: 0,
    decline: 0,
    archer: 0,
    pike: 0,
    explosive: 0,
    handstand: 0,
  },
  dailyGoal: 50,
  personalBest: 0,
  variationPBs: {
    standard: 0,
    wide: 0,
    diamond: 0,
    decline: 0,
    archer: 0,
    pike: 0,
    explosive: 0,
    handstand: 0,
  },
});

export const useEnhancedStore = create<UserState>((set, get) => ({
  ...getInitialState(),

  setUsername: (name: string) => set({ username: name }),

  acceptWaiver: () => set({ waiverAccepted: true }),

  setUserProfile: (email: string, proficiency: ProficiencyLevel, maxPushups: number) => {
    const isWorldRecordCandidate = maxPushups > 200 || proficiency === 'world-class';

    set({
      email,
      proficiency,
      maxPushupsInOneSet: maxPushups,
      isWorldRecordCandidate,
    });

    // Update daily goal based on proficiency
    get().updateDailyGoal();
  },

  register: (email: string, username: string, proficiency: ProficiencyLevel, maxPushups: number) => {
    const isWorldRecordCandidate = maxPushups > 200 || proficiency === 'world-class';

    set({
      userId: uuidv4(),
      username,
      email,
      isAuthenticated: true,
      proficiency,
      maxPushupsInOneSet: maxPushups,
      accountCreatedAt: new Date().toISOString(),
      isWorldRecordCandidate,
    });

    get().updateDailyGoal();
  },

  login: async (email: string, password: string) => {
    // Placeholder for Firebase integration
    // For now, just set authenticated
    set({ isAuthenticated: true, email });
    return true;
  },

  logout: () => {
    set(getInitialState());
  },

  logWorkout: (pushups: number, workoutSets?: WorkoutSet[], challengeBonus?: boolean, sessionDuration?: number) => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];

    // Check if day is already locked
    if (state.isDayLocked(today)) {
      return {
        success: false,
        message: 'This day is locked. You cannot add more push-ups for today.',
      };
    }

    // Check if updating existing workout
    const existingWorkout = state.getWorkoutByDate(today);
    if (existingWorkout && existingWorkout.isLocked) {
      return {
        success: false,
        message: 'Today\'s workout is already locked.',
      };
    }

    // Run integrity check
    const history = state.workouts.map(w => ({ date: w.date, pushups: w.pushups }));
    const integrityCheck = checkIntegrity(state.proficiency, pushups, 'day', history);

    if (!integrityCheck.isValid) {
      return {
        success: false,
        message: 'Workout rejected: Integrity check failed. Please contact support if you believe this is an error.',
        warnings: integrityCheck.warnings,
      };
    }

    // Calculate streak + missed day penalties
    const lastDate = state.lastWorkoutDate;
    let newStreak = state.currentStreak;
    let adjustedTotalXp = state.totalXp;
    let adjustedCoins = state.coins;

    if (lastDate) {
      const last = new Date(lastDate);
      const now = new Date(today);
      const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      const missedDays = Math.max(0, daysDiff - 1);

      if (missedDays > 0) {
        const { xpPenalty, coinPenalty } = getMissedDayPenalty(missedDays);
        adjustedTotalXp = Math.max(0, adjustedTotalXp - xpPenalty);
        adjustedCoins = Math.max(0, adjustedCoins - coinPenalty);
      }

      if (daysDiff === 0) {
        newStreak = state.currentStreak;
      } else if (daysDiff === 1) {
        newStreak = state.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, state.longestStreak);

    // Calculate XP with variation multipliers
    const numSets = workoutSets?.length || 0;
    let baseXP = calculateXP(pushups, newStreak, numSets, challengeBonus);

    // Apply variation multipliers if sets provided
    if (workoutSets && workoutSets.length > 0) {
      const { getPushUpTypeData } = require('./pushupTypes');
      let weightedXP = 0;
      for (const set of workoutSets) {
        const typeData = getPushUpTypeData(set.type);
        weightedXP += set.reps * typeData.xpMultiplier;
      }
      baseXP = Math.min(
        Math.floor(weightedXP * getStreakMultiplier(newStreak) * POINT_EARNING_SCALE),
        500
      );
    }

    const xpEarned = baseXP;
    const newTotalXp = adjustedTotalXp + xpEarned;

    // Calculate rank
    let newRank = 1;
    for (const rankData of RANK_LADDER) {
      if (newTotalXp >= rankData.cumulativeXp) {
        newRank = rankData.rank;
      }
    }

    const currentRankXp = newTotalXp - (newRank > 1 ? RANK_LADDER[newRank - 2].cumulativeXp : 0);

    // NEW COIN CALCULATION with bonuses
    const { getStreakCoinMultiplier, GOAL_COMPLETION_BONUS, STREAK_PRESERVATION_BONUS } = require('./pushupTypes');

    let baseCoins = 10;

    // Add set bonus
    if (numSets > 0) {
      baseCoins += numSets * 2;
    }

    // Apply streak multiplier
    const streakMultiplier = getStreakCoinMultiplier(newStreak);
    baseCoins = Math.floor(baseCoins * streakMultiplier);

    // Apply variation multipliers if sets provided
    if (workoutSets && workoutSets.length > 0) {
      const { getPushUpTypeData } = require('./pushupTypes');
      let avgCoinMult = 0;
      for (const set of workoutSets) {
        const typeData = getPushUpTypeData(set.type);
        avgCoinMult += typeData.coinMultiplier;
      }
      avgCoinMult /= workoutSets.length;
      baseCoins = Math.floor(baseCoins * avgCoinMult);
    }

    // Check if daily goal completed
    const totalPushupsToday = (existingWorkout?.pushups || 0) + pushups;
    const goalCompleted = totalPushupsToday >= state.dailyGoal;

    // Add goal completion bonus
    if (goalCompleted && (!existingWorkout || !existingWorkout.goalCompleted)) {
      baseCoins += GOAL_COMPLETION_BONUS;
    }

    // Add streak preservation bonus (for maintaining streak)
    if (newStreak > 1) {
      baseCoins += STREAK_PRESERVATION_BONUS;
    }

    const coinsEarned = Math.max(1, Math.floor(baseCoins * POINT_EARNING_SCALE));
    const newCoins = adjustedCoins + coinsEarned;

    // Update variation stats
    const newVariationStats = { ...state.variationStats };
    const newVariationPBs = { ...state.variationPBs };

    if (workoutSets && workoutSets.length > 0) {
      for (const set of workoutSets) {
        newVariationStats[set.type] = (newVariationStats[set.type] || 0) + set.reps;
        newVariationPBs[set.type] = Math.max(newVariationPBs[set.type] || 0, set.reps);
      }
    }

    // Update or create workout
    let updatedWorkouts = [...state.workouts];
    if (existingWorkout) {
      // Update existing
      updatedWorkouts = updatedWorkouts.map(w =>
        w.date === today
          ? {
              ...w,
              pushups: w.pushups + pushups,
              sets: workoutSets ? [...(w.sets || []), ...workoutSets] : w.sets,
              xpEarned: w.xpEarned + xpEarned,
              coinsEarned: w.coinsEarned + coinsEarned,
              goalCompleted: goalCompleted || w.goalCompleted,
              sessionDuration: sessionDuration || w.sessionDuration,
            }
          : w
      );
    } else {
      // Create new
      const newWorkout: Workout = {
        id: uuidv4(),
        date: today,
        pushups,
        sets: workoutSets,
        xpEarned,
        coinsEarned,
        streakMultiplier: getStreakMultiplier(newStreak),
        challengeBonus: challengeBonus || false,
        isLocked: false,
        goalCompleted,
        sessionDuration,
      };
      updatedWorkouts.push(newWorkout);
    }

    // Update personal best
    const newPersonalBest = Math.max(state.personalBest, pushups);

    // Check achievements using comprehensive system
    const { checkAchievements } = require('./achievements');
    const achievementCheckData = {
      totalLifetimePushups: state.totalLifetimePushups + pushups,
      currentStreak: newStreak,
      longestStreak,
      workouts: updatedWorkouts,
      variationStats: newVariationStats,
      dailyGoal: state.dailyGoal,
      personalBest: newPersonalBest,
      usedStreakFreeze: state.streakFreezes < 1, // If they have less than starting amount
    };

    const unlockedIds = state.achievements.map(a => a.id);
    const newAchievements = checkAchievements(achievementCheckData, unlockedIds);

    const achievements = [
      ...state.achievements,
      ...newAchievements.map(def => ({
        id: def.id,
        title: def.title,
        description: def.description,
        unlockedAt: new Date().toISOString(),
        type: def.type,
      })),
    ];

    set({
      totalXp: newTotalXp,
      coins: newCoins,
      currentRank: newRank,
      currentRankXp,
      currentStreak: newStreak,
      longestStreak,
      lastWorkoutDate: today,
      workouts: updatedWorkouts,
      achievements,
      personalBest: newPersonalBest,
      totalLifetimePushups: state.totalLifetimePushups + pushups,
      variationStats: newVariationStats,
      variationPBs: newVariationPBs,
    });

    // Update daily goal
    get().updateDailyGoal();

    return {
      success: true,
      message: integrityCheck.isWorldRecordTerritory
        ? '⚠️ World Record Territory! Guinness World Records has been notified.'
        : 'Workout logged successfully!',
      warnings: integrityCheck.warnings.length > 0 ? integrityCheck.warnings : undefined,
    };
  },

  lockDay: (date: string) => {
    set((state) => ({
      workouts: state.workouts.map(w =>
        w.date === date
          ? { ...w, isLocked: true, lockedAt: new Date().toISOString() }
          : w
      ),
    }));
  },

  isDayLocked: (date: string) => {
    const workout = get().workouts.find(w => w.date === date);
    return workout?.isLocked || false;
  },

  addCoins: (amount: number) => set((state) => ({ coins: state.coins + amount })),

  useStreakFreeze: () => {
    const state = get();
    if (state.streakFreezes > 0) {
      set({ streakFreezes: state.streakFreezes - 1 });
    }
  },

  purchaseTitle: (titleId: string, price: number) => {
    const state = get();

    // Check if already purchased
    if (state.purchasedTitles.includes(titleId)) {
      return { success: false, message: 'You already own this title!' };
    }

    // Check if enough coins
    if (state.coins < price) {
      return { success: false, message: 'Not enough coins!' };
    }

    // Purchase title
    set((state) => ({
      coins: state.coins - price,
      purchasedTitles: [...state.purchasedTitles, titleId],
    }));

    return { success: true, message: 'Title purchased successfully!' };
  },

  equipTitle: (titleId: string | null) => {
    set({ activeTitle: titleId });
  },

  purchasePowerUp: (powerUpType: PowerUpType) => {
    const state = get();
    const { POWER_UPS } = require('./powerUps');
    const powerUp = POWER_UPS[powerUpType];
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const purchaseHistory = state.powerUpPurchaseHistory[powerUpType] || [];
    const recentPurchases = purchaseHistory.filter((stamp) => new Date(stamp) >= windowStart);
    const windowLimit = powerUpType === 'streak_freeze' ? 1 : 3;

    if (!powerUp) {
      return { success: false, message: 'Invalid power-up type!' };
    }

    if (recentPurchases.length >= windowLimit) {
      return { success: false, message: `7-day limit reached (${windowLimit}) for ${powerUp.name}.` };
    }

    // Check if enough coins
    if (state.coins < powerUp.price) {
      return { success: false, message: 'Not enough coins!' };
    }

    // Check max purchase limit for streak freezes
    if (powerUpType === 'streak_freeze') {
      // Purchase streak freeze - add to count
      set((state) => ({
        coins: state.coins - powerUp.price,
        streakFreezes: state.streakFreezes + 1,
        powerUpPurchaseHistory: {
          ...state.powerUpPurchaseHistory,
          [powerUpType]: [...recentPurchases, now.toISOString()],
        },
      }));
      return { success: true, message: 'Streak freeze purchased!' };
    }

    // For other power-ups, purchase and add to inventory
    set((state) => ({
      coins: state.coins - powerUp.price,
      activePowerUps: [
        ...state.activePowerUps,
        {
          type: powerUpType,
          activatedAt: new Date().toISOString(),
          used: false,
        },
      ],
      powerUpPurchaseHistory: {
        ...state.powerUpPurchaseHistory,
        [powerUpType]: [...recentPurchases, now.toISOString()],
      },
    }));

    return { success: true, message: `${powerUp.name} purchased!` };
  },

  activatePowerUp: (powerUpType: PowerUpType) => {
    const state = get();
    const powerUp = state.activePowerUps.find(p => p.type === powerUpType && !p.used);

    if (!powerUp) {
      return { success: false, message: 'Power-up not found or already used!' };
    }

    // Mark as used
    set({
      activePowerUps: state.activePowerUps.map(p =>
        p.type === powerUpType && !p.used ? { ...p, used: true } : p
      ),
    });

    return { success: true, message: 'Power-up activated!' };
  },

  updateQuests: () => {
    // Placeholder for quest update logic
    // Will be implemented when quest system is fully integrated
  },

  claimQuestReward: (questId: string) => {
    const state = get();
    const quest = state.quests.find(q => q.id === questId);

    if (!quest) {
      return { success: false, message: 'Quest not found!' };
    }

    if (!quest.completed) {
      return { success: false, message: 'Quest not completed yet!' };
    }

    if (quest.claimed) {
      return { success: false, message: 'Reward already claimed!' };
    }

    // Award rewards
    set({
      coins: state.coins + quest.coinReward,
      totalXp: state.totalXp + quest.xpReward,
      quests: state.quests.map(q =>
        q.id === questId ? { ...q, claimed: true } : q
      ),
    });

    return { success: true, message: `Claimed ${quest.coinReward} coins and ${quest.xpReward} XP!` };
  },

  checkAndUnlockAchievements: () => {
    const state = get();
    const { checkAchievements } = require('./achievements');

    const achievementCheckData = {
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      totalLifetimePushups: state.totalLifetimePushups,
      variationStats: state.variationStats,
      workouts: state.workouts,
      totalGoalsCompleted: state.workouts.filter(w => w.goalCompleted).length,
    };

    const newAchievements = checkAchievements(achievementCheckData, state.unlockedAchievements);

    if (newAchievements.length > 0) {
      const newUnlocked = [...state.unlockedAchievements, ...newAchievements.map(a => a.id)];
      const newToasts = [...state.achievementToasts, ...newAchievements.map(a => a.id)];

      // Add XP and coins for each unlocked achievement
      let totalXpReward = 0;
      let totalCoinReward = 0;

      newAchievements.forEach(achievement => {
        totalXpReward += achievement.xpReward;
        totalCoinReward += achievement.coinReward;
      });

      set({
        unlockedAchievements: newUnlocked,
        achievementToasts: newToasts,
        totalXp: state.totalXp + totalXpReward,
        coins: state.coins + totalCoinReward,
      });

      // Recalculate rank after XP gain
      get().calculateCurrentRank();
    }
  },

  dismissAchievementToast: () => {
    set((state) => ({
      achievementToasts: state.achievementToasts.slice(1),
    }));
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

  getWorkoutByDate: (date: string) => {
    return get().workouts.find(w => w.date === date);
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

  updateDailyGoal: () => {
    const state = get();
    const goal = calculateDailyGoal(state.proficiency, state.currentStreak, state.personalBest);
    set({ dailyGoal: goal });
  },
}));
