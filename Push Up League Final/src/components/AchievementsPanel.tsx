'use client';

import { useUserStore } from '@/lib/store';
import { Award } from 'lucide-react';

export const AchievementsPanel = () => {
  const achievements = useUserStore((state) => state.achievements);

  if (achievements.length === 0) {
    return (
      <div className="p-6 rounded-lg glass glass-border text-center">
        <Award className="mx-auto text-gray-500 mb-3" size={32} />
        <div className="text-sm text-gray-400">No achievements yet. Keep grinding!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-400 uppercase tracking-wider font-display">Achievements</div>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="p-4 rounded-lg glass-light border border-accent/30 hover:border-accent/60 transition animate-slide-up"
          >
            <div className="flex items-start gap-2">
              <Award size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">{achievement.title}</div>
                <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
