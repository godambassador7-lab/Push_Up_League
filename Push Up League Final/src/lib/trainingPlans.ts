import type { PlanTemplate } from './adaptiveEngine';

export type PlanDuration = 7 | 14 | 30;
export type PlanDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingPlan {
  id: string;
  name: string;
  duration: PlanDuration;
  difficulty: PlanDifficulty;
  description: string;
  weeklySchedule: {
    day: number; // 1-7 (Monday-Sunday)
    templateId: string;
    dayLabel: string;
  }[];
}

/**
 * 7-Day Training Plans
 */
export const BEGINNER_7_DAY: TrainingPlan = {
  id: 'beginner-7',
  name: 'Beginner 7-Day',
  duration: 7,
  difficulty: 'beginner',
  description: 'Build foundation with 3 workouts per week',
  weeklySchedule: [
    { day: 1, templateId: 'rookie-volume-day', dayLabel: 'Volume Focus' },
    { day: 3, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 5, templateId: 'rookie-endurance-day', dayLabel: 'Endurance Focus' },
  ],
};

export const INTERMEDIATE_7_DAY: TrainingPlan = {
  id: 'intermediate-7',
  name: 'Intermediate 7-Day',
  duration: 7,
  difficulty: 'intermediate',
  description: 'Progressive overload with 4 workouts per week',
  weeklySchedule: [
    { day: 1, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 2, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 4, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 6, templateId: 'warrior-boss-day', dayLabel: 'Challenge Day' },
  ],
};

export const ADVANCED_7_DAY: TrainingPlan = {
  id: 'advanced-7',
  name: 'Advanced 7-Day',
  duration: 7,
  difficulty: 'advanced',
  description: 'High intensity with 5 workouts per week',
  weeklySchedule: [
    { day: 1, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 2, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 3, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 5, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 7, templateId: 'elite-boss-day', dayLabel: 'Challenge Day' },
  ],
};

/**
 * 14-Day Training Plans
 */
export const BEGINNER_14_DAY: TrainingPlan = {
  id: 'beginner-14',
  name: 'Beginner 14-Day',
  duration: 14,
  difficulty: 'beginner',
  description: 'Progressive 2-week foundation builder',
  weeklySchedule: [
    // Week 1
    { day: 1, templateId: 'rookie-volume-day', dayLabel: 'Volume Focus' },
    { day: 3, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 5, templateId: 'rookie-endurance-day', dayLabel: 'Endurance Focus' },
    // Week 2
    { day: 8, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 10, templateId: 'rookie-volume-day', dayLabel: 'Volume Day' },
    { day: 12, templateId: 'rookie-boss-day', dayLabel: 'Challenge Day' },
  ],
};

