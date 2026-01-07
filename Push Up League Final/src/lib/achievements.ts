import { PushUpType } from './pushupTypes';

export type AchievementType = 'streak' | 'volume' | 'rank' | 'consistency' | 'variety' | 'comeback' | 'challenge' | 'speed' | 'endurance' | 'special';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  requirement: number | string;
  icon: string;
  xpReward: number;
  coinReward: number;
  checkUnlock: (data: AchievementCheckData) => boolean;
}

export interface AchievementCheckData {
  totalLifetimePushups: number;
  currentStreak: number;
  longestStreak: number;
  workouts: any[];
  variationStats: Record<PushUpType, number>;
  totalGoalsCompleted?: number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // STREAK ACHIEVEMENTS (30 total)
  { id: 'streak_3', title: 'Getting Started', description: 'Complete workouts for 3 days in a row', type: 'streak', requirement: 3, icon: '🔥', xpReward: 50, coinReward: 10, checkUnlock: (data) => data.currentStreak >= 3 },
  { id: 'streak_7', title: 'Week Warrior', description: 'Complete workouts for 7 days in a row', type: 'streak', requirement: 7, icon: '⚡', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.currentStreak >= 7 },
  { id: 'streak_14', title: 'Two Week Champion', description: 'Complete workouts for 14 days in a row', type: 'streak', requirement: 14, icon: '💪', xpReward: 200, coinReward: 40, checkUnlock: (data) => data.currentStreak >= 14 },
  { id: 'streak_21', title: 'Habit Former', description: 'Complete workouts for 21 days in a row', type: 'streak', requirement: 21, icon: '🌟', xpReward: 250, coinReward: 50, checkUnlock: (data) => data.currentStreak >= 21 },
  { id: 'streak_30', title: 'Monthly Master', description: 'Complete workouts for 30 days in a row', type: 'streak', requirement: 30, icon: '👑', xpReward: 300, coinReward: 60, checkUnlock: (data) => data.currentStreak >= 30 },
  { id: 'streak_45', title: 'Commitment King', description: 'Complete workouts for 45 days in a row', type: 'streak', requirement: 45, icon: '🎯', xpReward: 350, coinReward: 70, checkUnlock: (data) => data.currentStreak >= 45 },
  { id: 'streak_60', title: 'Unstoppable', description: 'Complete workouts for 60 days in a row', type: 'streak', requirement: 60, icon: '🏆', xpReward: 400, coinReward: 80, checkUnlock: (data) => data.currentStreak >= 60 },
  { id: 'streak_75', title: 'Discipline Master', description: 'Complete workouts for 75 days in a row', type: 'streak', requirement: 75, icon: '⭐', xpReward: 450, coinReward: 90, checkUnlock: (data) => data.currentStreak >= 75 },
  { id: 'streak_90', title: 'Quarter Year', description: 'Complete workouts for 90 days in a row', type: 'streak', requirement: 90, icon: '🌠', xpReward: 500, coinReward: 100, checkUnlock: (data) => data.currentStreak >= 90 },
  { id: 'streak_100', title: 'Century of Discipline', description: 'Complete workouts for 100 days in a row', type: 'streak', requirement: 100, icon: '💎', xpReward: 600, coinReward: 120, checkUnlock: (data) => data.currentStreak >= 100 },
  { id: 'streak_120', title: 'Four Month Titan', description: 'Complete workouts for 120 days in a row', type: 'streak', requirement: 120, icon: '🔱', xpReward: 650, coinReward: 130, checkUnlock: (data) => data.currentStreak >= 120 },
  { id: 'streak_150', title: 'Five Month Legend', description: 'Complete workouts for 150 days in a row', type: 'streak', requirement: 150, icon: '🏅', xpReward: 700, coinReward: 140, checkUnlock: (data) => data.currentStreak >= 150 },
  { id: 'streak_180', title: 'Half Year Hero', description: 'Complete workouts for 180 days in a row', type: 'streak', requirement: 180, icon: '🎖️', xpReward: 800, coinReward: 160, checkUnlock: (data) => data.currentStreak >= 180 },
  { id: 'streak_200', title: 'Double Century', description: 'Complete workouts for 200 days in a row', type: 'streak', requirement: 200, icon: '💫', xpReward: 850, coinReward: 170, checkUnlock: (data) => data.currentStreak >= 200 },
  { id: 'streak_250', title: 'Elite Performer', description: 'Complete workouts for 250 days in a row', type: 'streak', requirement: 250, icon: '🌌', xpReward: 900, coinReward: 180, checkUnlock: (data) => data.currentStreak >= 250 },
  { id: 'streak_300', title: 'Ten Month Warrior', description: 'Complete workouts for 300 days in a row', type: 'streak', requirement: 300, icon: '🎆', xpReward: 1000, coinReward: 200, checkUnlock: (data) => data.currentStreak >= 300 },
  { id: 'streak_365', title: 'Year of Excellence', description: 'Complete workouts for 365 days in a row', type: 'streak', requirement: 365, icon: '🏵️', xpReward: 1500, coinReward: 300, checkUnlock: (data) => data.currentStreak >= 365 },
  { id: 'streak_400', title: 'Immortal Dedication', description: 'Complete workouts for 400 days in a row', type: 'streak', requirement: 400, icon: '👼', xpReward: 1600, coinReward: 320, checkUnlock: (data) => data.currentStreak >= 400 },
  { id: 'streak_500', title: 'Five Hundred Strong', description: 'Complete workouts for 500 days in a row', type: 'streak', requirement: 500, icon: '🌟', xpReward: 2000, coinReward: 400, checkUnlock: (data) => data.currentStreak >= 500 },
  { id: 'streak_600', title: 'Six Hundred Soldier', description: 'Complete workouts for 600 days in a row', type: 'streak', requirement: 600, icon: '🔰', xpReward: 2500, coinReward: 500, checkUnlock: (data) => data.currentStreak >= 600 },
  { id: 'streak_700', title: 'Seven Hundred Sentinel', description: 'Complete workouts for 700 days in a row', type: 'streak', requirement: 700, icon: '🛡️', xpReward: 3000, coinReward: 600, checkUnlock: (data) => data.currentStreak >= 700 },
  { id: 'streak_730', title: 'Two Year Titan', description: 'Complete workouts for 730 days in a row', type: 'streak', requirement: 730, icon: '🗿', xpReward: 3500, coinReward: 700, checkUnlock: (data) => data.currentStreak >= 730 },
  { id: 'streak_800', title: 'Eight Hundred Elite', description: 'Complete workouts for 800 days in a row', type: 'streak', requirement: 800, icon: '🎇', xpReward: 4000, coinReward: 800, checkUnlock: (data) => data.currentStreak >= 800 },
  { id: 'streak_900', title: 'Nine Hundred Magnificent', description: 'Complete workouts for 900 days in a row', type: 'streak', requirement: 900, icon: '🌅', xpReward: 4500, coinReward: 900, checkUnlock: (data) => data.currentStreak >= 900 },
  { id: 'streak_1000', title: 'Thousand Day Warrior', description: 'Complete workouts for 1000 days in a row', type: 'streak', requirement: 1000, icon: '🔥', xpReward: 5000, coinReward: 1000, checkUnlock: (data) => data.currentStreak >= 1000 },
  { id: 'streak_1095', title: 'Three Year Legend', description: 'Complete workouts for 1095 days in a row', type: 'streak', requirement: 1095, icon: '🎊', xpReward: 6000, coinReward: 1200, checkUnlock: (data) => data.currentStreak >= 1095 },
  { id: 'streak_1200', title: 'Beyond Mortal', description: 'Complete workouts for 1200 days in a row', type: 'streak', requirement: 1200, icon: '✨', xpReward: 7000, coinReward: 1400, checkUnlock: (data) => data.currentStreak >= 1200 },
  { id: 'streak_1500', title: 'Legendary Status', description: 'Complete workouts for 1500 days in a row', type: 'streak', requirement: 1500, icon: '🌈', xpReward: 8000, coinReward: 1600, checkUnlock: (data) => data.currentStreak >= 1500 },
  { id: 'streak_1825', title: 'Five Year Immortal', description: 'Complete workouts for 1825 days in a row', type: 'streak', requirement: 1825, icon: '🌄', xpReward: 10000, coinReward: 2000, checkUnlock: (data) => data.currentStreak >= 1825 },
  { id: 'streak_2000', title: 'Mythical Being', description: 'Complete workouts for 2000 days in a row', type: 'streak', requirement: 2000, icon: '🦄', xpReward: 15000, coinReward: 3000, checkUnlock: (data) => data.currentStreak >= 2000 },

