'use client';

import { Coins, Zap, Trophy, Target, Flame, X } from 'lucide-react';
import { useEnhancedStore } from '@/lib/enhancedStore';

interface WorkoutSuccessModalProps {
  onClose: () => void;
  pushups: number;
  xpEarned: number;
  coinsEarned: number;
  goalCompleted: boolean;
  streakDay: number;
}

export const WorkoutSuccessModal = ({
  onClose,
  pushups,
  xpEarned,
  coinsEarned,
  goalCompleted,
  streakDay,
}: WorkoutSuccessModalProps) => {
  const currentRank = useEnhancedStore((state) => state.currentRank);
  const getNextRankProgress = useEnhancedStore((state) => state.getNextRankProgress);
  const rankProgress = getNextRankProgress();

  // Calculate coin breakdown
  const baseCoins = 10;
  const goalBonus = goalCompleted ? 20 : 0;
  const streakBonus = streakDay > 1 ? 5 : 0;
  const multiplierBonus = coinsEarned - baseCoins - goalBonus - streakBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark/90 backdrop-blur-sm animate-fade-in">
      <div className="max-w-md w-full glass glass-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 to-electric-blue/20 border-b border-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Trophy size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-hero text-accent">Workout Logged!</h3>
                <p className="text-sm text-gray-400 mt-1">Great work, champion!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent/10 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Push-ups Completed */}
          <div className="text-center p-4 glass-light rounded-lg border border-accent/30">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Push-Ups Completed</div>
            <div className="text-5xl font-black text-hero text-accent">{pushups}</div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* XP Earned */}
            <div className="glass-light rounded-lg border border-electric-blue/30 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={16} className="text-electric-blue" />
                <span className="text-xs text-gray-400 uppercase">XP Earned</span>
              </div>
              <div className="text-2xl font-black text-electric-blue">+{xpEarned}</div>
              <div className="text-xs text-gray-500 mt-1">{rankProgress.percent}% to next rank</div>
            </div>

            {/* Coins Earned */}
            <div className="glass-light rounded-lg border border-warning/30 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins size={16} className="text-warning" />
                <span className="text-xs text-gray-400 uppercase">Coins Earned</span>
              </div>
              <div className="text-2xl font-black text-warning">+{coinsEarned}</div>
            </div>
          </div>

          {/* Coin Breakdown */}
          <div className="glass-light rounded-lg border border-dark-border p-4 space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Coins size={14} className="text-warning" />
              Coin Breakdown
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Base Reward</span>
                <span className="font-bold text-white">+{baseCoins}</span>
              </div>

              {multiplierBonus > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sets & Variation Bonus</span>
                  <span className="font-bold text-success">+{Math.floor(multiplierBonus)}</span>
                </div>
              )}

              {streakBonus > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Flame size={12} className="text-accent" />
                    <span className="text-gray-400">Streak Bonus</span>
                  </div>
                  <span className="font-bold text-accent">+{streakBonus}</span>
                </div>
              )}

              {goalBonus > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Target size={12} className="text-success" />
                    <span className="text-gray-400">Goal Completed!</span>
                  </div>
                  <span className="font-bold text-success">+{goalBonus}</span>
                </div>
              )}

              <div className="pt-2 border-t border-dark-border flex justify-between items-center">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-lg text-warning">{coinsEarned}</span>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          {streakDay > 0 && (
            <div className="glass-light rounded-lg border border-accent/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-accent" />
                  <span className="font-bold">Current Streak</span>
                </div>
                <span className="text-2xl font-black text-accent">{streakDay} {streakDay === 1 ? 'day' : 'days'}</span>
              </div>
              {streakDay >= 7 && (
                <div className="mt-2 text-xs text-success">
                  🔥 Streak multiplier active! Keep it going!
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-accent to-electric-blue text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
