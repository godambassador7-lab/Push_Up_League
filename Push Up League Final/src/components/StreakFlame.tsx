'use client';

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
      // 41-50: Black flame with white glow
      return {
        primaryColor: '#1a1a1a',
        secondaryColor: '#000000',
        glowColor: 'rgba(255, 255, 255, 0.9)',
        animation: 'animate-flame-intense'
      };
    } else if (streak >= 31) {
      // 31-40: Purple flame
      return {
        primaryColor: '#a855f7',
        secondaryColor: '#9333ea',
        glowColor: 'rgba(168, 85, 247, 0.8)',
        animation: 'animate-flame-strong'
      };
    } else if (streak >= 21) {
      // 21-30: Blue flame
      return {
        primaryColor: '#3b82f6',
        secondaryColor: '#2563eb',
        glowColor: 'rgba(59, 130, 246, 0.8)',
        animation: 'animate-flame-strong'
      };
    } else if (streak >= 11) {
      // 11-20: Green flame
      return {
        primaryColor: '#22c55e',
        secondaryColor: '#16a34a',
        glowColor: 'rgba(34, 197, 94, 0.8)',
        animation: 'animate-flame-medium'
      };
    } else {
      // 1-10: Regular orange/yellow flame
      return {
        primaryColor: '#fb923c',
        secondaryColor: '#f97316',
        glowColor: 'rgba(251, 146, 60, 0.8)',
        animation: 'animate-flame-regular'
      };
    }
  };

  const style = getFlameStyle();

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={style.animation}
        style={{ filter: `drop-shadow(0 0 ${size * 0.5}px ${style.glowColor})` }}
      >
        {/* Main flame body */}
        <path
          d="M12 2C12 2 8 6 8 10C8 13.314 9.791 16 12 16C14.209 16 16 13.314 16 10C16 6 12 2 12 2Z"
          fill={style.primaryColor}
          className="flame-main"
        />
        {/* Inner flame */}
        <path
          d="M12 6C12 6 10 8.5 10 10.5C10 12.433 10.895 14 12 14C13.105 14 14 12.433 14 10.5C14 8.5 12 6 12 6Z"
          fill={style.secondaryColor}
          className="flame-inner"
          opacity="0.8"
        />
        {/* Flame tip */}
        <circle
          cx="12"
          cy="4"
          r="1.5"
          fill={style.glowColor}
          className="flame-tip"
        />
      </svg>
      {/* Dancing flame animations */}
      <style jsx>{`
        @keyframes flame-regular {
          0%, 100% {
            transform: scale(1, 1) translateY(0) rotate(0deg);
          }
          25% {
            transform: scale(1.05, 0.95) translateY(-1px) rotate(-2deg);
          }
          50% {
            transform: scale(0.98, 1.03) translateY(0px) rotate(2deg);
          }
          75% {
            transform: scale(1.02, 0.97) translateY(-0.5px) rotate(-1deg);
          }
        }

        @keyframes flame-medium {
          0%, 100% {
            transform: scale(1, 1) translateY(0) rotate(0deg);
          }
          20% {
            transform: scale(1.08, 0.92) translateY(-1.5px) rotate(-3deg);
          }
          40% {
            transform: scale(0.95, 1.05) translateY(0.5px) rotate(3deg);
          }
          60% {
            transform: scale(1.04, 0.96) translateY(-1px) rotate(-2deg);
          }
          80% {
            transform: scale(0.97, 1.02) translateY(0px) rotate(2deg);
          }
        }

        @keyframes flame-strong {
          0%, 100% {
            transform: scale(1, 1) translateY(0) rotate(0deg);
          }
          15% {
            transform: scale(1.12, 0.88) translateY(-2px) rotate(-4deg);
          }
          30% {
            transform: scale(0.92, 1.08) translateY(1px) rotate(4deg);
          }
          45% {
            transform: scale(1.06, 0.94) translateY(-1.5px) rotate(-3deg);
          }
          60% {
            transform: scale(0.94, 1.06) translateY(0.5px) rotate(3deg);
          }
          75% {
            transform: scale(1.04, 0.96) translateY(-1px) rotate(-2deg);
          }
          90% {
            transform: scale(0.98, 1.02) translateY(0px) rotate(2deg);
          }
        }

        @keyframes flame-intense {
          0%, 100% {
            transform: scale(1, 1) translateY(0) rotate(0deg);
          }
          10% {
            transform: scale(1.15, 0.85) translateY(-2.5px) rotate(-5deg);
          }
          20% {
            transform: scale(0.88, 1.12) translateY(1.5px) rotate(5deg);
          }
          30% {
            transform: scale(1.1, 0.9) translateY(-2px) rotate(-4deg);
          }
          40% {
            transform: scale(0.92, 1.08) translateY(1px) rotate(4deg);
          }
          50% {
            transform: scale(1.08, 0.92) translateY(-1.5px) rotate(-3deg);
          }
          60% {
            transform: scale(0.94, 1.06) translateY(0.5px) rotate(3deg);
          }
          70% {
            transform: scale(1.06, 0.94) translateY(-1px) rotate(-2deg);
          }
          80% {
            transform: scale(0.96, 1.04) translateY(0.5px) rotate(2deg);
          }
          90% {
            transform: scale(1.03, 0.97) translateY(-0.5px) rotate(-1deg);
          }
        }

        .animate-flame-regular {
          animation: flame-regular 1.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .animate-flame-medium {
          animation: flame-medium 1.2s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .animate-flame-strong {
          animation: flame-strong 1s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .animate-flame-intense {
          animation: flame-intense 0.8s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .flame-main, .flame-inner, .flame-tip {
          animation: flicker 0.15s ease-in-out infinite alternate;
        }

        @keyframes flicker {
          from {
            opacity: 0.95;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
