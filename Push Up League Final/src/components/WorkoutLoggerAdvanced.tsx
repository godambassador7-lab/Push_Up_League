'use client';

import { useState, useEffect } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { PUSHUP_TYPES, PushUpType } from '@/lib/pushupTypes';
import { WorkoutSet } from '@/lib/enhancedStore';
import { Plus, Minus, Coins, Trophy, X, ChevronDown } from 'lucide-react';
import { WorkoutSuccessModal } from './WorkoutSuccessModal';
import { SessionChallengeSelector } from './SessionChallengeSelector';
import { SessionChallenge, checkSessionChallengeCompletion, SessionWorkoutData } from '@/lib/sessionChallenges';

export const WorkoutLoggerAdvanced = () => {
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([
    { reps: 10, type: 'standard' as PushUpType }
  ]);
  const [dailyChallenge, setDailyChallenge] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastWorkoutData, setLastWorkoutData] = useState<any>(null);
  const [showTypeSelector, setShowTypeSelector] = useState<number | null>(null);
  const [selectedSessionChallenge, setSelectedSessionChallenge] = useState<SessionChallenge | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [completedSessionChallenges, setCompletedSessionChallenges] = useState<string[]>([]);

  const logWorkout = useEnhancedStore((state) => state.logWorkout);
  const getTodayWorkout = useEnhancedStore((state) => state.getTodayWorkout);
  const currentStreak = useEnhancedStore((state) => state.currentStreak);
  const dailyGoal = useEnhancedStore((state) => state.dailyGoal);

  const todayWorkout = getTodayWorkout();

  const addSet = () => {
    setWorkoutSets([...workoutSets, { reps: 10, type: 'standard' as PushUpType }]);
  };

  const removeSet = (index: number) => {
    if (workoutSets.length > 1) {
      setWorkoutSets(workoutSets.filter((_, i) => i !== index));
    }
  };

  const updateSetReps = (index: number, reps: number) => {
    const newSets = [...workoutSets];
    newSets[index].reps = Math.max(1, reps);
    setWorkoutSets(newSets);
  };

  const updateSetType = (index: number, type: PushUpType) => {
    const newSets = [...workoutSets];
    newSets[index].type = type;
    setWorkoutSets(newSets);
    setShowTypeSelector(null);
  };

  const getTotalPushups = () => {
    return workoutSets.reduce((total, set) => total + set.reps, 0);
  };

  const calculateEstimatedRewards = () => {
    const totalPushups = getTotalPushups();

    // Calculate average multipliers from all sets
    let totalXpMult = 0;
    let totalCoinMult = 0;
    for (const set of workoutSets) {
      const typeData = PUSHUP_TYPES[set.type];
      totalXpMult += typeData.xpMultiplier;
      totalCoinMult += typeData.coinMultiplier;
    }
    const avgXpMult = totalXpMult / workoutSets.length;
    const avgCoinMult = totalCoinMult / workoutSets.length;

    // XP Calculation
    const baseXP = totalPushups * avgXpMult;
    const setBonus = workoutSets.length > 1 ? workoutSets.length * 0.05 : 0;
    const challengeBonus = dailyChallenge ? 0.25 : 0;
    const estimatedXP = Math.min(Math.floor(baseXP * (1 + setBonus) * (1 + challengeBonus)), 500);

    // Coin Calculation
    const baseCoins = 10 + (workoutSets.length > 1 ? workoutSets.length * 2 : 0);
    const streakMult = currentStreak >= 30 ? 1.15 : currentStreak >= 14 ? 1.1 : currentStreak >= 7 ? 1.05 : 1.0;
    let coins = Math.floor(baseCoins * streakMult * avgCoinMult);

    const goalCompleted = totalPushups >= dailyGoal;
    if (goalCompleted) coins += 20;
    if (currentStreak > 1) coins += 5;

    return { estimatedXP, estimatedCoins: coins, goalCompleted };
  };

  const handleSubmit = () => {
    const totalPushups = getTotalPushups();
    let { estimatedXP, estimatedCoins, goalCompleted } = calculateEstimatedRewards();

    // Check session challenge completion
    let sessionChallengeCompleted = false;
    let sessionChallengeReward = { xp: 0, coins: 0 };

    if (selectedSessionChallenge && workoutStartTime) {
      const endTime = Date.now();
      const sessionDuration = (endTime - workoutStartTime) / 1000 / 60; // minutes

      const sessionData: SessionWorkoutData = {
        totalPushups,
        sets: workoutSets.map(s => ({ reps: s.reps, type: s.type, restAfter: s.restAfter })),
        sessionDuration,
        startTime: workoutStartTime,
        endTime,
      };

      const result = checkSessionChallengeCompletion(selectedSessionChallenge.id, sessionData);
      sessionChallengeCompleted = result.completed;

      if (sessionChallengeCompleted && result.challenge) {
        sessionChallengeReward = {
          xp: result.challenge.xpReward,
          coins: result.challenge.coinReward,
        };
        estimatedXP += sessionChallengeReward.xp;
        estimatedCoins += sessionChallengeReward.coins;

        // Add to completed challenges for today
        setCompletedSessionChallenges([...completedSessionChallenges, selectedSessionChallenge.id]);
      }
    }

    const sessionDurationMinutes = workoutStartTime ? (Date.now() - workoutStartTime) / 1000 / 60 : undefined;
    logWorkout(totalPushups, workoutSets, dailyChallenge, sessionDurationMinutes);

    setLastWorkoutData({
      pushups: totalPushups,
      xpEarned: estimatedXP,
      coinsEarned: estimatedCoins,
      goalCompleted,
      streakDay: currentStreak,
      sessionChallengeCompleted,
      sessionChallengeName: selectedSessionChallenge?.name,
      sessionChallengeReward,
    });

    setWorkoutSets([{ reps: 10, type: 'standard' as PushUpType }]);
    setDailyChallenge(false);
    setSelectedSessionChallenge(null);
    setWorkoutStartTime(null);
    setShowSuccessModal(true);
  };

  if (todayWorkout && !showSuccessModal) {
    return (
      <div className="p-4 sm:p-6 rounded-lg glass glass-border">
        <div className="text-center space-y-2">
          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-display">Today's Workout</div>
          <div className="text-2xl sm:text-3xl font-bold text-accent">{todayWorkout.pushups}</div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
            <span className="text-gray-400">XP: <span className="text-electric-blue font-bold">+{todayWorkout.xpEarned}</span></span>
            <span className="text-gray-400">Coins: <span className="text-warning font-bold">+{todayWorkout.coinsEarned || 0}</span></span>
          </div>
        </div>
      </div>
    );
  }

  const { estimatedXP, estimatedCoins } = calculateEstimatedRewards();
  const totalPushups = getTotalPushups();

  return (
    <>
      {showSuccessModal && lastWorkoutData && (
        <WorkoutSuccessModal
          onClose={() => setShowSuccessModal(false)}
          {...lastWorkoutData}
        />
      )}

      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 rounded-lg glass-border glass overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-display">Workout Sets</label>
          <div className="text-xs text-gray-500">
            Total: <span className="text-accent font-bold">{totalPushups}</span> push-ups
          </div>
        </div>

        {/* Sets */}
        <div className="space-y-3 overflow-visible">
          {workoutSets.map((set, index) => {
            const typeData = PUSHUP_TYPES[set.type];
            const isTypeSelectorOpen = showTypeSelector === index;
            const difficultyColors = {
              beginner: 'text-green-400 border-green-400/50',
              intermediate: 'text-blue-400 border-blue-400/50',
              advanced: 'text-purple-400 border-purple-400/50',
              elite: 'text-warning border-warning/50',
            };

            return (
              <div
                key={index}
                className={`p-3 sm:p-4 glass-light rounded-lg border border-dark-border overflow-visible relative ${isTypeSelectorOpen ? 'z-30' : 'z-0'}`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Set Number */}
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass flex items-center justify-center font-bold text-accent text-sm sm:text-base">
                    {index + 1}
                  </div>

                  {/* Reps Input */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => updateSetReps(index, set.reps - 5)}
                      className="p-1 sm:p-1.5 glass-light rounded hover:bg-accent/20 transition active:scale-95"
                    >
                      <Minus size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSetReps(index, parseInt(e.target.value) || 1)}
                      className="w-12 sm:w-16 glass-light border border-dark-border rounded px-1 sm:px-2 py-1 text-center font-bold text-white outline-none focus:border-accent text-sm sm:text-base"
                    />
                    <button
                      onClick={() => updateSetReps(index, set.reps + 5)}
                      className="p-1 sm:p-1.5 glass-light rounded hover:bg-accent/20 transition active:scale-95"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Type Selector */}
                  <div className="flex-1 relative min-w-0 overflow-visible">
                    <button
                      onClick={() => setShowTypeSelector(showTypeSelector === index ? null : index)}
                      className={`w-full p-2 glass-light rounded border ${difficultyColors[typeData.difficulty]} flex items-center justify-between hover:bg-accent/10 transition text-xs sm:text-sm active:scale-98`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="font-bold truncate">{typeData.name}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <span className="text-xs opacity-75">{typeData.xpMultiplier}x</span>
                        <ChevronDown size={14} className={`sm:w-4 sm:h-4 transition ${showTypeSelector === index ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Dropdown */}
                    {isTypeSelectorOpen && (
                      <div className="absolute z-[9999] mt-2 w-full glass border border-accent rounded-lg shadow-xl max-h-64 overflow-y-auto left-0">
                        {Object.values(PUSHUP_TYPES).map((type) => (
                          <button
                            key={type.id}
                            onClick={() => updateSetType(index, type.id)}
                            className={`w-full p-3 text-left hover:bg-accent/20 transition border-b border-dark-border last:border-b-0 ${
                              set.type === type.id ? 'bg-accent/10' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-bold text-sm">{type.name}</div>
                                  <div className="text-xs text-gray-400 capitalize">{type.difficulty}</div>
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="text-electric-blue font-bold">{type.xpMultiplier}x XP</div>
                                <div className="text-warning font-bold">{type.coinMultiplier}x Coins</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  {workoutSets.length > 1 && (
                    <button
                      onClick={() => removeSet(index)}
                      className="p-1 sm:p-1.5 glass-light rounded hover:bg-red-500/20 transition text-red-400 active:scale-95 flex-shrink-0"
                    >
                      <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Set Button */}
        <button
          onClick={addSet}
          className="w-full p-2.5 sm:p-3 glass-light rounded-lg border border-dashed border-accent/50 hover:border-accent hover:bg-accent/10 transition text-accent font-bold flex items-center justify-center gap-2 text-sm sm:text-base active:scale-98"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          Add Another Set
        </button>

        {/* Daily Challenge */}
        <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 glass-light rounded cursor-pointer hover:bg-accent/10 transition active:scale-98">
          <input
            type="checkbox"
            checked={dailyChallenge}
            onChange={(e) => setDailyChallenge(e.target.checked)}
            className="w-4 h-4 rounded flex-shrink-0"
          />
          <span className="text-xs sm:text-sm">Daily Challenge Completed (+25% XP)</span>
        </label>

        {/* Session Challenge Selector */}
        <SessionChallengeSelector
          totalPushups={totalPushups}
          completedChallengeIds={completedSessionChallenges}
          onSelectChallenge={(challenge) => {
            setSelectedSessionChallenge(challenge);
            if (challenge && !workoutStartTime) {
              setWorkoutStartTime(Date.now());
            }
          }}
          selectedChallenge={selectedSessionChallenge}
        />

        {/* Estimated Rewards */}
        <div className="glass-light rounded-lg border border-dark-border p-3 sm:p-4">
          <div className="text-gray-400 uppercase tracking-wider mb-2 sm:mb-3 text-xs font-bold">Estimated Rewards</div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-2 sm:p-3 glass-light rounded">
              <Trophy size={18} className="sm:w-5 sm:h-5 mx-auto text-electric-blue mb-1 sm:mb-2" />
              <div className="text-electric-blue font-bold text-base sm:text-lg">~{estimatedXP} XP</div>
              <div className="text-gray-500 text-xs">Experience</div>
            </div>
            <div className="text-center p-2 sm:p-3 glass-light rounded">
              <Coins size={18} className="sm:w-5 sm:h-5 mx-auto text-warning mb-1 sm:mb-2" />
              <div className="text-warning font-bold text-base sm:text-lg">~{estimatedCoins}</div>
              <div className="text-gray-500 text-xs">Coins</div>
            </div>
          </div>

          {/* Multiplier Info */}
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dark-border text-xs space-y-1 text-gray-400">
            <div className="flex justify-between">
              <span>Sets Bonus:</span>
              <span className="text-white font-bold">+{workoutSets.length > 1 ? (workoutSets.length * 5) : 0}% XP</span>
            </div>
            <div className="flex justify-between">
              <span>Streak Multiplier:</span>
              <span className="text-accent font-bold">
                {currentStreak >= 30 ? '1.15x' : currentStreak >= 14 ? '1.1x' : currentStreak >= 7 ? '1.05x' : '1.0x'}
              </span>
            </div>
            {dailyChallenge && (
              <div className="flex justify-between">
                <span>Challenge Bonus:</span>
                <span className="text-accent font-bold">+25% XP</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display text-sm sm:text-base active:scale-98"
        >
          Log Workout
        </button>
      </div>
    </>
  );
};
