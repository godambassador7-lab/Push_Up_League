'use client';

import { useEffect } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements';
import { AchievementToast } from './AchievementToast';

export const AchievementToastManager = () => {
  const achievementToasts = useEnhancedStore((state) => state.achievementToasts);
  const dismissAchievementToast = useEnhancedStore((state) => state.dismissAchievementToast);

  // Show the first achievement in the queue
  const currentToastId = achievementToasts[0];
  const currentAchievement = currentToastId
    ? ACHIEVEMENT_DEFINITIONS.find((a) => a.id === currentToastId)
    : null;

  return (
    <>
      {currentAchievement && (
        <AchievementToast
          achievement={currentAchievement}
          onClose={dismissAchievementToast}
        />
      )}
    </>
  );
};