  // VOLUME ACHIEVEMENTS (50 total)
  { id: 'volume_100', title: 'First Hundred', description: 'Complete 100 total push-ups', type: 'volume', requirement: 100, icon: '📍', xpReward: 25, coinReward: 5, checkUnlock: (data) => data.totalLifetimePushups >= 100 },
  { id: 'volume_250', title: 'Quarter Thousand', description: 'Complete 250 total push-ups', type: 'volume', requirement: 250, icon: '📌', xpReward: 35, coinReward: 7, checkUnlock: (data) => data.totalLifetimePushups >= 250 },
  { id: 'volume_500', title: 'Half Thousand', description: 'Complete 500 total push-ups', type: 'volume', requirement: 500, icon: '📎', xpReward: 50, coinReward: 10, checkUnlock: (data) => data.totalLifetimePushups >= 500 },
  { id: 'volume_1000', title: 'First Thousand', description: 'Complete 1,000 total push-ups', type: 'volume', requirement: 1000, icon: '📊', xpReward: 75, coinReward: 15, checkUnlock: (data) => data.totalLifetimePushups >= 1000 },
  { id: 'volume_2500', title: 'Building Momentum', description: 'Complete 2,500 total push-ups', type: 'volume', requirement: 2500, icon: '📈', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.totalLifetimePushups >= 2500 },
  { id: 'volume_5000', title: 'Five Thousand Strong', description: 'Complete 5,000 total push-ups', type: 'volume', requirement: 5000, icon: '📉', xpReward: 150, coinReward: 30, checkUnlock: (data) => data.totalLifetimePushups >= 5000 },
  { id: 'volume_7500', title: 'Mid Tier', description: 'Complete 7,500 total push-ups', type: 'volume', requirement: 7500, icon: '📐', xpReward: 175, coinReward: 35, checkUnlock: (data) => data.totalLifetimePushups >= 7500 },
  { id: 'volume_10000', title: 'Ten Thousand Club', description: 'Complete 10,000 total push-ups', type: 'volume', requirement: 10000, icon: '🎖️', xpReward: 200, coinReward: 40, checkUnlock: (data) => data.totalLifetimePushups >= 10000 },
  { id: 'volume_15000', title: 'Fifteen K', description: 'Complete 15,000 total push-ups', type: 'volume', requirement: 15000, icon: '📏', xpReward: 250, coinReward: 50, checkUnlock: (data) => data.totalLifetimePushups >= 15000 },
  { id: 'volume_20000', title: 'Twenty Thousand', description: 'Complete 20,000 total push-ups', type: 'volume', requirement: 20000, icon: '📝', xpReward: 300, coinReward: 60, checkUnlock: (data) => data.totalLifetimePushups >= 20000 },
  { id: 'volume_25000', title: 'Quarter Hundred K', description: 'Complete 25,000 total push-ups', type: 'volume', requirement: 25000, icon: '📋', xpReward: 350, coinReward: 70, checkUnlock: (data) => data.totalLifetimePushups >= 25000 },
  { id: 'volume_30000', title: 'Thirty Thousand', description: 'Complete 30,000 total push-ups', type: 'volume', requirement: 30000, icon: '📓', xpReward: 400, coinReward: 80, checkUnlock: (data) => data.totalLifetimePushups >= 30000 },
  { id: 'volume_40000', title: 'Forty K Strong', description: 'Complete 40,000 total push-ups', type: 'volume', requirement: 40000, icon: '📔', xpReward: 450, coinReward: 90, checkUnlock: (data) => data.totalLifetimePushups >= 40000 },
  { id: 'volume_50000', title: 'Fifty Thousand Hero', description: 'Complete 50,000 total push-ups', type: 'volume', requirement: 50000, icon: '📕', xpReward: 500, coinReward: 100, checkUnlock: (data) => data.totalLifetimePushups >= 50000 },
  { id: 'volume_60000', title: 'Sixty K Warrior', description: 'Complete 60,000 total push-ups', type: 'volume', requirement: 60000, icon: '📗', xpReward: 550, coinReward: 110, checkUnlock: (data) => data.totalLifetimePushups >= 60000 },
  { id: 'volume_70000', title: 'Seventy Thousand', description: 'Complete 70,000 total push-ups', type: 'volume', requirement: 70000, icon: '📘', xpReward: 600, coinReward: 120, checkUnlock: (data) => data.totalLifetimePushups >= 70000 },
  { id: 'volume_75000', title: 'Three Quarter Mark', description: 'Complete 75,000 total push-ups', type: 'volume', requirement: 75000, icon: '📙', xpReward: 625, coinReward: 125, checkUnlock: (data) => data.totalLifetimePushups >= 75000 },
  { id: 'volume_80000', title: 'Eighty K Elite', description: 'Complete 80,000 total push-ups', type: 'volume', requirement: 80000, icon: '📚', xpReward: 650, coinReward: 130, checkUnlock: (data) => data.totalLifetimePushups >= 80000 },
  { id: 'volume_90000', title: 'Ninety Thousand', description: 'Complete 90,000 total push-ups', type: 'volume', requirement: 90000, icon: '📖', xpReward: 700, coinReward: 140, checkUnlock: (data) => data.totalLifetimePushups >= 90000 },
  { id: 'volume_100000', title: 'Hundred Thousand Legend', description: 'Complete 100,000 total push-ups', type: 'volume', requirement: 100000, icon: '🎯', xpReward: 1000, coinReward: 200, checkUnlock: (data) => data.totalLifetimePushups >= 100000 },
  { id: 'volume_125000', title: 'One Twenty Five K', description: 'Complete 125,000 total push-ups', type: 'volume', requirement: 125000, icon: '🎪', xpReward: 1100, coinReward: 220, checkUnlock: (data) => data.totalLifetimePushups >= 125000 },
  { id: 'volume_150000', title: 'One Fifty K', description: 'Complete 150,000 total push-ups', type: 'volume', requirement: 150000, icon: '🎭', xpReward: 1200, coinReward: 240, checkUnlock: (data) => data.totalLifetimePushups >= 150000 },
  { id: 'volume_175000', title: 'One Seventy Five K', description: 'Complete 175,000 total push-ups', type: 'volume', requirement: 175000, icon: '🎨', xpReward: 1300, coinReward: 260, checkUnlock: (data) => data.totalLifetimePushups >= 175000 },
  { id: 'volume_200000', title: 'Two Hundred Thousand', description: 'Complete 200,000 total push-ups', type: 'volume', requirement: 200000, icon: '🎬', xpReward: 1500, coinReward: 300, checkUnlock: (data) => data.totalLifetimePushups >= 200000 },
  { id: 'volume_250000', title: 'Quarter Million', description: 'Complete 250,000 total push-ups', type: 'volume', requirement: 250000, icon: '🎤', xpReward: 1750, coinReward: 350, checkUnlock: (data) => data.totalLifetimePushups >= 250000 },
  { id: 'volume_300000', title: 'Three Hundred K', description: 'Complete 300,000 total push-ups', type: 'volume', requirement: 300000, icon: '🎧', xpReward: 2000, coinReward: 400, checkUnlock: (data) => data.totalLifetimePushups >= 300000 },
  { id: 'volume_350000', title: 'Three Fifty K', description: 'Complete 350,000 total push-ups', type: 'volume', requirement: 350000, icon: '🎼', xpReward: 2250, coinReward: 450, checkUnlock: (data) => data.totalLifetimePushups >= 350000 },
  { id: 'volume_400000', title: 'Four Hundred Thousand', description: 'Complete 400,000 total push-ups', type: 'volume', requirement: 400000, icon: '🎹', xpReward: 2500, coinReward: 500, checkUnlock: (data) => data.totalLifetimePushups >= 400000 },
  { id: 'volume_450000', title: 'Four Fifty K', description: 'Complete 450,000 total push-ups', type: 'volume', requirement: 450000, icon: '🎺', xpReward: 2750, coinReward: 550, checkUnlock: (data) => data.totalLifetimePushups >= 450000 },
  { id: 'volume_500000', title: 'Half Million Titan', description: 'Complete 500,000 total push-ups', type: 'volume', requirement: 500000, icon: '🎻', xpReward: 3000, coinReward: 600, checkUnlock: (data) => data.totalLifetimePushups >= 500000 },
  { id: 'volume_600000', title: 'Six Hundred K', description: 'Complete 600,000 total push-ups', type: 'volume', requirement: 600000, icon: '🥁', xpReward: 3500, coinReward: 700, checkUnlock: (data) => data.totalLifetimePushups >= 600000 },
  { id: 'volume_700000', title: 'Seven Hundred K', description: 'Complete 700,000 total push-ups', type: 'volume', requirement: 700000, icon: '🎷', xpReward: 4000, coinReward: 800, checkUnlock: (data) => data.totalLifetimePushups >= 700000 },
  { id: 'volume_750000', title: 'Three Quarter Million', description: 'Complete 750,000 total push-ups', type: 'volume', requirement: 750000, icon: '🎸', xpReward: 4250, coinReward: 850, checkUnlock: (data) => data.totalLifetimePushups >= 750000 },
  { id: 'volume_800000', title: 'Eight Hundred K', description: 'Complete 800,000 total push-ups', type: 'volume', requirement: 800000, icon: '🪕', xpReward: 4500, coinReward: 900, checkUnlock: (data) => data.totalLifetimePushups >= 800000 },
  { id: 'volume_900000', title: 'Nine Hundred K', description: 'Complete 900,000 total push-ups', type: 'volume', requirement: 900000, icon: '🪗', xpReward: 5000, coinReward: 1000, checkUnlock: (data) => data.totalLifetimePushups >= 900000 },
  { id: 'volume_1000000', title: 'Million Push-Up Legend', description: 'Complete 1,000,000 total push-ups', type: 'volume', requirement: 1000000, icon: '👑', xpReward: 10000, coinReward: 2000, checkUnlock: (data) => data.totalLifetimePushups >= 1000000 },
  { id: 'volume_1250000', title: 'One Point Two Five M', description: 'Complete 1,250,000 total push-ups', type: 'volume', requirement: 1250000, icon: '🔱', xpReward: 12000, coinReward: 2400, checkUnlock: (data) => data.totalLifetimePushups >= 1250000 },
  { id: 'volume_1500000', title: 'One Point Five Million', description: 'Complete 1,500,000 total push-ups', type: 'volume', requirement: 1500000, icon: '⚜️', xpReward: 14000, coinReward: 2800, checkUnlock: (data) => data.totalLifetimePushups >= 1500000 },
  { id: 'volume_1750000', title: 'One Point Seven Five M', description: 'Complete 1,750,000 total push-ups', type: 'volume', requirement: 1750000, icon: '🏛️', xpReward: 16000, coinReward: 3200, checkUnlock: (data) => data.totalLifetimePushups >= 1750000 },
  { id: 'volume_2000000', title: 'Two Million Master', description: 'Complete 2,000,000 total push-ups', type: 'volume', requirement: 2000000, icon: '🗼', xpReward: 20000, coinReward: 4000, checkUnlock: (data) => data.totalLifetimePushups >= 2000000 },
  { id: 'volume_2500000', title: 'Two Point Five Million', description: 'Complete 2,500,000 total push-ups', type: 'volume', requirement: 2500000, icon: '🗽', xpReward: 25000, coinReward: 5000, checkUnlock: (data) => data.totalLifetimePushups >= 2500000 },
  { id: 'volume_3000000', title: 'Three Million Immortal', description: 'Complete 3,000,000 total push-ups', type: 'volume', requirement: 3000000, icon: '🕌', xpReward: 30000, coinReward: 6000, checkUnlock: (data) => data.totalLifetimePushups >= 3000000 },
  { id: 'volume_4000000', title: 'Four Million Deity', description: 'Complete 4,000,000 total push-ups', type: 'volume', requirement: 4000000, icon: '⛩️', xpReward: 40000, coinReward: 8000, checkUnlock: (data) => data.totalLifetimePushups >= 4000000 },
  { id: 'volume_5000000', title: 'Five Million God', description: 'Complete 5,000,000 total push-ups', type: 'volume', requirement: 5000000, icon: '🛕', xpReward: 50000, coinReward: 10000, checkUnlock: (data) => data.totalLifetimePushups >= 5000000 },
  { id: 'volume_7500000', title: 'Seven Point Five M', description: 'Complete 7,500,000 total push-ups', type: 'volume', requirement: 7500000, icon: '🕋', xpReward: 75000, coinReward: 15000, checkUnlock: (data) => data.totalLifetimePushups >= 7500000 },
  { id: 'volume_10000000', title: 'Ten Million Mythic', description: 'Complete 10,000,000 total push-ups', type: 'volume', requirement: 10000000, icon: '⛪', xpReward: 100000, coinReward: 20000, checkUnlock: (data) => data.totalLifetimePushups >= 10000000 },
  { id: 'volume_15000000', title: 'Fifteen Million Supreme', description: 'Complete 15,000,000 total push-ups', type: 'volume', requirement: 15000000, icon: '🏰', xpReward: 150000, coinReward: 30000, checkUnlock: (data) => data.totalLifetimePushups >= 15000000 },
  { id: 'volume_20000000', title: 'Twenty Million Cosmic', description: 'Complete 20,000,000 total push-ups', type: 'volume', requirement: 20000000, icon: '🏯', xpReward: 200000, coinReward: 40000, checkUnlock: (data) => data.totalLifetimePushups >= 20000000 },
  { id: 'volume_25000000', title: 'Quarter Billion', description: 'Complete 25,000,000 total push-ups', type: 'volume', requirement: 25000000, icon: '🏟️', xpReward: 250000, coinReward: 50000, checkUnlock: (data) => data.totalLifetimePushups >= 25000000 },
  { id: 'volume_50000000', title: 'Fifty Million Transcendent', description: 'Complete 50,000,000 total push-ups', type: 'volume', requirement: 50000000, icon: '🎡', xpReward: 500000, coinReward: 100000, checkUnlock: (data) => data.totalLifetimePushups >= 50000000 },

