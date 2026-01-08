// Daily bonus system - 2 random days per week get bonus rewards

export interface DailyBonus {
  active: boolean;
  xpMultiplier: number;
  coinMultiplier: number;
  type: 'xp' | 'coin' | 'both';
  message: string;
}

// Generate 2 random bonus days for the current week
const generateWeeklyBonusDays = (weekStart: Date): number[] => {
  const seed = weekStart.getTime();
  // Simple seeded random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const bonusDays: number[] = [];
  const availableDays = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday

  // Pick 2 random days
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(seededRandom(seed + i) * availableDays.length);
    bonusDays.push(availableDays[randomIndex]);
    availableDays.splice(randomIndex, 1);
  }

  return bonusDays.sort((a, b) => a - b);
};

// Get the start of the week (Sunday) for a given date
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Check if today has a daily bonus
export const getTodayBonus = (): DailyBonus => {
  const today = new Date();
  const weekStart = getWeekStart(today);
  const bonusDays = generateWeeklyBonusDays(weekStart);
  const todayDayOfWeek = today.getDay();

  if (!bonusDays.includes(todayDayOfWeek)) {
    return {
      active: false,
      xpMultiplier: 1,
      coinMultiplier: 1,
      type: 'both',
      message: '',
    };
  }

  // Determine bonus type based on day position in bonus array
  const bonusIndex = bonusDays.indexOf(todayDayOfWeek);
  const bonusTypes = ['xp', 'coin', 'both'] as const;
  const type = bonusTypes[bonusIndex % 3];

  let xpMultiplier = 1;
  let coinMultiplier = 1;
  let message = '';

  switch (type) {
    case 'xp':
      xpMultiplier = 1.5;
      message = '🎯 +50% XP Bonus Day!';
      break;
    case 'coin':
      coinMultiplier = 2.0;
      message = '💰 2x Coins Bonus Day!';
      break;
    case 'both':
      xpMultiplier = 1.25;
      coinMultiplier = 1.5;
      message = '🎉 +25% XP & +50% Coins Bonus Day!';
      break;
  }

  return {
    active: true,
    xpMultiplier,
    coinMultiplier,
    type,
    message,
  };
};

// Get upcoming bonus days for display
export const getUpcomingBonusDays = (): { date: Date; bonus: DailyBonus }[] => {
  const today = new Date();
  const weekStart = getWeekStart(today);
  const bonusDays = generateWeeklyBonusDays(weekStart);

  return bonusDays.map((dayOfWeek) => {
    const bonusDate = new Date(weekStart);
    bonusDate.setDate(weekStart.getDate() + dayOfWeek);

    const bonusIndex = bonusDays.indexOf(dayOfWeek);
    const bonusTypes = ['xp', 'coin', 'both'] as const;
    const type = bonusTypes[bonusIndex % 3];

    let xpMultiplier = 1;
    let coinMultiplier = 1;
    let message = '';

    switch (type) {
      case 'xp':
        xpMultiplier = 1.5;
        message = '🎯 +50% XP Bonus Day!';
        break;
      case 'coin':
        coinMultiplier = 2.0;
        message = '💰 2x Coins Bonus Day!';
        break;
      case 'both':
        xpMultiplier = 1.25;
        coinMultiplier = 1.5;
        message = '🎉 +25% XP & +50% Coins Bonus Day!';
        break;
    }

    return {
      date: bonusDate,
      bonus: {
        active: true,
        xpMultiplier,
        coinMultiplier,
        type,
        message,
      },
    };
  });
};
