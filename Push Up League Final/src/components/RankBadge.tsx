import { RANK_LADDER } from '@/lib/store';
import { Shield } from 'lucide-react';

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RankBadge = ({ rank, size = 'md' }: RankBadgeProps) => {
  const rankData = RANK_LADDER[rank - 1];

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 56,
    md: 80,
    lg: 96,
  };

  const getRankGradient = (rank: number) => {
    if (rank <= 2) {
      // Bronze - Metallic copper/bronze gradient
      return 'linear-gradient(135deg, #cd7f32 0%, #b87333 25%, #cd7f32 50%, #8b4513 75%, #cd7f32 100%)';
    }
    if (rank <= 4) {
      // Silver - Metallic silver/gray gradient
      return 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 25%, #a8a8a8 50%, #c0c0c0 75%, #e8e8e8 100%)';
    }
    if (rank <= 6) {
      // Gold - Metallic gold/yellow gradient
      return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 50%, #ffb700 75%, #ffd700 100%)';
    }
    // Mythic - Metallic purple/red gradient
    return 'linear-gradient(135deg, #9d4edd 0%, #d946ef 25%, #dc2626 50%, #9d4edd 75%, #7b2cbf 100%)';
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Shield Background with Metallic Gradient */}
      <div
        className="absolute drop-shadow-2xl"
        style={{
          width: iconSizes[size],
          height: iconSizes[size],
        }}
      >
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`rank-gradient-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {rank <= 2 ? (
                // Bronze gradient stops
                <>
                  <stop offset="0%" stopColor="#cd7f32" />
                  <stop offset="25%" stopColor="#b87333" />
                  <stop offset="50%" stopColor="#cd7f32" />
                  <stop offset="75%" stopColor="#8b4513" />
                  <stop offset="100%" stopColor="#cd7f32" />
                </>
              ) : rank <= 4 ? (
                // Silver gradient stops
                <>
                  <stop offset="0%" stopColor="#e8e8e8" />
                  <stop offset="25%" stopColor="#c0c0c0" />
                  <stop offset="50%" stopColor="#a8a8a8" />
                  <stop offset="75%" stopColor="#c0c0c0" />
                  <stop offset="100%" stopColor="#e8e8e8" />
                </>
              ) : rank <= 6 ? (
                // Gold gradient stops
                <>
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="25%" stopColor="#ffed4e" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="75%" stopColor="#ffb700" />
                  <stop offset="100%" stopColor="#ffd700" />
                </>
              ) : (
                // Mythic gradient stops (purple/red)
                <>
                  <stop offset="0%" stopColor="#9d4edd" />
                  <stop offset="25%" stopColor="#d946ef" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="75%" stopColor="#9d4edd" />
                  <stop offset="100%" stopColor="#7b2cbf" />
                </>
              )}
            </linearGradient>
          </defs>
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill={`url(#rank-gradient-${rank})`}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Rank Number - Centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-black text-white text-shadow-lg" style={{ fontSize: size === 'sm' ? '20px' : size === 'md' ? '28px' : '36px' }}>
          {rank}
        </div>
      </div>
    </div>
  );
};