  // CONSISTENCY ACHIEVEMENTS (30 total)
  { id: 'consistency_5', title: 'Goal Getter', description: 'Meet your daily goal 5 times', type: 'consistency', requirement: 5, icon: '🎯', xpReward: 50, coinReward: 10, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 5 },
  { id: 'consistency_10', title: 'On Target', description: 'Meet your daily goal 10 times', type: 'consistency', requirement: 10, icon: '🏹', xpReward: 75, coinReward: 15, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 10 },
  { id: 'consistency_25', title: 'Quarter Century', description: 'Meet your daily goal 25 times', type: 'consistency', requirement: 25, icon: '🎲', xpReward: 100, coinReward: 20, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 25 },
  { id: 'consistency_50', title: 'Fifty Goals', description: 'Meet your daily goal 50 times', type: 'consistency', requirement: 50, icon: '🎰', xpReward: 150, coinReward: 30, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 50 },
  { id: 'consistency_75', title: 'Seventy Five Goals', description: 'Meet your daily goal 75 times', type: 'consistency', requirement: 75, icon: '🎳', xpReward: 175, coinReward: 35, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 75 },
  { id: 'consistency_100', title: 'Century of Goals', description: 'Meet your daily goal 100 times', type: 'consistency', requirement: 100, icon: '🎱', xpReward: 200, coinReward: 40, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 100 },
  { id: 'consistency_150', title: 'One Fifty Goals', description: 'Meet your daily goal 150 times', type: 'consistency', requirement: 150, icon: '🎮', xpReward: 250, coinReward: 50, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 150 },
  { id: 'consistency_200', title: 'Two Hundred Goals', description: 'Meet your daily goal 200 times', type: 'consistency', requirement: 200, icon: '🕹️', xpReward: 300, coinReward: 60, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 200 },
  { id: 'consistency_250', title: 'Quarter Thousand Goals', description: 'Meet your daily goal 250 times', type: 'consistency', requirement: 250, icon: '🎯', xpReward: 350, coinReward: 70, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 250 },
  { id: 'consistency_300', title: 'Three Hundred Goals', description: 'Meet your daily goal 300 times', type: 'consistency', requirement: 300, icon: '🎪', xpReward: 400, coinReward: 80, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 300 },
  { id: 'consistency_365', title: 'Year of Goals', description: 'Meet your daily goal 365 times', type: 'consistency', requirement: 365, icon: '🎭', xpReward: 500, coinReward: 100, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 365 },
  { id: 'consistency_400', title: 'Four Hundred Goals', description: 'Meet your daily goal 400 times', type: 'consistency', requirement: 400, icon: '🎨', xpReward: 550, coinReward: 110, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 400 },
  { id: 'consistency_500', title: 'Five Hundred Goals', description: 'Meet your daily goal 500 times', type: 'consistency', requirement: 500, icon: '🎬', xpReward: 600, coinReward: 120, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 500 },
  { id: 'consistency_600', title: 'Six Hundred Goals', description: 'Meet your daily goal 600 times', type: 'consistency', requirement: 600, icon: '🎤', xpReward: 700, coinReward: 140, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 600 },
  { id: 'consistency_730', title: 'Two Year Goals', description: 'Meet your daily goal 730 times', type: 'consistency', requirement: 730, icon: '🎧', xpReward: 800, coinReward: 160, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 730 },
  { id: 'consistency_750', title: 'Seven Fifty Goals', description: 'Meet your daily goal 750 times', type: 'consistency', requirement: 750, icon: '🎼', xpReward: 850, coinReward: 170, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 750 },
  { id: 'consistency_800', title: 'Eight Hundred Goals', description: 'Meet your daily goal 800 times', type: 'consistency', requirement: 800, icon: '🎹', xpReward: 900, coinReward: 180, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 800 },
  { id: 'consistency_900', title: 'Nine Hundred Goals', description: 'Meet your daily goal 900 times', type: 'consistency', requirement: 900, icon: '🎺', xpReward: 1000, coinReward: 200, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 900 },
  { id: 'consistency_1000', title: 'Thousand Goals', description: 'Meet your daily goal 1000 times', type: 'consistency', requirement: 1000, icon: '🎻', xpReward: 1500, coinReward: 300, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 1000 },
  { id: 'consistency_1095', title: 'Three Year Goals', description: 'Meet your daily goal 1095 times', type: 'consistency', requirement: 1095, icon: '🥁', xpReward: 1600, coinReward: 320, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 1095 },
  { id: 'consistency_1200', title: 'Twelve Hundred Goals', description: 'Meet your daily goal 1200 times', type: 'consistency', requirement: 1200, icon: '🎷', xpReward: 1700, coinReward: 340, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 1200 },
  { id: 'consistency_1500', title: 'Fifteen Hundred Goals', description: 'Meet your daily goal 1500 times', type: 'consistency', requirement: 1500, icon: '🎸', xpReward: 2000, coinReward: 400, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 1500 },
  { id: 'consistency_1825', title: 'Five Year Goals', description: 'Meet your daily goal 1825 times', type: 'consistency', requirement: 1825, icon: '🪕', xpReward: 2500, coinReward: 500, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 1825 },
  { id: 'consistency_2000', title: 'Two Thousand Goals', description: 'Meet your daily goal 2000 times', type: 'consistency', requirement: 2000, icon: '🪗', xpReward: 3000, coinReward: 600, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 2000 },
  { id: 'consistency_2500', title: 'Twenty Five Hundred Goals', description: 'Meet your daily goal 2500 times', type: 'consistency', requirement: 2500, icon: '🎵', xpReward: 3500, coinReward: 700, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 2500 },
  { id: 'consistency_3000', title: 'Three Thousand Goals', description: 'Meet your daily goal 3000 times', type: 'consistency', requirement: 3000, icon: '🎶', xpReward: 4000, coinReward: 800, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 3000 },
  { id: 'consistency_3650', title: 'Ten Year Goals', description: 'Meet your daily goal 3650 times', type: 'consistency', requirement: 3650, icon: '🎙️', xpReward: 5000, coinReward: 1000, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 3650 },
  { id: 'consistency_4000', title: 'Four Thousand Goals', description: 'Meet your daily goal 4000 times', type: 'consistency', requirement: 4000, icon: '📻', xpReward: 6000, coinReward: 1200, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 4000 },
  { id: 'consistency_5000', title: 'Five Thousand Goals', description: 'Meet your daily goal 5000 times', type: 'consistency', requirement: 5000, icon: '📺', xpReward: 8000, coinReward: 1600, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 5000 },
  { id: 'consistency_10000', title: 'Ten Thousand Goals', description: 'Meet your daily goal 10000 times', type: 'consistency', requirement: 10000, icon: '📡', xpReward: 15000, coinReward: 3000, checkUnlock: (data) => (data.totalGoalsCompleted || 0) >= 10000 },

