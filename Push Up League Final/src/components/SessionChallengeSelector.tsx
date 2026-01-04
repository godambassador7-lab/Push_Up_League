'use client';

import { useState } from 'react';
import { SessionChallenge, getAvailableSessionChallenges } from '@/lib/sessionChallenges';
import { Trophy, Clock, Zap, Target, X } from 'lucide-react';

interface SessionChallengeSelectorProps {
  totalPushups: number;
  completedChallengeIds: string[];
  onSelectChallenge: (challenge: SessionChallenge | null) => void;
  selectedChallenge: SessionChallenge | null;
}

export const SessionChallengeSelector = ({
  totalPushups,
  completedChallengeIds,
  onSelectChallenge,
  selectedChallenge,
}: SessionChallengeSelectorProps) => {
  const [showSelector, setShowSelector] = useState(false);

  const availableChallenges = getAvailableSessionChallenges(totalPushups, completedChallengeIds);

  const handleSelect = (challenge: SessionChallenge) => {
    onSelectChallenge(challenge);
    setShowSelector(false);
  };

  const handleDeselect = () => {
    onSelectChallenge(null);
  };

  if (selectedChallenge && !showSelector) {
    return (
      <div className="p-4 glass border-2 border-accent rounded-lg">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedChallenge.icon}</span>
            <div>
              <h4 className="font-display font-bold text-accent">{selectedChallenge.name}</h4>
              <p className="text-xs text-gray-400">{selectedChallenge.description}</p>
            </div>
          </div>
          <button
            onClick={handleDeselect}
            className="p-1 glass-light rounded hover:bg-red-500/20 text-red-400"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Trophy size={14} className="text-electric-blue" />
            <span className="text-electric-blue font-bold">+{selectedChallenge.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={14} className="text-warning" />
            <span className="text-warning font-bold">+{selectedChallenge.coinReward} Coins</span>
          </div>
        </div>

        <div className="mt-3 p-2 glass-light rounded text-xs text-accent">
          💪 Challenge Active! Complete your workout to earn bonus rewards.
        </div>
      </div>
    );
  }

  return (
    <div>
      {!showSelector ? (
        <button
          onClick={() => setShowSelector(true)}
          className="w-full p-3 glass-light rounded-lg border border-dashed border-purple-400/50 hover:border-purple-400 hover:bg-purple-400/10 transition text-purple-400 font-bold flex items-center justify-center gap-2"
        >
          <Target size={18} />
          Add Session Challenge
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-white">Select Session Challenge</h4>
            <button
              onClick={() => setShowSelector(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {availableChallenges.length === 0 ? (
            <div className="p-6 glass-light rounded-lg text-center text-gray-400 text-sm">
              No challenges available for this workout size.
              <div className="text-xs mt-2">Try adding more sets or reps!</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableChallenges.map((challenge) => {
                const typeIcons = {
                  time_limit: <Clock size={16} className="text-electric-blue" />,
                  max_rest: <Zap size={16} className="text-warning" />,
                  ladder: <Target size={16} className="text-purple-400" />,
                  pyramid: <Target size={16} className="text-purple-400" />,
                  emom: <Clock size={16} className="text-electric-blue" />,
                  tabata: <Zap size={16} className="text-warning" />,
                  endurance: <Trophy size={16} className="text-accent" />,
                };

                const typeColors = {
                  time_limit: 'border-electric-blue/30',
                  max_rest: 'border-warning/30',
                  ladder: 'border-purple-400/30',
                  pyramid: 'border-purple-400/30',
                  emom: 'border-electric-blue/30',
                  tabata: 'border-warning/30',
                  endurance: 'border-accent/30',
                };

                return (
                  <button
                    key={challenge.id}
                    onClick={() => handleSelect(challenge)}
                    className={`w-full p-3 glass-light rounded-lg border ${typeColors[challenge.type]} hover:bg-accent/10 transition text-left`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{challenge.icon}</span>
                        <div>
                          <h5 className="font-bold text-sm text-white">{challenge.name}</h5>
                          <p className="text-xs text-gray-400">{challenge.description}</p>
                        </div>
                      </div>
                      {typeIcons[challenge.type]}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Trophy size={12} className="text-electric-blue" />
                          <span className="text-electric-blue font-bold">+{challenge.xpReward}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy size={12} className="text-warning" />
                          <span className="text-warning font-bold">+{challenge.coinReward}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 capitalize">
                        {challenge.type.replace('_', ' ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
