import { PlanTemplate, Division, Goal } from './adaptiveEngine';

/**
 * Plan Templates for Push-Up League
 * Each template represents a training day pattern that the adaptive engine can modify
 */

// Rookie Division Templates
const rookieTemplates: PlanTemplate[] = [
  {
    templateId: 'rookie-strength-day',
    dayLabel: 'Strength Focus',
    intensity: 'hard',
    variation: 'Standard',
    sets: 4,
    targetReps: 8,
    restSeconds: 90,
    tempo: '3-1-1',
    allowVariationSwap: true
  },
  {
    templateId: 'rookie-endurance-day',
    dayLabel: 'Endurance Focus',
    intensity: 'medium',
    variation: 'Incline',
    sets: 5,
    targetReps: 12,
    restSeconds: 60,
    allowVariationSwap: true
  },
  {
    templateId: 'rookie-volume-day',
    dayLabel: 'Volume Day',
    intensity: 'easy',
    variation: 'Knee',
    sets: 6,
    targetReps: 15,
    restSeconds: 45,
    allowVariationSwap: true
  },
  {
    templateId: 'rookie-boss-day',
    dayLabel: 'Challenge Day',
    intensity: 'boss',
    variation: 'Wide',
    sets: 3,
    targetReps: 10,
    restSeconds: 120,
    tempo: '3-2-1',
    allowVariationSwap: false
  }
];

// Warrior Division Templates
const warriorTemplates: PlanTemplate[] = [
  {
    templateId: 'warrior-strength-day',
    dayLabel: 'Strength Focus',
    intensity: 'hard',
    variation: 'Diamond',
    sets: 5,
    targetReps: 10,
    restSeconds: 120,
    tempo: '3-1-1',
    allowVariationSwap: true
  },
  {
    templateId: 'warrior-endurance-day',
    dayLabel: 'Endurance Focus',
    intensity: 'medium',
    variation: 'Standard',
    sets: 6,
    targetReps: 15,
    restSeconds: 60,
    allowVariationSwap: true
  },
  {
    templateId: 'warrior-volume-day',
    dayLabel: 'Volume Day',
    intensity: 'easy',
    variation: 'Wide',
    sets: 7,
    targetReps: 18,
    restSeconds: 45,
    allowVariationSwap: true
  },
  {
    templateId: 'warrior-boss-day',
    dayLabel: 'Challenge Day',
    intensity: 'boss',
    variation: 'Decline',
    sets: 4,
    targetReps: 12,
    restSeconds: 150,
    tempo: '4-2-1',
    allowVariationSwap: false
  }
];

// Elite Division Templates
const eliteTemplates: PlanTemplate[] = [
  {
    templateId: 'elite-strength-day',
    dayLabel: 'Strength Focus',
    intensity: 'hard',
    variation: 'Archer',
    sets: 5,
    targetReps: 8,
    restSeconds: 150,
    tempo: '4-1-1',
    allowVariationSwap: true
  },
  {
    templateId: 'elite-endurance-day',
    dayLabel: 'Endurance Focus',
    intensity: 'medium',
    variation: 'Diamond',
    sets: 6,
    targetReps: 15,
    restSeconds: 75,
    allowVariationSwap: true
  },
  {
    templateId: 'elite-volume-day',
    dayLabel: 'Volume Day',
    intensity: 'easy',
    variation: 'Decline',
    sets: 8,
    targetReps: 20,
    restSeconds: 60,
    allowVariationSwap: true
  },
  {
    templateId: 'elite-boss-day',
    dayLabel: 'Challenge Day',
    intensity: 'boss',
    variation: 'PseudoPlanche',
    sets: 4,
    targetReps: 6,
    restSeconds: 180,
    tempo: '5-2-1',
    allowVariationSwap: false
  }
];

/**
 * Get plan templates for a specific division
 */
export function getTemplatesForDivision(division: Division): PlanTemplate[] {
  switch (division) {
    case 'Rookie':
      return rookieTemplates;
    case 'Warrior':
      return warriorTemplates;
    case 'Elite':
      return eliteTemplates;
    default:
      return rookieTemplates;
  }
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(templateId: string): PlanTemplate | undefined {
  const allTemplates = [...rookieTemplates, ...warriorTemplates, ...eliteTemplates];
  return allTemplates.find(t => t.templateId === templateId);
}

/**
 * Get recommended template based on user's goal and division
 */
export function getRecommendedTemplate(division: Division, goal: Goal): PlanTemplate {
  const templates = getTemplatesForDivision(division);

  // Match template to goal
  if (goal === 'Strength') {
    return templates.find(t => t.dayLabel === 'Strength Focus') || templates[0];
  } else if (goal === 'Endurance') {
    return templates.find(t => t.dayLabel === 'Endurance Focus') || templates[1];
  } else if (goal === 'Hypertrophy') {
    return templates.find(t => t.dayLabel === 'Volume Day') || templates[2];
  } else {
    // Mixed - rotate between different focuses
    return templates[0];
  }
}

/**
 * Get all available templates
 */
export function getAllTemplates(): PlanTemplate[] {
  return [...rookieTemplates, ...warriorTemplates, ...eliteTemplates];
}