  // VARIETY ACHIEVEMENTS (40 total - 5 per push-up type)
  // Standard
  { id: 'variety_standard_100', title: 'Standard Starter', description: 'Complete 100 standard push-ups', type: 'variety', requirement: 100, icon: '💪', xpReward: 30, coinReward: 6, checkUnlock: (data) => data.variationStats.standard >= 100 },
  { id: 'variety_standard_500', title: 'Standard Five Hundred', description: 'Complete 500 standard push-ups', type: 'variety', requirement: 500, icon: '🦾', xpReward: 50, coinReward: 10, checkUnlock: (data) => data.variationStats.standard >= 500 },
  { id: 'variety_standard_1000', title: 'Standard Thousand', description: 'Complete 1,000 standard push-ups', type: 'variety', requirement: 1000, icon: '💯', xpReward: 75, coinReward: 15, checkUnlock: (data) => data.variationStats.standard >= 1000 },
  { id: 'variety_standard_5000', title: 'Standard Five K', description: 'Complete 5,000 standard push-ups', type: 'variety', requirement: 5000, icon: '🏋️', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.variationStats.standard >= 5000 },
  { id: 'variety_standard_10000', title: 'Standard Ten K Master', description: 'Complete 10,000 standard push-ups', type: 'variety', requirement: 10000, icon: '🤸', xpReward: 150, coinReward: 30, checkUnlock: (data) => data.variationStats.standard >= 10000 },

  // Wide
  { id: 'variety_wide_100', title: 'Wide Hands', description: 'Complete 100 wide push-ups', type: 'variety', requirement: 100, icon: '🙌', xpReward: 35, coinReward: 7, checkUnlock: (data) => data.variationStats.wide >= 100 },
  { id: 'variety_wide_500', title: 'Wide Five Hundred', description: 'Complete 500 wide push-ups', type: 'variety', requirement: 500, icon: '👐', xpReward: 55, coinReward: 11, checkUnlock: (data) => data.variationStats.wide >= 500 },
  { id: 'variety_wide_1000', title: 'Wide Thousand', description: 'Complete 1,000 wide push-ups', type: 'variety', requirement: 1000, icon: '🖐️', xpReward: 80, coinReward: 16, checkUnlock: (data) => data.variationStats.wide >= 1000 },
  { id: 'variety_wide_5000', title: 'Wide Five K', description: 'Complete 5,000 wide push-ups', type: 'variety', requirement: 5000, icon: '✋', xpReward: 110, coinReward: 22, checkUnlock: (data) => data.variationStats.wide >= 5000 },
  { id: 'variety_wide_10000', title: 'Wide Ten K Elite', description: 'Complete 10,000 wide push-ups', type: 'variety', requirement: 10000, icon: '🤲', xpReward: 160, coinReward: 32, checkUnlock: (data) => data.variationStats.wide >= 10000 },

