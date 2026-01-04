'use client';

import { useEnhancedStore } from '@/lib/enhancedStore';
import { generateDailyQuests, generateWeeklyQuests } from '@/lib/quests';
import { Target, Trophy, Coins, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const QuestsPanel = () => {
  const quests = useEnhancedStore((state) => state.quests);
  const claimQuestReward = useEnhancedStore((state) => state.claimQuestReward);
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Initialize quests if empty
    if (quests.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)

      const dailyQuests = generateDailyQuests(today);
      const weeklyQuests = generateWeeklyQuests(weekStart.toISOString().split('T')[0]);

      useEnhancedStore.setState({
        quests: [...dailyQuests, ...weeklyQuests]
      });
    }
  }, [quests.length]);

  const handleClaimReward = (questId: string) => {
    const result = claimQuestReward(questId);
    setShowMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    setTimeout(() => setShowMessage(null), 3000);
  };

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');

  const getProgressPercent = (current: number, required: number) => {
    return Math.min(Math.round((current / required) * 100), 100);
  };

  const QuestCard = ({ quest }: { quest: typeof quests[0] }) => {
    const progress = getProgressPercent(quest.progress, quest.requirement);
    const isCompleted = quest.progress >= quest.requirement;
    const isClaimed = quest.claimed;

    return (
      <div className={`p-4 glass-light rounded-lg border transition ${
        isCompleted && !isClaimed
          ? 'border-accent shadow-lg shadow-accent/20'
          : 'border-dark-border'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-accent" />
              <h4 className="font-display font-bold text-white">{quest.name}</h4>
            </div>
            <p className="text-xs text-gray-400">{quest.description}</p>
          </div>

          {quest.type === 'weekly' && (
            <div className="ml-2 px-2 py-1 glass-light rounded text-xs text-purple-400 border border-purple-400/50">
              <Clock size={10} className="inline mr-1" />
              Weekly
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-bold">{quest.progress} / {quest.requirement}</span>
          </div>
          <div className="w-full h-2 glass-light rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Coins size={14} className="text-warning" />
              <span className="text-warning font-bold">+{quest.coinReward}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-electric-blue" />
              <span className="text-electric-blue font-bold">+{quest.xpReward} XP</span>
            </div>
          </div>

          {isClaimed ? (
            <div className="flex items-center gap-1 text-xs text-success">
              <CheckCircle size={14} />
              <span>Claimed</span>
            </div>
          ) : isCompleted ? (
            <button
              onClick={() => handleClaimReward(quest.id)}
              className="px-3 py-1 bg-gradient-to-r from-accent to-accent-light text-dark text-xs font-bold rounded hover:shadow-lg hover:shadow-accent/50 transition uppercase"
            >
              Claim
            </button>
          ) : (
            <div className="text-xs text-gray-500">In Progress</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Message Toast */}
      {showMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          showMessage.type === 'success'
            ? 'bg-success/20 border border-success text-success'
            : 'bg-red-500/20 border border-red-500 text-red-400'
        }`}>
          {showMessage.text}
        </div>
      )}

      {/* Daily Quests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-accent" />
          <h3 className="text-lg font-display font-bold text-white">Daily Quests</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
        </div>

        {dailyQuests.length === 0 ? (
          <div className="p-6 glass-light rounded-lg text-center text-gray-400 text-sm">
            No daily quests available. Complete a workout to unlock new quests!
          </div>
        ) : (
          <div className="space-y-3">
            {dailyQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Quests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-purple-400" />
          <h3 className="text-lg font-display font-bold text-white">Weekly Quests</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
        </div>

        {weeklyQuests.length === 0 ? (
          <div className="p-6 glass-light rounded-lg text-center text-gray-400 text-sm">
            No weekly quests available yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-3">
            {weeklyQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
