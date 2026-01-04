'use client';

import { Coins, Zap } from 'lucide-react';
import { useUserStore } from '@/lib/store';

export const StatsPanel = () => {
  const totalXp = useUserStore((state) => state.totalXp);
  const coins = useUserStore((state) => state.coins);
  const workouts = useUserStore((state) => state.workouts);
  const achievements = useUserStore((state) => state.achievements);

  const totalPushups = workouts.reduce((sum, w) => sum + w.pushups, 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg glass glass-border hover:border-accent/50 transition">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total XP</div>
            <div className="text-2xl font-bold text-accent mt-1">{totalXp.toLocaleString()}</div>
          </div>
          <Zap className="text-accent opacity-50" size={24} />
        </div>
      </div>

      <div className="p-4 rounded-lg glass glass-border hover:border-accent/50 transition">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Coins</div>
            <div className="text-2xl font-bold text-gold mt-1">{coins}</div>
          </div>
          <Coins className="text-gold opacity-50" size={24} />
        </div>
      </div>

      <div className="p-4 rounded-lg glass glass-border hover:border-accent/50 transition">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Lifetime Push-ups</div>
          <div className="text-2xl font-bold text-accent mt-1">{totalPushups.toLocaleString()}</div>
        </div>
      </div>

      <div className="p-4 rounded-lg glass glass-border hover:border-accent/50 transition">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Achievements</div>
          <div className="text-2xl font-bold text-accent mt-1">{achievements.length}</div>
        </div>
      </div>
    </div>
  );
};
