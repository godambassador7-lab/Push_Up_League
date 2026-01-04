import type { SessionLog, UserState as AdaptiveUserState } from './adaptiveEngine';
import type { Workout, UserState } from './store';

/**
 * Convert app Workout to adaptive engine SessionLog format
 */
export function workoutToSessionLog(workout: Workout): SessionLog {
  return {
    date: workout.date,
    sessionId: workout.sessionId || workout.id,
    templateId: workout.templateId,
    variation: workout.variation || 'Standard',
    sets: workout.setData || [],
    restSeconds: workout.restSeconds,
    timeSeconds: workout.timeSeconds,
    painReported: workout.painReported,
    notes: workout.notes,
  };
}

/**
 * Convert app UserState to adaptive engine UserState format
 */
export function userToAdaptiveUser(user: UserState): AdaptiveUserState {
  return {
    userId: user.userId,
    level: user.currentRank,
    division: user.division,
    goal: user.goal,
    baselineMax: user.baselineMax,
    readiness: user.readiness,
  };
}

/**
 * Get recent workout history as SessionLogs
 */
export function getRecentSessionLogs(workouts: Workout[], count: number = 10): SessionLog[] {
  return workouts
    .filter(w => w.setData && w.setData.length > 0) // Only workouts with set data
    .slice(-count)
    .map(workoutToSessionLog);
}

/**
 * Get workouts for a specific template
 */
export function getTemplateHistory(workouts: Workout[], templateId: string): SessionLog[] {
  return workouts
    .filter(w => w.templateId === templateId && w.setData)
    .map(workoutToSessionLog);
}
