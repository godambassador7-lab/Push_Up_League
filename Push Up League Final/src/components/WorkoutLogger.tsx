'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { formatLocalDate } from '@/lib/date';
import { Plus, Minus, Coins, Lock, CheckCircle } from 'lucide-react';
import { WorkoutSuccessModal } from './WorkoutSuccessModal';
import { WaiverModal } from './WaiverModal';

export const WorkoutLogger = () => {
  const [pushups, setPushups] = useState(10);
  const [sets, setSets] = useState(1);
  const [dailyChallenge, setDailyChallenge] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastWorkoutData, setLastWorkoutData] = useState<any>(null);
  const [showWaiverModal, setShowWaiverModal] = useState(false);

  const logWorkout = useEnhancedStore((state) => state.logWorkout);
  const getTodayWorkout = useEnhancedStore((state) => state.getTodayWorkout);
  const currentStreak = useEnhancedStore((state) => state.currentStreak);
  const dailyGoal = useEnhancedStore((state) => state.dailyGoal);
  const waiverAccepted = useEnhancedStore((state) => state.waiverAccepted);
  const lockDay = useEnhancedStore((state) => state.lockDay);
  const isDayLocked = useEnhancedStore((state) => state.isDayLocked);

  const todayWorkout = getTodayWorkout();
  const today = formatLocalDate();
  const isLocked = isDayLocked(today);

  const handleSubmit = () => {
    // Check if waiver is accepted
    if (!waiverAccepted) {
      setShowWaiverModal(true);
      return;
    }

    // Calculate expected rewards (simplified - actual calc in store)
    const totalPushups = pushups * sets;
    const baseCoins = 10 + (sets > 1 ? sets * 2 : 0);
    const streakMult = currentStreak >= 30 ? 1.15 : currentStreak >= 14 ? 1.1 : currentStreak >= 7 ? 1.05 : 1.0;
    const estimatedCoins = Math.floor(baseCoins * streakMult) + (totalPushups >= dailyGoal ? 20 : 0) + (currentStreak > 1 ? 5 : 0);

    const baseXP = totalPushups * (1 + (sets > 1 ? sets * 0.05 : 0));
    const estimatedXP = Math.min(Math.floor(baseXP * (dailyChallenge ? 1.25 : 1)), 500);

    const workoutSets = Array.from({ length: sets }, () => ({
      reps: pushups,
      type: 'standard' as const,
    }));
    const result = logWorkout(totalPushups, workoutSets, dailyChallenge);
    if (!result.success) return;

    setLastWorkoutData({
      pushups: totalPushups,
      xpEarned: estimatedXP,
      coinsEarned: estimatedCoins,
      goalCompleted: totalPushups >= dailyGoal,
      streakDay: currentStreak,
    });

    setPushups(10);
    setSets(1);
    setDailyChallenge(false);
    setShowSuccessModal(true);
  };

  if (todayWorkout && !showSuccessModal) {
    return (
      <div className="p-6 rounded-lg glass glass-border">
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-400 uppercase tracking-wider font-display">Today's Workout</div>
          <div className="text-3xl font-bold text-accent">{todayWorkout.pushups}</div>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm">
            <span className="text-gray-400">XP: <span className="text-electric-blue font-bold">+{todayWorkout.xpEarned}</span></span>
            <span className="text-gray-400">Coins: <span className="text-warning font-bold">+{todayWorkout.coinsEarned || 0}</span></span>
          </div>
          {isLocked ? (
            <div className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-success/70 bg-success/10 px-4 py-2 text-sm font-bold text-success">
              <CheckCircle size={16} />
              Day locked
            </div>
          ) : (
            <button
              type="button"
              onClick={() => lockDay(today)}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-warning/60 px-4 text-sm font-bold uppercase tracking-wider text-warning transition hover:bg-warning/10"
            >
              <Lock size={16} />
              Lock Today
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {showSuccessModal && lastWorkoutData && (
        <WorkoutSuccessModal
          onClose={() => setShowSuccessModal(false)}
          {...lastWorkoutData}
        />
      )}

      <div className="space-y-6 p-4 sm:p-6 rounded-lg glass-border glass overflow-hidden">
      <div>
        <label className="text-sm text-gray-400 uppercase tracking-wider font-display">Push-ups</label>
        <div className="flex items-center gap-2 sm:gap-4 mt-3 min-w-0">
          <button
            onClick={() => setPushups(Math.max(1, pushups - 5))}
            className="p-2 glass-light rounded hover:bg-accent/20 transition shrink-0"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={pushups}
            onChange={(e) => setPushups(parseInt(e.target.value) || 1)}
            className="min-w-0 flex-1 glass-light border border-dark-border rounded px-3 sm:px-4 py-2 text-center text-lg font-bold text-white outline-none focus:border-accent"
          />
          <button
            onClick={() => setPushups(pushups + 5)}
            className="p-2 glass-light rounded hover:bg-accent/20 transition shrink-0"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 uppercase tracking-wider font-display">Sets</label>
        <div className="flex items-center gap-2 sm:gap-4 mt-3 min-w-0">
          <button
            onClick={() => setSets(Math.max(1, sets - 1))}
            className="p-2 glass-light rounded hover:bg-accent/20 transition shrink-0"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(parseInt(e.target.value) || 1)}
            className="min-w-0 flex-1 glass-light border border-dark-border rounded px-3 sm:px-4 py-2 text-center text-lg font-bold text-white outline-none focus:border-accent"
          />
          <button
            onClick={() => setSets(sets + 1)}
            className="p-2 glass-light rounded hover:bg-accent/20 transition shrink-0"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">+5% XP per set</div>
      </div>

      <label className="flex items-center gap-3 p-3 glass-light rounded cursor-pointer hover:bg-accent/10 transition">
        <input
          type="checkbox"
          checked={dailyChallenge}
          onChange={(e) => setDailyChallenge(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm">Daily Challenge Completed (+25% XP)</span>
      </label>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
      >
        Log Workout
      </button>

      {/* Estimated Rewards Preview */}
      <div className="glass-light rounded-lg border border-dark-border p-3 text-xs">
        <div className="text-gray-400 uppercase tracking-wider mb-2">Estimated Rewards</div>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-electric-blue font-bold">~{Math.min(Math.floor(pushups * (1 + (sets > 1 ? sets * 0.05 : 0))), 500)} XP</div>
            <div className="text-gray-500 text-xs">Experience</div>
          </div>
          <div className="w-px h-8 bg-dark-border"></div>
          <div className="text-center">
            <div className="text-warning font-bold flex items-center gap-1 justify-center">
              <Coins size={12} />
              ~{10 + (sets > 1 ? sets * 2 : 0) + (pushups >= dailyGoal ? 20 : 0)}
            </div>
            <div className="text-gray-500 text-xs">Coins + Bonuses</div>
          </div>
        </div>
      </div>

      {/* Waiver Modal */}
      <WaiverModal isOpen={showWaiverModal} onClose={() => setShowWaiverModal(false)} />
    </div>
    </>
  );
};