export const INTERMEDIATE_14_DAY: TrainingPlan = {
  id: 'intermediate-14',
  name: 'Intermediate 14-Day',
  duration: 14,
  difficulty: 'intermediate',
  description: 'Balanced 2-week progression cycle',
  weeklySchedule: [
    // Week 1
    { day: 1, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 2, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 4, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 6, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    // Week 2
    { day: 8, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 10, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 12, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 14, templateId: 'warrior-boss-day', dayLabel: 'Challenge Day' },
  ],
};

export const ADVANCED_14_DAY: TrainingPlan = {
  id: 'advanced-14',
  name: 'Advanced 14-Day',
  duration: 14,
  difficulty: 'advanced',
  description: 'Intense 2-week periodization cycle',
  weeklySchedule: [
    // Week 1 - Strength Focus
    { day: 1, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 2, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 3, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 5, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 6, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    // Week 2 - Intensity Peak
    { day: 8, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 9, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 11, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 12, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 14, templateId: 'elite-boss-day', dayLabel: 'Challenge Day' },
  ],
};

/**
 * 30-Day Training Plans
 */
export const BEGINNER_30_DAY: TrainingPlan = {
  id: 'beginner-30',
  name: 'Beginner 30-Day',
  duration: 30,
  difficulty: 'beginner',
  description: 'Complete month-long transformation program',
  weeklySchedule: [
    // Week 1 - Foundation
    { day: 1, templateId: 'rookie-volume-day', dayLabel: 'Volume Focus' },
    { day: 3, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 5, templateId: 'rookie-endurance-day', dayLabel: 'Endurance Focus' },
    // Week 2 - Build
    { day: 8, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 10, templateId: 'rookie-volume-day', dayLabel: 'Volume Day' },
    { day: 12, templateId: 'rookie-endurance-day', dayLabel: 'Endurance Focus' },
    // Week 3 - Progress
    { day: 15, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 17, templateId: 'rookie-volume-day', dayLabel: 'Volume Day' },
    { day: 19, templateId: 'rookie-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 21, templateId: 'rookie-boss-day', dayLabel: 'Challenge Day' },
    // Week 4 - Peak
    { day: 22, templateId: 'rookie-strength-day', dayLabel: 'Strength Focus' },
    { day: 24, templateId: 'rookie-volume-day', dayLabel: 'Volume Day' },
    { day: 26, templateId: 'rookie-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 28, templateId: 'rookie-boss-day', dayLabel: 'Final Challenge' },
  ],
};

export const INTERMEDIATE_30_DAY: TrainingPlan = {
  id: 'intermediate-30',
  name: 'Intermediate 30-Day',
  duration: 30,
  difficulty: 'intermediate',
  description: 'Advanced progression with periodization',
  weeklySchedule: [
    // Week 1 - Strength Phase
    { day: 1, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 2, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 4, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 6, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    // Week 2 - Volume Phase
    { day: 8, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 10, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 11, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 13, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    // Week 3 - Endurance Phase
    { day: 15, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 17, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 18, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 20, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 21, templateId: 'warrior-boss-day', dayLabel: 'Mid Challenge' },
    // Week 4 - Peak Phase
    { day: 22, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 24, templateId: 'warrior-volume-day', dayLabel: 'Volume Day' },
    { day: 25, templateId: 'warrior-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 27, templateId: 'warrior-strength-day', dayLabel: 'Strength Focus' },
    { day: 29, templateId: 'warrior-boss-day', dayLabel: 'Final Challenge' },
  ],
};

export const ADVANCED_30_DAY: TrainingPlan = {
  id: 'advanced-30',
  name: 'Advanced 30-Day',
  duration: 30,
  difficulty: 'advanced',
  description: 'Elite-level month-long periodization',
  weeklySchedule: [
    // Week 1 - Volume Accumulation
    { day: 1, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 2, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 3, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 5, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 6, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    // Week 2 - Intensity Build
    { day: 8, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 9, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 10, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 12, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 13, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    // Week 3 - Peak Intensity
    { day: 15, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 16, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 17, templateId: 'elite-endurance-day', dayLabel: 'Endurance Focus' },
    { day: 19, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 20, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 21, templateId: 'elite-boss-day', dayLabel: 'Mid Challenge' },
    // Week 4 - Deload & Peak
    { day: 22, templateId: 'elite-endurance-day', dayLabel: 'Active Recovery' },
    { day: 24, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 26, templateId: 'elite-volume-day', dayLabel: 'Volume Day' },
    { day: 27, templateId: 'elite-strength-day', dayLabel: 'Strength Focus' },
    { day: 29, templateId: 'elite-boss-day', dayLabel: 'Final Challenge' },
  ],
};

/**
 * Get all available training plans
 */
export const ALL_TRAINING_PLANS: TrainingPlan[] = [
  BEGINNER_7_DAY,
  INTERMEDIATE_7_DAY,
  ADVANCED_7_DAY,
  BEGINNER_14_DAY,
  INTERMEDIATE_14_DAY,
  ADVANCED_14_DAY,
  BEGINNER_30_DAY,
  INTERMEDIATE_30_DAY,
  ADVANCED_30_DAY,
];

/**
 * Get training plans by duration
 */
export function getPlansByDuration(duration: PlanDuration): TrainingPlan[] {
  return ALL_TRAINING_PLANS.filter(plan => plan.duration === duration);
}

/**
 * Get a specific training plan
 */
export function getTrainingPlan(id: string): TrainingPlan | undefined {
  return ALL_TRAINING_PLANS.find(plan => plan.id === id);
}

/**
 * Get the template for a specific day in a plan
 */
export function getTemplateForPlanDay(plan: TrainingPlan, dayNumber: number): string | null {
  const schedule = plan.weeklySchedule.find(s => s.day === dayNumber);
  return schedule ? schedule.templateId : null;
}

/**
 * Calculate current day in the plan based on start date
 */
export function getCurrentPlanDay(startDate: string, duration: PlanDuration): number {
  const start = new Date(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Return day number (1-indexed), wrap around if past duration
  return (daysPassed % duration) + 1;
}

/**
 * Check if today is a workout day in the plan
 */
export function isWorkoutDay(plan: TrainingPlan, dayNumber: number): boolean {
  return plan.weeklySchedule.some(s => s.day === dayNumber);
}
