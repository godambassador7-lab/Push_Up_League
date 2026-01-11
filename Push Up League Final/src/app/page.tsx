'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RankBadge } from '@/components/RankBadge';
import { StreakDisplay } from '@/components/StreakDisplay';
import { StreakFlame } from '@/components/StreakFlame';
import { XPBar } from '@/components/XPBar';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutLoggerAdvanced } from '@/components/WorkoutLoggerAdvanced';
import { StatsPanel } from '@/components/StatsPanel';
import { AchievementsPanel } from '@/components/AchievementsPanel';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { QuestsPanel } from '@/components/QuestsPanel';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';
import { PushUpLeaderboard } from '@/components/PushUpLeaderboard';
import { OnboardingWithAuth } from '@/components/OnboardingWithAuth';
import { Login } from '@/components/Login';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { RANK_LADDER } from '@/lib/enhancedStore';
import { syncManager } from '@/lib/syncManager';
import { Calendar, Trophy, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { AchievementsPage } from '@/components/AchievementsPage';
import { IronMode } from '@/components/IronMode';
import { WorkoutTipPopup } from '@/components/WorkoutTipPopup';
import { getTipForWorkout, WorkoutTip } from '@/lib/workoutTips';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'leaderboard' | 'achievements' | 'iron-mode'>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [useAdvancedLogger, setUseAdvancedLogger] = useState(true);
  const [currentTip, setCurrentTip] = useState<WorkoutTip | null>(null);

  const isAuthenticated = useEnhancedStore((state) => state.isAuthenticated);
  const username = useEnhancedStore((state) => state.username);
  const currentRank = useEnhancedStore((state) => state.currentRank);
  const currentStreak = useEnhancedStore((state) => state.currentStreak);
  const longestStreak = useEnhancedStore((state) => state.longestStreak);
  const dailyGoal = useEnhancedStore((state) => state.dailyGoal);
  const proficiency = useEnhancedStore((state) => state.proficiency);
  const isWorldRecordCandidate = useEnhancedStore((state) => state.isWorldRecordCandidate);
  const workouts = useEnhancedStore((state) => state.workouts);
  const streakFreezes = useEnhancedStore((state) => state.streakFreezes);
  const getNextRankProgress = useEnhancedStore((state) => state.getNextRankProgress);
  const getStreakStatus = useEnhancedStore((state) => state.getStreakStatus);
  const getTodayWorkout = useEnhancedStore((state) => state.getTodayWorkout);

  const rankProgress = getNextRankProgress();
  const streakStatus = getStreakStatus();
  const nextRankData = currentRank < RANK_LADDER.length ? RANK_LADDER[currentRank] : null;
  const todayWorkout = getTodayWorkout();

  // Initialize sync manager on mount
  useEffect(() => {
    syncManager.initialize();
  }, []);

  // Listen for workout changes and show tip popup
  useEffect(() => {
    const unsubscribe = useEnhancedStore.subscribe(
      (state) => state.workouts.length,
      (workoutCount, prevWorkoutCount) => {
        // Show tip popup when a new workout is logged
        if (workoutCount > prevWorkoutCount) {
          const tip = getTipForWorkout(workoutCount);
          setCurrentTip(tip);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Show onboarding if not authenticated and no modal
  if (!isAuthenticated && !showAuthModal) {
    return (
      <div className="min-h-screen bg-dark relative flex items-center justify-center p-6">
        <div className="max-w-md w-full glass glass-border rounded-2xl p-8 text-center">
          <div className="font-display text-4xl font-bold text-accent mb-4">
            Push-Up League
          </div>
          <p className="text-gray-400 mb-8">
            Track your progress, compete globally, and build unstoppable discipline
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setShowAuthModal('register')}
              className="w-full py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
            >
              Create Account
            </button>
            <button
              onClick={() => setShowAuthModal('login')}
              className="w-full py-3 glass-light border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition uppercase tracking-wider font-display"
            >
              Log In
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-dark-border">
            <div className="text-xs text-gray-500">
              Continue as guest (data saved locally)
            </div>
            <button
              onClick={() => useEnhancedStore.setState({ isAuthenticated: true, username: 'Guest' })}
              className="mt-3 text-sm text-accent hover:text-accent-light transition"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show auth modals
  if (showAuthModal === 'register') {
    return <OnboardingWithAuth onSwitchToLogin={() => setShowAuthModal('login')} />;
  }

  if (showAuthModal === 'login') {
    return <Login onSwitchToRegister={() => setShowAuthModal('register')} />;
  }

  return (
    <div className="min-h-screen bg-dark relative">
      <Header />

      {/* Navigation Tabs */}
      <div className="glass-light border-b border-dark-border sticky top-[57px] sm:top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-2 sm:py-4 scrollbar-hide">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-display font-bold transition whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                activeView === 'dashboard'
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-display font-bold transition whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                activeView === 'calendar'
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 hover:text-white'
              }`}
            >
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
              Calendar
            </button>
            <button
              onClick={() => setActiveView('leaderboard')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-display font-bold transition whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                activeView === 'leaderboard'
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 hover:text-white'
              }`}
            >
              <Trophy size={16} className="sm:w-[18px] sm:h-[18px]" />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveView('achievements')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-display font-bold transition whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                activeView === 'achievements'
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 hover:text-white'
              }`}
            >
              <Award size={16} className="sm:w-[18px] sm:h-[18px]" />
              Achievements
            </button>
            <button
              onClick={() => setActiveView('iron-mode')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-display font-bold transition whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                activeView === 'iron-mode'
                  ? 'bg-gradient-to-r from-warning to-gold text-dark'
                  : 'glass-light text-warning hover:text-warning border border-warning/30'
              }`}
            >
              <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
              IRON MODE
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <>
          {/* Hero Section */}
          <section className="glass-light border-b border-dark-border py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-6">
              {/* Welcome Back */}
              <div className="text-center mb-8">
                <div className="text-sm sm:text-base text-gray-400 uppercase tracking-widest font-bold">Welcome Back</div>
              </div>

              {/* Centered Username */}
              <div className="text-center mb-12">
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-impact text-shadow-lg mb-4">
                  {username}
                </div>
                <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-bold text-shadow-lg">
                  Show up. Do the work. Earn the rank.
                </p>
                {isWorldRecordCandidate && (
                  <div className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-warning/30 to-gold/30 border-2 border-warning rounded-lg text-warning text-sm sm:text-base font-black text-hero animate-pulse-glow">
                    👑 WORLD RECORD CANDIDATE
                  </div>
                )}
              </div>

              {/* Rank and Goal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {/* Current Rank Card */}
                <div className="glass glass-border rounded-xl p-6 flex flex-col items-center">
                  <RankBadge rank={currentRank} size="lg" />
                  <div className="mt-6 space-y-2 text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Rank</div>
                    <div className="text-3xl sm:text-4xl font-black text-hero text-shadow-glow">
                      {RANK_LADDER[currentRank - 1].title}
                    </div>
                    {nextRankData && (
                      <div className="text-sm text-accent pt-2">
                        {rankProgress.percent}% to {nextRankData.title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Today's Goal Card */}
                <div className="glass glass-border rounded-xl p-6 border-2 hover:border-accent transition-all">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Target size={48} className={`mb-4 ${todayWorkout ? 'text-success drop-shadow-2xl' : 'text-gray-600'}`} strokeWidth={2.5} />
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Today's Goal</div>
                    <div className="text-4xl sm:text-5xl font-black text-hero text-accent text-shadow-glow">
                      {dailyGoal}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-300 mt-1">PUSH-UPS</div>
                    {todayWorkout && (
                      <div className="mt-4 pt-4 border-t border-dark-border w-full">
                        <div className="text-sm text-success">
                          ✓ {todayWorkout.pushups} completed today
                          {todayWorkout.pushups >= dailyGoal && ' • Goal achieved!'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Proficiency */}
              <div className="text-center mt-6">
                <div className="text-sm text-gray-500">
                  Proficiency: <span className="text-accent font-bold capitalize">{proficiency}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Compact Info Section */}
          <section className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Streak Card */}
              <div className="glass glass-border rounded-xl p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-display mb-4">Streak</div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-5xl font-black text-hero text-accent text-shadow-glow">{currentStreak}</div>
                    <div className="text-sm text-gray-400 mt-1">BEST {longestStreak}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <StreakFlame streak={currentStreak} isBroken={streakStatus.broken} size={64} />
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="glass glass-border rounded-xl p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-display mb-4">Quick Info</div>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Workouts Logged:</span>
                    <span className="font-bold text-xl">{workouts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Streak Freezes:</span>
                    <span className="font-bold text-xl">{streakFreezes}</span>
                  </div>
                  <div className="border-t border-dark-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Multiplier:</span>
                      <span className="text-accent font-bold text-xl">
                        {(() => {
                          const streak = currentStreak;
                          if (streak <= 3) return '1.0x';
                          if (streak <= 7) return '1.1x';
                          if (streak <= 14) return '1.25x';
                          if (streak <= 30) return '1.5x';
                          if (streak <= 60) return '1.75x';
                          return '2.0x';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Workout Logger Section */}
          <section className="max-w-6xl mx-auto px-6 pb-12">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-display font-bold">Log Workout</h3>
                <button
                  onClick={() => setUseAdvancedLogger(!useAdvancedLogger)}
                  className="text-sm px-4 py-2 glass-light rounded border border-accent/50 hover:bg-accent/10 transition text-accent active:scale-95"
                >
                  {useAdvancedLogger ? 'Simple Mode' : 'Advanced Mode'}
                </button>
              </div>
              {useAdvancedLogger ? <WorkoutLoggerAdvanced /> : <WorkoutLogger />}
            </div>
          </section>
        </>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 md:py-12">
          <WorkoutCalendar />
        </section>
      )}

      {/* Leaderboard View */}
      {activeView === 'leaderboard' && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 md:py-12">
          <PushUpLeaderboard />
        </section>
      )}

      {/* Achievements View */}
      {activeView === 'achievements' && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 md:py-12">
          <AchievementsPage />
        </section>
      )}

      {/* Iron Mode View */}
      {activeView === 'iron-mode' && (
        <IronMode onExit={() => setActiveView('dashboard')} />
      )}

      {/* Footer */}
      <footer className="border-t border-dark-border glass-light py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 text-center text-xs sm:text-sm text-gray-500">
          <p>Push-Up League • Discipline Over Motivation</p>
          <p className="mt-2">v2.0.0 BETA • Full Integration</p>
        </div>
      </footer>

      {/* Workout Tip Popup */}
      {currentTip && (
        <WorkoutTipPopup
          tip={currentTip}
          onClose={() => setCurrentTip(null)}
        />
      )}
    </div>
  );
}
