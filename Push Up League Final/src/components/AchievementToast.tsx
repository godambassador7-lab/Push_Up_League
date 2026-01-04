'use client';

import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { AchievementDefinition } from '@/lib/achievements';

interface AchievementToastProps {
  achievement: AchievementDefinition;
  onClose: () => void;
  autoCloseDuration?: number;
}

export const AchievementToast = ({ achievement, onClose, autoCloseDuration = 5000 }: AchievementToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-20 right-4 sm:right-6 z-[100] transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative">
        {/* Shining border animation */}
        <div className="absolute -inset-1 bg-gradient-to-r from-warning via-accent to-warning rounded-lg opacity-75 blur-sm animate-shine-border" />

        {/* Main content */}
        <div className="relative glass border-2 border-warning rounded-lg p-4 sm:p-5 max-w-sm shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition active:scale-95"
            aria-label="Close"
          >
            <X size={16} className="text-gray-400" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-warning to-gold flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <Trophy size={20} className="sm:w-6 sm:h-6 text-dark" />
            </div>
            <div>
              <div className="text-xs text-warning uppercase tracking-wider font-bold">Achievement Unlocked!</div>
              <div className="text-sm sm:text-base font-bold text-white mt-0.5">New Achievement</div>
            </div>
          </div>

          {/* Achievement Details */}
          <div className="pl-0 sm:pl-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl sm:text-3xl">{achievement.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-accent text-base sm:text-lg">{achievement.title}</div>
                <div className="text-xs text-gray-400">{achievement.description}</div>
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dark-border text-xs">
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-electric-blue" />
                <span className="text-gray-400">+<span className="text-electric-blue font-bold">{achievement.xpReward}</span> XP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-warning">💰</span>
                <span className="text-gray-400">+<span className="text-warning font-bold">{achievement.coinReward}</span> Coins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
