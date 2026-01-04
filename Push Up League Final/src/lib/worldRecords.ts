// World Records Data for Push-ups
// Sources: Guinness World Records and various athletic databases

export const WORLD_RECORDS = {
  mostInOneHour: 3877, // Bijender Singh (India) - 1988
  mostIn24Hours: 46001, // Charles Servizio (USA) - 1993
  mostInOneMinute: 152, // Jarrad Young (Australia) - 2018
  mostConsecutive: 10507, // Minoru Yoshida (Japan) - 1980
  mostInOneWeek: 100000, // Estimated elite range
};

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'world-class';

export interface ProficiencyData {
  level: ProficiencyLevel;
  label: string;
  description: string;
  maxPushupsRange: { min: number; max: number };
  dailyCapacity: { min: number; max: number };
  hourlyCapacity: { min: number; max: number };
}

export const PROFICIENCY_LEVELS: Record<ProficiencyLevel, ProficiencyData> = {
  beginner: {
    level: 'beginner',
    label: 'Beginner',
    description: 'Just starting out (1-20 push-ups in one set)',
    maxPushupsRange: { min: 1, max: 20 },
    dailyCapacity: { min: 10, max: 100 },
    hourlyCapacity: { min: 5, max: 50 },
  },
  intermediate: {
    level: 'intermediate',
    label: 'Intermediate',
    description: 'Regular training (21-50 push-ups in one set)',
    maxPushupsRange: { min: 21, max: 50 },
    dailyCapacity: { min: 100, max: 500 },
    hourlyCapacity: { min: 50, max: 200 },
  },
  advanced: {
    level: 'advanced',
    label: 'Advanced',
    description: 'Experienced athlete (51-100 push-ups in one set)',
    maxPushupsRange: { min: 51, max: 100 },
    dailyCapacity: { min: 500, max: 2000 },
    hourlyCapacity: { min: 200, max: 800 },
  },
  elite: {
    level: 'elite',
    label: 'Elite',
    description: 'Competitive level (100-200 push-ups in one set)',
    maxPushupsRange: { min: 100, max: 200 },
    dailyCapacity: { min: 2000, max: 10000 },
    hourlyCapacity: { min: 800, max: 2000 },
  },
  'world-class': {
    level: 'world-class',
    label: 'World-Class',
    description: 'World record contender (200+ push-ups in one set)',
    maxPushupsRange: { min: 200, max: 10000 },
    dailyCapacity: { min: 10000, max: 50000 },
    hourlyCapacity: { min: 2000, max: 4000 },
  },
};

export interface IntegrityCheck {
  isValid: boolean;
  suspicionLevel: 'none' | 'low' | 'medium' | 'high' | 'extreme';
  warnings: string[];
  isWorldRecordTerritory: boolean;
}

export function checkIntegrity(
  proficiency: ProficiencyLevel,
  pushupsLogged: number,
  timeframe: 'session' | 'hour' | 'day',
  userHistory: { date: string; pushups: number }[]
): IntegrityCheck {
  const profData = PROFICIENCY_LEVELS[proficiency];
  const warnings: string[] = [];
  let suspicionLevel: IntegrityCheck['suspicionLevel'] = 'none';
  let isWorldRecordTerritory = false;

  // Check against proficiency capacity
  if (timeframe === 'day') {
    if (pushupsLogged > profData.dailyCapacity.max * 2) {
      warnings.push(`Daily volume (${pushupsLogged}) far exceeds expected capacity for ${profData.label} level`);
      suspicionLevel = 'high';
    } else if (pushupsLogged > profData.dailyCapacity.max) {
      warnings.push(`Daily volume is above typical ${profData.label} capacity`);
      suspicionLevel = suspicionLevel === 'none' ? 'low' : suspicionLevel;
    }

    // Check against world records
    if (pushupsLogged > WORLD_RECORDS.mostIn24Hours * 0.5) {
      warnings.push('Approaching 50% of 24-hour world record');
      isWorldRecordTerritory = true;
      suspicionLevel = 'high';
    }

    if (pushupsLogged > WORLD_RECORDS.mostIn24Hours) {
      warnings.push('⚠️ EXCEEDS 24-HOUR WORLD RECORD - Guinness notification pending');
      isWorldRecordTerritory = true;
      suspicionLevel = 'extreme';
    }
  }

  if (timeframe === 'hour') {
    if (pushupsLogged > profData.hourlyCapacity.max * 2) {
      warnings.push(`Hourly volume (${pushupsLogged}) far exceeds expected capacity`);
      suspicionLevel = 'high';
    }

    if (pushupsLogged > WORLD_RECORDS.mostInOneHour) {
      warnings.push('⚠️ EXCEEDS 1-HOUR WORLD RECORD - Guinness notification pending');
      isWorldRecordTerritory = true;
      suspicionLevel = 'extreme';
    }
  }

  // Check progression consistency
  if (userHistory.length > 7) {
    const recentWeek = userHistory.slice(-7);
    const avgRecent = recentWeek.reduce((sum, h) => sum + h.pushups, 0) / recentWeek.length;

    if (pushupsLogged > avgRecent * 3 && avgRecent > 0) {
      warnings.push('Unusual spike: 3x your recent average');
      suspicionLevel = suspicionLevel === 'none' ? 'medium' : suspicionLevel;
    }

    if (pushupsLogged > avgRecent * 5 && avgRecent > 0) {
      warnings.push('Extreme spike: 5x your recent average');
      suspicionLevel = 'high';
    }
  }

  const isValid = suspicionLevel !== 'extreme';

  return {
    isValid,
    suspicionLevel,
    warnings,
    isWorldRecordTerritory,
  };
}

export function calculateDailyGoal(
  proficiency: ProficiencyLevel,
  currentStreak: number,
  personalBest: number
): number {
  const profData = PROFICIENCY_LEVELS[proficiency];
  const baseGoal = profData.dailyCapacity.min;

  // Progressive goal based on streak
  const streakMultiplier = 1 + (currentStreak * 0.02); // +2% per day streak

  // Personal best consideration
  const pbAdjustment = personalBest > 0 ? Math.min(personalBest * 0.8, profData.dailyCapacity.max) : baseGoal;

  const goal = Math.floor(Math.max(baseGoal, pbAdjustment) * streakMultiplier);

  // Cap at proficiency max
  return Math.min(goal, profData.dailyCapacity.max);
}