  // Diamond
  { id: 'variety_diamond_100', title: 'Diamond Hands', description: 'Complete 100 diamond push-ups', type: 'variety', requirement: 100, icon: '💎', xpReward: 40, coinReward: 8, checkUnlock: (data) => data.variationStats.diamond >= 100 },
  { id: 'variety_diamond_500', title: 'Diamond Five Hundred', description: 'Complete 500 diamond push-ups', type: 'variety', requirement: 500, icon: '💠', xpReward: 60, coinReward: 12, checkUnlock: (data) => data.variationStats.diamond >= 500 },
  { id: 'variety_diamond_1000', title: 'Diamond Thousand', description: 'Complete 1,000 diamond push-ups', type: 'variety', requirement: 1000, icon: '🔷', xpReward: 85, coinReward: 17, checkUnlock: (data) => data.variationStats.diamond >= 1000 },
  { id: 'variety_diamond_5000', title: 'Diamond Five K', description: 'Complete 5,000 diamond push-ups', type: 'variety', requirement: 5000, icon: '🔶', xpReward: 120, coinReward: 24, checkUnlock: (data) => data.variationStats.diamond >= 5000 },
  { id: 'variety_diamond_10000', title: 'Diamond Ten K Legend', description: 'Complete 10,000 diamond push-ups', type: 'variety', requirement: 10000, icon: '💍', xpReward: 170, coinReward: 34, checkUnlock: (data) => data.variationStats.diamond >= 10000 },

  // Decline
  { id: 'variety_decline_100', title: 'Decline Beginner', description: 'Complete 100 decline push-ups', type: 'variety', requirement: 100, icon: '📐', xpReward: 35, coinReward: 7, checkUnlock: (data) => data.variationStats.decline >= 100 },
  { id: 'variety_decline_500', title: 'Decline Five Hundred', description: 'Complete 500 decline push-ups', type: 'variety', requirement: 500, icon: '📏', xpReward: 55, coinReward: 11, checkUnlock: (data) => data.variationStats.decline >= 500 },
  { id: 'variety_decline_1000', title: 'Decline Thousand', description: 'Complete 1,000 decline push-ups', type: 'variety', requirement: 1000, icon: '📊', xpReward: 80, coinReward: 16, checkUnlock: (data) => data.variationStats.decline >= 1000 },
  { id: 'variety_decline_5000', title: 'Decline Five K', description: 'Complete 5,000 decline push-ups', type: 'variety', requirement: 5000, icon: '📈', xpReward: 110, coinReward: 22, checkUnlock: (data) => data.variationStats.decline >= 5000 },
  { id: 'variety_decline_10000', title: 'Decline Ten K Pro', description: 'Complete 10,000 decline push-ups', type: 'variety', requirement: 10000, icon: '📉', xpReward: 160, coinReward: 32, checkUnlock: (data) => data.variationStats.decline >= 10000 },

  // Archer
  { id: 'variety_archer_100', title: 'Archer Initiate', description: 'Complete 100 archer push-ups', type: 'variety', requirement: 100, icon: '🏹', xpReward: 45, coinReward: 9, checkUnlock: (data) => data.variationStats.archer >= 100 },
  { id: 'variety_archer_500', title: 'Archer Five Hundred', description: 'Complete 500 archer push-ups', type: 'variety', requirement: 500, icon: '🎯', xpReward: 70, coinReward: 14, checkUnlock: (data) => data.variationStats.archer >= 500 },
  { id: 'variety_archer_1000', title: 'Archer Thousand', description: 'Complete 1,000 archer push-ups', type: 'variety', requirement: 1000, icon: '🎪', xpReward: 95, coinReward: 19, checkUnlock: (data) => data.variationStats.archer >= 1000 },
  { id: 'variety_archer_5000', title: 'Archer Five K', description: 'Complete 5,000 archer push-ups', type: 'variety', requirement: 5000, icon: '🎭', xpReward: 130, coinReward: 26, checkUnlock: (data) => data.variationStats.archer >= 5000 },
  { id: 'variety_archer_10000', title: 'Archer Ten K Master', description: 'Complete 10,000 archer push-ups', type: 'variety', requirement: 10000, icon: '🎨', xpReward: 180, coinReward: 36, checkUnlock: (data) => data.variationStats.archer >= 10000 },

  // Pike
  { id: 'variety_pike_100', title: 'Pike Position', description: 'Complete 100 pike push-ups', type: 'variety', requirement: 100, icon: '🔺', xpReward: 40, coinReward: 8, checkUnlock: (data) => data.variationStats.pike >= 100 },
  { id: 'variety_pike_500', title: 'Pike Five Hundred', description: 'Complete 500 pike push-ups', type: 'variety', requirement: 500, icon: '🔻', xpReward: 65, coinReward: 13, checkUnlock: (data) => data.variationStats.pike >= 500 },
  { id: 'variety_pike_1000', title: 'Pike Thousand', description: 'Complete 1,000 pike push-ups', type: 'variety', requirement: 1000, icon: '⏫', xpReward: 90, coinReward: 18, checkUnlock: (data) => data.variationStats.pike >= 1000 },
  { id: 'variety_pike_5000', title: 'Pike Five K', description: 'Complete 5,000 pike push-ups', type: 'variety', requirement: 5000, icon: '⏬', xpReward: 125, coinReward: 25, checkUnlock: (data) => data.variationStats.pike >= 5000 },
  { id: 'variety_pike_10000', title: 'Pike Ten K Expert', description: 'Complete 10,000 pike push-ups', type: 'variety', requirement: 10000, icon: '🔼', xpReward: 175, coinReward: 35, checkUnlock: (data) => data.variationStats.pike >= 10000 },

  // Explosive
  { id: 'variety_explosive_100', title: 'Explosive Entry', description: 'Complete 100 explosive push-ups', type: 'variety', requirement: 100, icon: '💥', xpReward: 50, coinReward: 10, checkUnlock: (data) => data.variationStats.explosive >= 100 },
  { id: 'variety_explosive_500', title: 'Explosive Five Hundred', description: 'Complete 500 explosive push-ups', type: 'variety', requirement: 500, icon: '💢', xpReward: 75, coinReward: 15, checkUnlock: (data) => data.variationStats.explosive >= 500 },
  { id: 'variety_explosive_1000', title: 'Explosive Thousand', description: 'Complete 1,000 explosive push-ups', type: 'variety', requirement: 1000, icon: '💫', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.variationStats.explosive >= 1000 },
  { id: 'variety_explosive_5000', title: 'Explosive Five K', description: 'Complete 5,000 explosive push-ups', type: 'variety', requirement: 5000, icon: '✨', xpReward: 140, coinReward: 28, checkUnlock: (data) => data.variationStats.explosive >= 5000 },
  { id: 'variety_explosive_10000', title: 'Explosive Ten K Dynamo', description: 'Complete 10,000 explosive push-ups', type: 'variety', requirement: 10000, icon: '⚡', xpReward: 190, coinReward: 38, checkUnlock: (data) => data.variationStats.explosive >= 10000 },

