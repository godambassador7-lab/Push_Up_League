'use client';

import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  days: number;
  isBroken: boolean;
  maxStreak: number;
}

export const StreakDisplay = ({ days, isBroken, maxStreak }: StreakDisplayProps) => {
  return (
    <div className="relative">
      <div className={`
        p-6 rounded-lg glass
        ${isBroken ? 'border-dark-border' : 'glass-border animate-pulse-glow'}
      `}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 uppercase tracking-wider font-display">Streak</div>
            <div className="text-5xl font-bold font-display mt-2 flex items-center gap-2">
              <Flame className={`${!isBroken ? 'text-accent animate-flame-flicker' : 'text-gray-500'}`} size={40} />
              {days}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase">Best</div>
            <div className="text-2xl font-bold text-accent mt-1">{maxStreak}</div>
          </div>
        </div>

        {isBroken && (
          <div className="mt-4 p-3 bg-warning/20 border border-warning rounded text-warning text-sm">
            Streak broken! Log push-ups today to restart.
          </div>
        )}
      </div>
    </div>
  );
};
