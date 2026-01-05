'use client';

import { Flame } from 'lucide-react';

interface StreakFlameProps {
  streak: number;
  isBroken: boolean;
  size?: number;
}

export const StreakFlame = ({ streak, isBroken, size = 12 }: StreakFlameProps) => {
  // If streak is 0, show ice cube emoji
  if (streak === 0 || isBroken) {
    return <span className="text-base">🧊</span>;
  }

  // Determine flame color and animation based on streak
  const getFlameStyle = () => {
    if (streak >= 41) {
      // 41-50: Black flame with white border
      return {
        color: 'text-gray-900',
        glow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]',
        animation: 'animate-pulse',
        border: 'filter drop-shadow-[0_0_2px_rgba(255,255,255,1)]'
      };
    } else if (streak >= 31) {
      // 31-40: Purple flame
      return {
        color: 'text-purple-500',
        glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
        animation: 'animate-pulse'
      };
    } else if (streak >= 21) {
      // 21-30: Blue flame
      return {
        color: 'text-blue-500',
        glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]',
        animation: 'animate-pulse'
      };
    } else if (streak >= 11) {
      // 11-20: Green flame
      return {
        color: 'text-green-500',
        glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]',
        animation: 'animate-pulse'
      };
    } else {
      // 1-10: Regular orange/red flame
      return {
        color: 'text-accent',
        glow: 'drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]',
        animation: 'animate-pulse'
      };
    }
  };

  const style = getFlameStyle();

  return (
    <div className="relative inline-block">
      <Flame
        size={size}
        className={`${style.color} ${style.glow} ${style.animation} ${style.border || ''}`}
        fill="currentColor"
      />
      {/* Add flickering effect with keyframe animation */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.9; transform: scale(1.05); }
          50% { opacity: 1; transform: scale(0.95); }
          75% { opacity: 0.95; transform: scale(1.02); }
        }
        .animate-pulse {
          animation: flicker 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