  // Handstand
  { id: 'variety_handstand_50', title: 'Handstand Hero', description: 'Complete 50 handstand push-ups', type: 'variety', requirement: 50, icon: '🤸', xpReward: 60, coinReward: 12, checkUnlock: (data) => data.variationStats.handstand >= 50 },
  { id: 'variety_handstand_100', title: 'Handstand Hundred', description: 'Complete 100 handstand push-ups', type: 'variety', requirement: 100, icon: '🤹', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.variationStats.handstand >= 100 },
  { id: 'variety_handstand_250', title: 'Handstand Two Fifty', description: 'Complete 250 handstand push-ups', type: 'variety', requirement: 250, icon: '🎪', xpReward: 150, coinReward: 30, checkUnlock: (data) => data.variationStats.handstand >= 250 },
  { id: 'variety_handstand_500', title: 'Handstand Five Hundred', description: 'Complete 500 handstand push-ups', type: 'variety', requirement: 500, icon: '🎭', xpReward: 200, coinReward: 40, checkUnlock: (data) => data.variationStats.handstand >= 500 },
  { id: 'variety_handstand_1000', title: 'Handstand Thousand Elite', description: 'Complete 1,000 handstand push-ups', type: 'variety', requirement: 1000, icon: '🎨', xpReward: 300, coinReward: 60, checkUnlock: (data) => data.variationStats.handstand >= 1000 },

  // COMEBACK ACHIEVEMENTS (20 total)
  { id: 'comeback_restart', title: 'Phoenix Rising', description: 'Rebuild a 7 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 7', icon: '🔥', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.currentStreak >= 7 && data.longestStreak >= 14 },
  { id: 'comeback_restart_14', title: 'Second Chance Champion', description: 'Rebuild a 14 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 14', icon: '🌅', xpReward: 200, coinReward: 40, checkUnlock: (data) => data.currentStreak >= 14 && data.longestStreak >= 28 },
  { id: 'comeback_restart_30', title: 'Resilience King', description: 'Rebuild a 30 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 30', icon: '🌄', xpReward: 300, coinReward: 60, checkUnlock: (data) => data.currentStreak >= 30 && data.longestStreak >= 60 },
  { id: 'comeback_restart_60', title: 'Comeback Legend', description: 'Rebuild a 60 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 60', icon: '🌇', xpReward: 400, coinReward: 80, checkUnlock: (data) => data.currentStreak >= 60 && data.longestStreak >= 120 },
  { id: 'comeback_restart_100', title: 'Never Give Up', description: 'Rebuild a 100 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 100', icon: '🌆', xpReward: 600, coinReward: 120, checkUnlock: (data) => data.currentStreak >= 100 && data.longestStreak >= 200 },
  { id: 'comeback_restart_180', title: 'Half Year Return', description: 'Rebuild a 180 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 180', icon: '🌃', xpReward: 800, coinReward: 160, checkUnlock: (data) => data.currentStreak >= 180 && data.longestStreak >= 360 },
  { id: 'comeback_restart_365', title: 'One Year Comeback', description: 'Rebuild a 365 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 365', icon: '🌉', xpReward: 1500, coinReward: 300, checkUnlock: (data) => data.currentStreak >= 365 && data.longestStreak >= 730 },
  { id: 'comeback_restart_500', title: 'Five Hundred Return', description: 'Rebuild a 500 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 500', icon: '🌁', xpReward: 2000, coinReward: 400, checkUnlock: (data) => data.currentStreak >= 500 && data.longestStreak >= 1000 },
  { id: 'comeback_restart_730', title: 'Two Year Comeback', description: 'Rebuild a 730 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 730', icon: '🏙️', xpReward: 3000, coinReward: 600, checkUnlock: (data) => data.currentStreak >= 730 && data.longestStreak >= 1460 },
  { id: 'comeback_restart_1000', title: 'Thousand Day Return', description: 'Rebuild a 1000 day streak after breaking it', type: 'comeback', requirement: 'Rebuild 1000', icon: '🌠', xpReward: 5000, coinReward: 1000, checkUnlock: (data) => data.currentStreak >= 1000 && data.longestStreak >= 2000 },
  { id: 'comeback_multiple_7', title: 'Persistent Warrior', description: 'Reach 7 day streak 3 times', type: 'comeback', requirement: '3 times', icon: '🏃', xpReward: 150, coinReward: 30, checkUnlock: (data) => data.currentStreak >= 7 && data.longestStreak >= 21 },
  { id: 'comeback_multiple_14', title: 'Relentless Fighter', description: 'Reach 14 day streak 3 times', type: 'comeback', requirement: '3 times', icon: '🏃‍♂️', xpReward: 250, coinReward: 50, checkUnlock: (data) => data.currentStreak >= 14 && data.longestStreak >= 42 },
  { id: 'comeback_multiple_30', title: 'Unstoppable Force', description: 'Reach 30 day streak 3 times', type: 'comeback', requirement: '3 times', icon: '🏃‍♀️', xpReward: 400, coinReward: 80, checkUnlock: (data) => data.currentStreak >= 30 && data.longestStreak >= 90 },
  { id: 'comeback_multiple_60', title: 'Iron Will', description: 'Reach 60 day streak 3 times', type: 'comeback', requirement: '3 times', icon: '🚴', xpReward: 600, coinReward: 120, checkUnlock: (data) => data.currentStreak >= 60 && data.longestStreak >= 180 },
  { id: 'comeback_multiple_100', title: 'Titanium Spirit', description: 'Reach 100 day streak 3 times', type: 'comeback', requirement: '3 times', icon: '🚴‍♂️', xpReward: 900, coinReward: 180, checkUnlock: (data) => data.currentStreak >= 100 && data.longestStreak >= 300 },
  { id: 'comeback_multiple_180', title: 'Diamond Mind', description: 'Reach 180 day streak 2 times', type: 'comeback', requirement: '2 times', icon: '🚴‍♀️', xpReward: 1200, coinReward: 240, checkUnlock: (data) => data.currentStreak >= 180 && data.longestStreak >= 360 },
  { id: 'comeback_multiple_365', title: 'Adamantium Soul', description: 'Reach 365 day streak 2 times', type: 'comeback', requirement: '2 times', icon: '🏊', xpReward: 2000, coinReward: 400, checkUnlock: (data) => data.currentStreak >= 365 && data.longestStreak >= 730 },
  { id: 'comeback_multiple_500', title: 'Mythril Heart', description: 'Reach 500 day streak 2 times', type: 'comeback', requirement: '2 times', icon: '🏊‍♂️', xpReward: 3000, coinReward: 600, checkUnlock: (data) => data.currentStreak >= 500 && data.longestStreak >= 1000 },
  { id: 'comeback_multiple_730', title: 'Orichalcum Determination', description: 'Reach 730 day streak 2 times', type: 'comeback', requirement: '2 times', icon: '🏊‍♀️', xpReward: 4000, coinReward: 800, checkUnlock: (data) => data.currentStreak >= 730 && data.longestStreak >= 1460 },
  { id: 'comeback_multiple_1000', title: 'Vibranium Perseverance', description: 'Reach 1000 day streak 2 times', type: 'comeback', requirement: '2 times', icon: '🧗', xpReward: 6000, coinReward: 1200, checkUnlock: (data) => data.currentStreak >= 1000 && data.longestStreak >= 2000 },

