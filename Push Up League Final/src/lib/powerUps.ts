export type PowerUpType = 'streak_freeze' | 'double_xp' | 'challenge_reroll' | 'goal_reducer';

export interface PowerUp {
  id: PowerUpType;
  name: string;
  description: string;
  price: number;
  icon: string;
  duration?: string;
  maxPurchase?: number;
}

export const POWER_UPS: Record<PowerUpType, PowerUp> = {
  streak_freeze: {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for one missed day. Use it before your streak breaks!',
    price: 150,
    icon: 'ðŸ§Š',
    maxPurchase: 5,
  },
  double_xp: {
    id: 'double_xp',
    name: 'Double XP Boost',
    description: 'Earn 2x XP on your next workout. Perfect for rank pushing!',
    price: 125,
    icon: 'âš¡',
    duration: 'Next workout',
  },
  challenge_reroll: {
    id: 'challenge_reroll',
    name: 'Challenge Reroll',
    description: 'Get a new daily challenge if you don\'t like the current one',
    price: 75,
    icon: 'ðŸŽ²',
    duration: 'Instant',
  },
  goal_reducer: {
    id: 'goal_reducer',
    name: 'Goal Reducer',
    description: 'Reduce today\'s goal by 25% for a recovery day',
    price: 100,
    icon: 'ðŸ›¡ï¸',
    duration: 'Today only',
  },
};

export interface ActivePowerUp {
  type: PowerUpType;
  activatedAt: string;
  expiresAt?: string;
  used: boolean;
}


