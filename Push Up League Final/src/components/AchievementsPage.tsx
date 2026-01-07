'use client';

import { useMemo } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { ACHIEVEMENT_DEFINITIONS, AchievementDefinition } from '@/lib/achievements';
import { Trophy, Lock, Award, TrendingUp, Target, Zap } from 'lucide-react';

export const AchievementsPage = () => {
  const unlockedAchievements = useEnhancedStore((state) => state.unlockedAchievements);

  // Group achievements by type
  const groupedAchievements = useMemo(() => {
    const groups: Record<string, AchievementDefinition[]> = {
      streak: [],
      volume: [],
      consistency: [],
      variety: [],
      comeback: [],
      special: [],
    };

    ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
      if (groups[achievement.type]) {
        groups[achievement.type].push(achievement);
      }
    });

    return groups;
  }, []);

  const totalAchievements = ACHIEVEMENT_DEFINITIONS.length;
  const unlockedCount = unlockedAchievements.length;
  const completionPercent = Math.round((unlockedCount / totalAchievements) * 100);

  const isUnlocked = (achievementId: string) => {
    return unlockedAchievements.includes(achievementId);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Zap size={20} className="text-accent" />;
      case 'volume':
        return <TrendingUp size={20} className="text-electric-blue" />;
      case 'consistency':
        return <Target size={20} className="text-success" />;
      case 'variety':
        return <Award size={20} className="text-purple-400" />;
      case 'comeback':
        return <Trophy size={20} className="text-warning" />;
      case 'special':
        return <Trophy size={20} className="text-gold" />;
      default:
        return <Trophy size={20} className="text-gray-400" />;
    }
  };

  const getCategoryTitle = (type: string) => {
    switch (type) {
      case 'streak':
        return 'Streak Achievements';
      case 'volume':
        return 'Volume Achievements';
      case 'consistency':
        return 'Consistency Achievements';
      case 'variety':
        return 'Variety Achievements';
      case 'comeback':
        return 'Comeback Achievements';
      case 'special':
        return 'Special Achievements';
      default:
        return 'Achievements';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="glass glass-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-hero text-accent">
              Achievements
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Track your progress and unlock rewards
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass-light rounded-lg border border-accent/50">
            <Trophy size={24} className="text-warning" />
            <div className="text-right">
              <div className="text-xs text-gray-400">Progress</div>
              <div className="text-lg font-bold text-accent">
                {unlockedCount}/{totalAchievements}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-400">Overall Completion</span>
            <span className="text-accent font-bold">{completionPercent}%</span>
          </div>
          <div className="h-3 sm:h-4 bg-dark-card rounded-full overflow-hidden border border-dark-border relative">
            <div
              className="h-full bg-gradient-to-r from-accent via-electric-blue to-cyan-bright rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${completionPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      {Object.entries(groupedAchievements).map(([type, achievements]) => {
        if (achievements.length === 0) return null;

        const categoryUnlocked = achievements.filter((a) => isUnlocked(a.id)).length;
        const categoryTotal = achievements.length;

        return (
          <div key={type} className="space-y-3 sm:space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {getCategoryIcon(type)}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-hero">
                    {getCategoryTitle(type)}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {categoryUnlocked} of {categoryTotal} unlocked
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {achievements.map((achievement) => {
                const unlocked = isUnlocked(achievement.id);

                return (
                  <div
                    key={achievement.id}
                    className={`p-4 sm:p-5 rounded-lg border-2 transition-all ${
                      unlocked
                        ? 'glass-light border-accent/50 hover:border-accent shadow-lg shadow-accent/20'
                        : 'glass border-dark-border opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl ${
                          unlocked
                            ? 'bg-gradient-to-br from-accent/30 to-electric-blue/30 border-2 border-accent'
                            : 'bg-dark-card border-2 border-dark-border grayscale'
                        }`}
                      >
                        {unlocked ? (
                          achievement.icon
                        ) : (
                          <Lock size={20} className="sm:w-6 sm:h-6 text-gray-600" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-bold text-sm sm:text-base ${
                                unlocked ? 'text-accent' : 'text-gray-500'
                              }`}
                            >
                              {achievement.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {achievement.description}
                            </p>
                          </div>
                          {unlocked && (
                            <Trophy
                              size={18}
                              className="sm:w-5 sm:h-5 text-warning flex-shrink-0"
                            />
                          )}
                        </div>

                        {/* Requirement */}
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dark-border">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              {typeof achievement.requirement === 'number'
                                ? `Reach ${achievement.requirement.toLocaleString()}`
                                : achievement.requirement}
                            </span>
                            {unlocked && (
                              <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-electric-blue font-bold">
                                  +{achievement.xpReward} XP
                                </span>
                                <span className="text-warning font-bold">
                                  +{achievement.coinReward} 💰
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
