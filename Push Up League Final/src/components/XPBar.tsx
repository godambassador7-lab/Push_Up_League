'use client';

import { RANK_LADDER } from '@/lib/store';

interface XPBarProps {
  current: number;
  required: number;
  percent: number;
  currentRank: number;
}

export const XPBar = ({ current, required, percent, currentRank }: XPBarProps) => {
  const nextRank = currentRank + 1 <= RANK_LADDER.length ? RANK_LADDER[currentRank] : null;
  const currentRankData = RANK_LADDER[currentRank - 1];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider font-display">Progress to Rank {currentRank + 1}</div>
          <div className="text-sm text-gray-300 mt-1">
            {current} / {required} XP
          </div>
        </div>
        {nextRank && (
          <div className="text-right">
            <div className="text-xs text-accent font-display">{nextRank.title}</div>
          </div>
        )}
      </div>

      <div className="relative h-3 bg-dark-border rounded-full overflow-hidden border border-dark-border">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-right">
        <div className="text-xs text-gray-500">{percent}% Complete</div>
      </div>
    </div>
  );
};
