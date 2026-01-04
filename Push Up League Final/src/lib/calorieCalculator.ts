import { PushUpType, getPushUpTypeData } from './pushupTypes';

/**
 * Calorie Tracking System for Push-Up League
 *
 * Formula: Calories = reps × base × difficultyMultiplier
 *
 * Base Formula: 0.04 × bodyweight (kg) / 10
 * Average adult (77kg / 170lbs) → ~0.09 cal/rep for standard push-ups
 */

export interface CalorieEstimate {
  calories: number;
  reps: number;
  pushupType: PushUpType;
  bodyWeightKg: number;
  message: string;
}

export interface WeeklyCalorieStats {
  totalCalories: number;
  totalReps: number;
  averageCaloriesPerDay: number;
  highestDay: { date: string; calories: number };
  afterburnBonus: boolean; // True if high-volume week (>300 total reps)
}

/**
 * Default body weight in kg (77kg = ~170lbs)
 */
export const DEFAULT_BODY_WEIGHT_KG = 77;

/**
 * Calculate base calories per rep based on body weight
 * @param bodyWeightKg User's body weight in kilograms
 * @returns Base calories per standard push-up
 */
export function calculateBaseCaloriesPerRep(bodyWeightKg: number): number {
  return (0.04 * bodyWeightKg) / 10;
}

/**
 * Get difficulty multiplier for a specific push-up type
 * Maps XP multiplier to calorie multiplier (slightly adjusted for realism)
 */
export function getDifficultyMultiplier(pushupType: PushUpType): number {
  const typeData = getPushUpTypeData(pushupType);
  const xpMult = typeData.xpMultiplier;

  // Convert XP multiplier to calorie multiplier
  // Lower multipliers are slightly increased to reflect actual effort
  if (xpMult < 1.0) return xpMult + 0.2; // Regressions: 0.5x → 0.7x
  if (xpMult <= 1.2) return xpMult; // Standard-ish: 1.0x-1.2x
  if (xpMult <= 1.5) return xpMult * 0.95; // Advanced: slight reduction
  if (xpMult <= 2.0) return xpMult * 0.9; // Elite: more reduction
  return xpMult * 0.85; // Master: significant reduction
}

/**
 * Calculate calories burned for a push-up workout
 * @param reps Number of push-ups performed
 * @param pushupType Type of push-up variation
 * @param bodyWeightKg User's body weight in kg (optional, defaults to 77kg)
 * @returns CalorieEstimate object with detailed breakdown
 */
export function calculateCalories(
  reps: number,
  pushupType: PushUpType = 'standard',
  bodyWeightKg: number = DEFAULT_BODY_WEIGHT_KG
): CalorieEstimate {
  const base = calculateBaseCaloriesPerRep(bodyWeightKg);
  const multiplier = getDifficultyMultiplier(pushupType);
  const calories = Math.round(reps * base * multiplier * 10) / 10; // Round to 1 decimal

  // Generate contextual message
  let message = '';
  if (calories < 5) {
    message = 'Every rep counts! Small sessions add up over time.';
  } else if (calories < 15) {
    message = 'Solid work! Consistency beats intensity.';
  } else if (calories < 30) {
    message = 'Great session! Your strength gains matter more than calories.';
  } else if (calories < 50) {
    message = 'High-volume session! Muscle-building mode activated.';
  } else {
    message = 'Beast mode! You earned the afterburn effect.';
  }

  return {
    calories,
    reps,
    pushupType,
    bodyWeightKg,
    message,
  };
}

/**
 * Calculate total calories for multiple sets with different variations
 */
export function calculateMultiSetCalories(
  sets: Array<{ reps: number; pushupType: PushUpType }>,
  bodyWeightKg: number = DEFAULT_BODY_WEIGHT_KG
): number {
  return sets.reduce((total, set) => {
    const estimate = calculateCalories(set.reps, set.pushupType, bodyWeightKg);
    return total + estimate.calories;
  }, 0);
}

/**
 * Calculate weekly calorie statistics
 * @param workouts Array of workouts with date, reps, and pushup type
 * @param bodyWeightKg User's body weight in kg
 * @returns WeeklyCalorieStats with aggregated data
 */
export function calculateWeeklyStats(
  workouts: Array<{ date: string; reps: number; pushupType: PushUpType }>,
  bodyWeightKg: number = DEFAULT_BODY_WEIGHT_KG
): WeeklyCalorieStats {
  // Get last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    return workoutDate >= sevenDaysAgo && workoutDate <= now;
  });

  // Aggregate by date
  const dailyStats = new Map<string, { calories: number; reps: number }>();

  recentWorkouts.forEach((workout) => {
    const { calories } = calculateCalories(workout.reps, workout.pushupType, bodyWeightKg);
    const existing = dailyStats.get(workout.date) || { calories: 0, reps: 0 };
    dailyStats.set(workout.date, {
      calories: existing.calories + calories,
      reps: existing.reps + workout.reps,
    });
  });

  // Calculate totals
  let totalCalories = 0;
  let totalReps = 0;
  let highestDay = { date: '', calories: 0 };

  dailyStats.forEach((stats, date) => {
    totalCalories += stats.calories;
    totalReps += stats.reps;
    if (stats.calories > highestDay.calories) {
      highestDay = { date, calories: stats.calories };
    }
  });

  const averageCaloriesPerDay = dailyStats.size > 0 ? totalCalories / 7 : 0;
  const afterburnBonus = totalReps > 300; // High-volume week threshold

  return {
    totalCalories: Math.round(totalCalories * 10) / 10,
    totalReps,
    averageCaloriesPerDay: Math.round(averageCaloriesPerDay * 10) / 10,
    highestDay,
    afterburnBonus,
  };
}

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return Math.round((lbs * 0.453592) * 10) / 10;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return Math.round((kg * 2.20462) * 10) / 10;
}

/**
 * Get calorie burn message for UI display
 */
export function getCalorieBurnMessage(
  calories: number,
  strengthGainIndicator: boolean = false
): string {
  if (strengthGainIndicator) {
    return 'Calories burned today are lower, but your strength score increased. Building muscle > burning calories!';
  }

  if (calories >= 50) {
    return 'Outstanding calorie burn! Your metabolism will be elevated for hours.';
  } else if (calories >= 30) {
    return 'Great work! These strength gains will increase your daily calorie burn.';
  } else if (calories >= 15) {
    return 'Solid effort! Remember: muscle-building creates long-term fat loss.';
  } else if (calories >= 5) {
    return 'Every session counts! Consistency builds muscle that burns calories 24/7.';
  } else {
    return 'Quality over quantity! Perfect form builds strength more than high reps.';
  }
}
