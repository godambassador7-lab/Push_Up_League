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
        glow: 'drop-shadow-[0_0_16px_rgba(255,255,255,1)] drop-shadow-[0_0_8px_rgba(255,255,255,1)]',
        animation: 'animate-flame-intense'
      };
    } else if (streak >= 31) {
      // 31-40: Purple flame
      return {
        color: 'text-purple-500',
        glow: 'drop-shadow-[0_0_16px_rgba(168,85,247,1)] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
        animation: 'animate-flame-strong'
      };
    } else if (streak >= 21) {
      // 21-30: Blue flame
      return {
        color: 'text-blue-500',
        glow: 'drop-shadow-[0_0_16px_rgba(59,130,246,1)] drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]',
        animation: 'animate-flame-strong'
      };
    } else if (streak >= 11) {
      // 11-20: Green flame
      return {
        color: 'text-green-500',
        glow: 'drop-shadow-[0_0_16px_rgba(34,197,94,1)] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]',
        animation: 'animate-flame-medium'
      };
    } else {
      // 1-10: Regular orange/red flame
      return {
        color: 'text-accent',
        glow: 'drop-shadow-[0_0_12px_rgba(0,188,212,0.9)] drop-shadow-[0_0_6px_rgba(0,188,212,0.6)]',
        animation: 'animate-flame-regular'
      };
    }
  };

  const style = getFlameStyle();

  return (
    <div className="relative inline-block">
      <Flame
        size={size}
        className={`${style.color} ${style.glow} ${style.animation}`}
        fill="currentColor"
      />
      {/* Enhanced flickering animations with different intensities */}
      <style jsx>{`
        @keyframes flame-regular {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg) translateY(0);
            filter: brightness(1);
          }
          20% {
            opacity: 0.85;
            transform: scale(1.12) rotate(-3deg) translateY(-1px);
            filter: brightness(1.1);
          }
          40% {
            opacity: 1;
            transform: scale(0.94) rotate(3deg) translateY(1px);
            filter: brightness(0.95);
          }
          60% {
            opacity: 0.9;
            transform: scale(1.08) rotate(-2deg) translateY(-1px);
            filter: brightness(1.05);
          }
          80% {
            opacity: 1;
            transform: scale(0.98) rotate(2deg) translateY(1px);
            filter: brightness(0.98);
          }
        }

        @keyframes flame-medium {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg) translateY(0);
            filter: brightness(1);
          }
          15% {
            opacity: 0.8;
            transform: scale(1.18) rotate(-4deg) translateY(-1px);
            filter: brightness(1.2);
          }
          35% {
            opacity: 1;
            transform: scale(0.88) rotate(4deg) translateY(1px);
            filter: brightness(0.9);
          }
          55% {
            opacity: 0.85;
            transform: scale(1.14) rotate(-3deg) translateY(-1px);
            filter: brightness(1.1);
          }
          75% {
            opacity: 1;
            transform: scale(0.94) rotate(3deg) translateY(1px);
            filter: brightness(0.95);
          }
        }

        @keyframes flame-strong {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg) translateY(0);
            filter: brightness(1) drop-shadow(0 0 4px currentColor);
          }
          12% {
            opacity: 0.75;
            transform: scale(1.22) rotate(-5deg) translateY(-2px);
            filter: brightness(1.3) drop-shadow(0 0 8px currentColor);
          }
          28% {
            opacity: 1;
            transform: scale(0.84) rotate(5deg) translateY(1px);
            filter: brightness(0.85) drop-shadow(0 0 2px currentColor);
          }
          45% {
            opacity: 0.8;
            transform: scale(1.18) rotate(-4deg) translateY(-2px);
            filter: brightness(1.2) drop-shadow(0 0 6px currentColor);
          }
          65% {
            opacity: 1;
            transform: scale(0.88) rotate(4deg) translateY(1px);
            filter: brightness(0.9) drop-shadow(0 0 3px currentColor);
          }
          82% {
            opacity: 0.9;
            transform: scale(1.12) rotate(-3deg) translateY(-1px);
            filter: brightness(1.1) drop-shadow(0 0 5px currentColor);
          }
        }

        @keyframes flame-intense {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg) translateY(0);
            filter: brightness(1) drop-shadow(0 0 6px rgba(255,255,255,0.8));
          }
          10% {
            opacity: 0.7;
            transform: scale(1.28) rotate(-6deg) translateY(-2px);
            filter: brightness(1.4) drop-shadow(0 0 12px rgba(255,255,255,1));
          }
          22% {
            opacity: 1;
            transform: scale(0.78) rotate(6deg) translateY(2px);
            filter: brightness(0.8) drop-shadow(0 0 4px rgba(255,255,255,0.6));
          }
          38% {
            opacity: 0.75;
            transform: scale(1.24) rotate(-5deg) translateY(-2px);
            filter: brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.9));
          }
          55% {
            opacity: 1;
            transform: scale(0.84) rotate(5deg) translateY(2px);
            filter: brightness(0.85) drop-shadow(0 0 5px rgba(255,255,255,0.7));
          }
          70% {
            opacity: 0.8;
            transform: scale(1.18) rotate(-4deg) translateY(-2px);
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.85));
          }
          85% {
            opacity: 1;
            transform: scale(0.94) rotate(3deg) translateY(1px);
            filter: brightness(0.95) drop-shadow(0 0 6px rgba(255,255,255,0.75));
          }
        }

        .animate-flame-regular {
          animation: flame-regular 1.2s ease-in-out infinite;
        }
        .animate-flame-medium {
          animation: flame-medium 1.05s ease-in-out infinite;
        }
        .animate-flame-strong {
          animation: flame-strong 0.95s ease-in-out infinite;
        }
        .animate-flame-intense {
          animation: flame-intense 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