  // SPECIAL ACHIEVEMENTS (80 total)
  { id: 'special_first_workout', title: 'First Step', description: 'Complete your very first workout', type: 'special', requirement: 1, icon: '🎉', xpReward: 20, coinReward: 5, checkUnlock: (data) => data.workouts.length >= 1 },
  { id: 'special_10_workouts', title: 'Ten Sessions', description: 'Complete 10 total workouts', type: 'special', requirement: 10, icon: '🎊', xpReward: 50, coinReward: 10, checkUnlock: (data) => data.workouts.length >= 10 },
  { id: 'special_25_workouts', title: 'Quarter Century Sessions', description: 'Complete 25 total workouts', type: 'special', requirement: 25, icon: '🎈', xpReward: 75, coinReward: 15, checkUnlock: (data) => data.workouts.length >= 25 },
  { id: 'special_50_workouts', title: 'Fifty Sessions', description: 'Complete 50 total workouts', type: 'special', requirement: 50, icon: '🎀', xpReward: 100, coinReward: 20, checkUnlock: (data) => data.workouts.length >= 50 },
  { id: 'special_100_workouts', title: 'Century Sessions', description: 'Complete 100 total workouts', type: 'special', requirement: 100, icon: '🎁', xpReward: 150, coinReward: 30, checkUnlock: (data) => data.workouts.length >= 100 },
  { id: 'special_250_workouts', title: 'Two Fifty Sessions', description: 'Complete 250 total workouts', type: 'special', requirement: 250, icon: '🎗️', xpReward: 250, coinReward: 50, checkUnlock: (data) => data.workouts.length >= 250 },
  { id: 'special_500_workouts', title: 'Five Hundred Sessions', description: 'Complete 500 total workouts', type: 'special', requirement: 500, icon: '🏵️', xpReward: 400, coinReward: 80, checkUnlock: (data) => data.workouts.length >= 500 },
  { id: 'special_750_workouts', title: 'Seven Fifty Sessions', description: 'Complete 750 total workouts', type: 'special', requirement: 750, icon: '🎖️', xpReward: 500, coinReward: 100, checkUnlock: (data) => data.workouts.length >= 750 },
  { id: 'special_1000_workouts', title: 'Thousand Sessions', description: 'Complete 1000 total workouts', type: 'special', requirement: 1000, icon: '🏆', xpReward: 800, coinReward: 160, checkUnlock: (data) => data.workouts.length >= 1000 },
  { id: 'special_1500_workouts', title: 'Fifteen Hundred Sessions', description: 'Complete 1500 total workouts', type: 'special', requirement: 1500, icon: '🥇', xpReward: 1000, coinReward: 200, checkUnlock: (data) => data.workouts.length >= 1500 },
  { id: 'special_2000_workouts', title: 'Two Thousand Sessions', description: 'Complete 2000 total workouts', type: 'special', requirement: 2000, icon: '🥈', xpReward: 1500, coinReward: 300, checkUnlock: (data) => data.workouts.length >= 2000 },
  { id: 'special_3000_workouts', title: 'Three Thousand Sessions', description: 'Complete 3000 total workouts', type: 'special', requirement: 3000, icon: '🥉', xpReward: 2000, coinReward: 400, checkUnlock: (data) => data.workouts.length >= 3000 },
  { id: 'special_5000_workouts', title: 'Five Thousand Sessions', description: 'Complete 5000 total workouts', type: 'special', requirement: 5000, icon: '🏅', xpReward: 3000, coinReward: 600, checkUnlock: (data) => data.workouts.length >= 5000 },
  { id: 'special_10000_workouts', title: 'Ten Thousand Sessions', description: 'Complete 10000 total workouts', type: 'special', requirement: 10000, icon: '🎗️', xpReward: 5000, coinReward: 1000, checkUnlock: (data) => data.workouts.length >= 10000 },
  { id: 'special_early_bird', title: 'Early Bird', description: 'Complete a workout before 6 AM', type: 'special', requirement: 'Before 6AM', icon: '🌅', xpReward: 50, coinReward: 10, checkUnlock: () => false },
  { id: 'special_night_owl', title: 'Night Owl', description: 'Complete a workout after 10 PM', type: 'special', requirement: 'After 10PM', icon: '🦉', xpReward: 50, coinReward: 10, checkUnlock: () => false },
  { id: 'special_weekend_warrior', title: 'Weekend Warrior', description: 'Complete 10 weekend workouts', type: 'special', requirement: '10 weekends', icon: '🏖️', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_monday_master', title: 'Monday Master', description: 'Complete 20 Monday workouts', type: 'special', requirement: '20 Mondays', icon: '📅', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_all_variations_day', title: 'Variety Master', description: 'Do all 8 push-up types in one day', type: 'special', requirement: 'All 8 types', icon: '🌈', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_double_goal', title: 'Overachiever', description: 'Complete double your daily goal in one session', type: 'special', requirement: '2x goal', icon: '⚡', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_triple_goal', title: 'Triple Threat', description: 'Complete triple your daily goal in one session', type: 'special', requirement: '3x goal', icon: '🔥', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_5x_goal', title: 'Quintupler', description: 'Complete 5x your daily goal in one session', type: 'special', requirement: '5x goal', icon: '💫', xpReward: 400, coinReward: 80, checkUnlock: () => false },
  { id: 'special_10x_goal', title: 'Decupler', description: 'Complete 10x your daily goal in one session', type: 'special', requirement: '10x goal', icon: '⭐', xpReward: 800, coinReward: 160, checkUnlock: () => false },
  { id: 'special_100_one_session', title: 'Century Session', description: 'Complete 100 push-ups in one session', type: 'special', requirement: 100, icon: '💯', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_200_one_session', title: 'Double Century Session', description: 'Complete 200 push-ups in one session', type: 'special', requirement: 200, icon: '🎯', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_300_one_session', title: 'Triple Century Session', description: 'Complete 300 push-ups in one session', type: 'special', requirement: 300, icon: '🎪', xpReward: 300, coinReward: 60, checkUnlock: () => false },
  { id: 'special_500_one_session', title: 'Five Hundred Session', description: 'Complete 500 push-ups in one session', type: 'special', requirement: 500, icon: '🎭', xpReward: 500, coinReward: 100, checkUnlock: () => false },
  { id: 'special_1000_one_session', title: 'Thousand Session Titan', description: 'Complete 1000 push-ups in one session', type: 'special', requirement: 1000, icon: '👑', xpReward: 1000, coinReward: 200, checkUnlock: () => false },
  { id: 'special_perfect_week', title: 'Perfect Week', description: 'Meet your goal every day for a week', type: 'special', requirement: '7 days', icon: '📆', xpReward: 150, coinReward: 30, checkUnlock: () => false },
  { id: 'special_perfect_month', title: 'Perfect Month', description: 'Meet your goal every day for 30 days', type: 'special', requirement: '30 days', icon: '📅', xpReward: 500, coinReward: 100, checkUnlock: () => false },
  { id: 'special_perfect_quarter', title: 'Perfect Quarter', description: 'Meet your goal every day for 90 days', type: 'special', requirement: '90 days', icon: '🗓️', xpReward: 1000, coinReward: 200, checkUnlock: () => false },
  { id: 'special_perfect_year', title: 'Perfect Year', description: 'Meet your goal every day for 365 days', type: 'special', requirement: '365 days', icon: '📆', xpReward: 5000, coinReward: 1000, checkUnlock: () => false },
  { id: 'special_speed_demon_10', title: 'Speedster 10', description: 'Complete 10 push-ups in under 10 seconds', type: 'special', requirement: '<10s', icon: '⏱️', xpReward: 50, coinReward: 10, checkUnlock: () => false },
  { id: 'special_speed_demon_25', title: 'Speedster 25', description: 'Complete 25 push-ups in under 25 seconds', type: 'special', requirement: '<25s', icon: '⏲️', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_speed_demon_50', title: 'Speedster 50', description: 'Complete 50 push-ups in under 50 seconds', type: 'special', requirement: '<50s', icon: '⏰', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_speed_demon_100', title: 'Speedster 100', description: 'Complete 100 push-ups in under 2 minutes', type: 'special', requirement: '<2min', icon: '⌚', xpReward: 400, coinReward: 80, checkUnlock: () => false },
  { id: 'special_endurance_50', title: 'Endurance 50', description: 'Complete 50 push-ups without rest', type: 'special', requirement: 'No rest', icon: '🏃', xpReward: 150, coinReward: 30, checkUnlock: () => false },
  { id: 'special_endurance_100', title: 'Endurance 100', description: 'Complete 100 push-ups without rest', type: 'special', requirement: 'No rest', icon: '🏃‍♂️', xpReward: 300, coinReward: 60, checkUnlock: () => false },
  { id: 'special_endurance_200', title: 'Endurance 200', description: 'Complete 200 push-ups without rest', type: 'special', requirement: 'No rest', icon: '🏃‍♀️', xpReward: 600, coinReward: 120, checkUnlock: () => false },
  { id: 'special_endurance_500', title: 'Endurance 500', description: 'Complete 500 push-ups without rest', type: 'special', requirement: 'No rest', icon: '🚴', xpReward: 1500, coinReward: 300, checkUnlock: () => false },
  { id: 'special_10_sets', title: 'Set Master', description: 'Complete 10 sets in one session', type: 'special', requirement: '10 sets', icon: '🔟', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_20_sets', title: 'Set Legend', description: 'Complete 20 sets in one session', type: 'special', requirement: '20 sets', icon: '2️⃣', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_30_sets', title: 'Set God', description: 'Complete 30 sets in one session', type: 'special', requirement: '30 sets', icon: '3️⃣', xpReward: 400, coinReward: 80, checkUnlock: () => false },
  { id: 'special_50_sets', title: 'Set Supreme', description: 'Complete 50 sets in one session', type: 'special', requirement: '50 sets', icon: '5️⃣', xpReward: 800, coinReward: 160, checkUnlock: () => false },
  { id: 'special_jan_complete', title: 'January Warrior', description: 'Complete every day in January', type: 'special', requirement: 'All January', icon: '❄️', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_feb_complete', title: 'February Champion', description: 'Complete every day in February', type: 'special', requirement: 'All February', icon: '💝', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_mar_complete', title: 'March Master', description: 'Complete every day in March', type: 'special', requirement: 'All March', icon: '🍀', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_apr_complete', title: 'April Ace', description: 'Complete every day in April', type: 'special', requirement: 'All April', icon: '🌸', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_may_complete', title: 'May Magnificent', description: 'Complete every day in May', type: 'special', requirement: 'All May', icon: '🌺', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_jun_complete', title: 'June Juggernaut', description: 'Complete every day in June', type: 'special', requirement: 'All June', icon: '☀️', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_jul_complete', title: 'July Hero', description: 'Complete every day in July', type: 'special', requirement: 'All July', icon: '🎆', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_aug_complete', title: 'August Champion', description: 'Complete every day in August', type: 'special', requirement: 'All August', icon: '🏖️', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_sep_complete', title: 'September Soldier', description: 'Complete every day in September', type: 'special', requirement: 'All September', icon: '🍂', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_oct_complete', title: 'October Legend', description: 'Complete every day in October', type: 'special', requirement: 'All October', icon: '🎃', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_nov_complete', title: 'November Victor', description: 'Complete every day in November', type: 'special', requirement: 'All November', icon: '🦃', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_dec_complete', title: 'December Dominator', description: 'Complete every day in December', type: 'special', requirement: 'All December', icon: '🎄', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_all_months', title: 'Complete Calendar', description: 'Complete every month perfectly once', type: 'special', requirement: 'All 12 months', icon: '📆', xpReward: 3000, coinReward: 600, checkUnlock: () => false },
  { id: 'special_birthday', title: 'Birthday Bonus', description: 'Complete a workout on your birthday', type: 'special', requirement: 'Birthday', icon: '🎂', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_new_year', title: 'New Year New You', description: 'Complete a workout on New Year\'s Day', type: 'special', requirement: 'Jan 1', icon: '🎆', xpReward: 150, coinReward: 30, checkUnlock: () => false },
  { id: 'special_valentine', title: 'Love The Grind', description: 'Complete a workout on Valentine\'s Day', type: 'special', requirement: 'Feb 14', icon: '💝', xpReward: 50, coinReward: 10, checkUnlock: () => false },
  { id: 'special_halloween', title: 'Spooky Session', description: 'Complete a workout on Halloween', type: 'special', requirement: 'Oct 31', icon: '🎃', xpReward: 50, coinReward: 10, checkUnlock: () => false },
  { id: 'special_christmas', title: 'Christmas Commitment', description: 'Complete a workout on Christmas', type: 'special', requirement: 'Dec 25', icon: '🎄', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_thanksgiving', title: 'Thankful For Fitness', description: 'Complete a workout on Thanksgiving', type: 'special', requirement: 'Thanksgiving', icon: '🦃', xpReward: 50, coinReward: 10, checkUnlock: () => false },
  { id: 'special_all_holidays', title: 'Holiday Hero', description: 'Complete workouts on 10 different holidays', type: 'special', requirement: '10 holidays', icon: '🎊', xpReward: 500, coinReward: 100, checkUnlock: () => false },
  { id: 'special_rain_shine', title: 'Rain Or Shine', description: 'Complete workouts in different weather conditions', type: 'special', requirement: 'Various weather', icon: '🌦️', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_travel_warrior', title: 'Travel Warrior', description: 'Complete workouts in 5 different locations', type: 'special', requirement: '5 locations', icon: '✈️', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_dawn_to_dusk', title: 'Dawn To Dusk', description: 'Complete workouts at all times of day', type: 'special', requirement: 'All times', icon: '🌍', xpReward: 300, coinReward: 60, checkUnlock: () => false },
  { id: 'special_sick_day_warrior', title: 'Sick Day Warrior', description: 'Complete a workout when under the weather', type: 'special', requirement: 'While sick', icon: '🤧', xpReward: 100, coinReward: 20, checkUnlock: () => false },
  { id: 'special_injured_hero', title: 'Modified Master', description: 'Complete modified push-ups while injured', type: 'special', requirement: 'While injured', icon: '🩹', xpReward: 150, coinReward: 30, checkUnlock: () => false },
  { id: 'special_recovery_king', title: 'Recovery King', description: 'Return after 30+ day break', type: 'special', requirement: 'After 30 days', icon: '🔄', xpReward: 200, coinReward: 40, checkUnlock: () => false },
  { id: 'special_consistency_god', title: 'Consistency Icon', description: 'Never miss more than 1 day in a row for 365 days', type: 'special', requirement: '365 days', icon: '⚖️', xpReward: 2000, coinReward: 400, checkUnlock: () => false },
  { id: 'special_volume_day_500', title: 'Volume Day 500', description: 'Complete 500 push-ups in a single day', type: 'special', requirement: '500 in day', icon: '📊', xpReward: 300, coinReward: 60, checkUnlock: () => false },
  { id: 'special_volume_day_1000', title: 'Volume Day 1000', description: 'Complete 1000 push-ups in a single day', type: 'special', requirement: '1000 in day', icon: '📈', xpReward: 600, coinReward: 120, checkUnlock: () => false },
  { id: 'special_volume_day_2000', title: 'Volume Day 2000', description: 'Complete 2000 push-ups in a single day', type: 'special', requirement: '2000 in day', icon: '📉', xpReward: 1200, coinReward: 240, checkUnlock: () => false },
  { id: 'special_volume_day_3000', title: 'Volume Day 3000', description: 'Complete 3000 push-ups in a single day', type: 'special', requirement: '3000 in day', icon: '📐', xpReward: 2000, coinReward: 400, checkUnlock: () => false },
  { id: 'special_variety_god', title: 'Variety Master', description: 'Complete 1000 reps of each push-up type', type: 'special', requirement: 'All 1000', icon: '🌈', xpReward: 2000, coinReward: 400, checkUnlock: (data) => Object.values(data.variationStats).every(v => v >= 1000) },
  { id: 'special_balanced_master', title: 'Balanced Master', description: 'Keep all variation stats within 500 of each other', type: 'special', requirement: 'Balanced', icon: '⚖️', xpReward: 500, coinReward: 100, checkUnlock: () => false },
  { id: 'special_ultimate_legend', title: 'Ultimate Legend', description: 'Unlock 200 other achievements', type: 'special', requirement: '200 achievements', icon: '🏆', xpReward: 10000, coinReward: 2000, checkUnlock: () => false },
  { id: 'special_completionist', title: 'Completionist', description: 'Unlock all other achievements', type: 'special', requirement: 'All achievements', icon: '👑', xpReward: 50000, coinReward: 10000, checkUnlock: () => false },
];

// Helper function to check achievements
export function checkAchievements(data: AchievementCheckData, currentUnlocked: string[]): AchievementDefinition[] {
  const newAchievements: AchievementDefinition[] = [];
  const unlockedSet = new Set(currentUnlocked);

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    if (!unlockedSet.has(achievement.id)) {
      if (achievement.checkUnlock(data)) {
        newAchievements.push(achievement);
      }
    }
  }

  return newAchievements;
}
