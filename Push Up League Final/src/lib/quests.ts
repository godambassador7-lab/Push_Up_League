export type QuestType = 'daily' | 'weekly';
export type QuestObjective =
  | 'complete_days'
  | 'hit_goal'
  | 'total_pushups'
  | 'use_variation'
  | 'multi_set_days'
  | 'perfect_week';

export interface Quest {
  id: string;
  type: QuestType;
  name: string;
  description: string;
  objective: QuestObjective;
  target: number;
  progress: number;
  coinReward: number;
  xpReward: number;
  icon: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  claimed: boolean;
}

export const generateDailyQuests = (currentDate: string): Quest[] => {
  const quests: Quest[] = [];
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  quests.push({
    id: `daily_goal_${currentDate}`,
    type: 'daily',
    name: 'Goal Crusher',
    description: 'Complete your daily goal',
    objective: 'hit_goal',
    target: 1,
    progress: 0,
    coinReward: 15,
    xpReward: 50,
    icon: '🎯',
    startDate: currentDate,
    endDate: tomorrow.toISOString().split('T')[0],
    completed: false,
    claimed: false,
  });

  quests.push({
    id: `daily_variation_${currentDate}`,
    type: 'daily',
    name: 'Variety Master',
    description: 'Try a non-standard push-up variation',
    objective: 'use_variation',
    target: 1,
    progress: 0,
    coinReward: 10,
    xpReward: 30,
    icon: '🎨',
    startDate: currentDate,
    endDate: tomorrow.toISOString().split('T')[0],
    completed: false,
    claimed: false,
  });

  return quests;
};

export const generateWeeklyQuests = (weekStart: string): Quest[] => {
  const quests: Quest[] = [];
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  quests.push({
    id: `weekly_consistency_${weekStart}`,
    type: 'weekly',
    name: 'Consistent Warrior',
    description: 'Complete 5 logged days this week',
    objective: 'complete_days',
    target: 5,
    progress: 0,
    coinReward: 50,
    xpReward: 200,
    icon: '📅',
    startDate: weekStart,
    endDate: weekEnd.toISOString().split('T')[0],
    completed: false,
    claimed: false,
  });

  quests.push({
    id: `weekly_volume_${weekStart}`,
    type: 'weekly',
    name: 'Volume Beast',
    description: 'Complete 300 total push-ups this week',
    objective: 'total_pushups',
    target: 300,
    progress: 0,
    coinReward: 60,
    xpReward: 250,
    icon: '💪',
    startDate: weekStart,
    endDate: weekEnd.toISOString().split('T')[0],
    completed: false,
    claimed: false,
  });

  quests.push({
    id: `weekly_multiset_${weekStart}`,
    type: 'weekly',
    name: 'Set Specialist',
    description: 'Log 3 workouts with at least 2 sets each',
    objective: 'multi_set_days',
    target: 3,
    progress: 0,
    coinReward: 40,
    xpReward: 150,
    icon: '🔢',
    startDate: weekStart,
    endDate: weekEnd.toISOString().split('T')[0],
    completed: false,
    claimed: false,
  });

  return quests;
};

export const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Get Monday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};
