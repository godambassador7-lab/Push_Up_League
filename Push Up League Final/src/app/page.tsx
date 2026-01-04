'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { RankBadge } from '@/components/RankBadge';
import { StreakDisplay } from '@/components/StreakDisplay';
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
import { Calendar, Trophy, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { AchievementsPage } from '@/components/AchievementsPage';
import { IronMode } from '@/components/IronMode';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'leaderboard' | 'achievements' | 'iron-mode'>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [useAdvancedLogger, setUseAdvancedLogger] = useState(true);

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
          <section className="glass-light border-b border-dark-border py-6 sm:py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-start">
                {/* Rank Card */}
                <div className="flex flex-col items-center text-center md:col-span-1">
                  <RankBadge rank={currentRank} size="lg" />
                  <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Rank</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-hero text-shadow-glow">{RANK_LADDER[currentRank - 1].title}</div>
                    {nextRankData && (
                      <div className="text-xs sm:text-sm text-accent pt-1 sm:pt-2">
                        {rankProgress.percent}% to {nextRankData.title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Welcome Back</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-impact mt-1 sm:mt-2 text-shadow-lg">{username}</div>
                    {isWorldRecordCandidate && (
                      <div className="mt-2 sm:mt-3 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-warning/30 to-gold/30 border-2 border-warning rounded-lg text-warning text-xs sm:text-sm font-black text-hero animate-pulse-glow">
                        👑 WORLD RECORD CANDIDATE
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-base sm:text-lg md:text-xl font-bold leading-relaxed text-shadow-lg">
                    Show up. Do the work. Earn the rank.
                  </p>

                  {/* Daily Goal Card */}
                  <div className="glass glass-border rounded-lg p-3 sm:p-4 md:p-5 border-2 hover:border-accent transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Today's Goal</div>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-hero text-accent text-shadow-glow">{dailyGoal} <span className="text-base sm:text-xl md:text-2xl">PUSH-UPS</span></div>
                      </div>
                      <Target size={28} className={`sm:w-[32px] sm:h-[32px] md:w-[40px] md:h-[40px] ${todayWorkout ? 'text-success drop-shadow-2xl' : 'text-gray-600'}`} strokeWidth={2.5} />
                    </div>
                    {todayWorkout && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dark-border">
                        <div className="text-xs sm:text-sm text-success">
                          ✓ {todayWorkout.pushups} completed today
                          {todayWorkout.pushups >= dailyGoal && ' • Goal achieved!'}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Proficiency: <span className="text-accent font-bold capitalize">{proficiency}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Left Column - Primary Actions */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                {/* Streak Display */}
                <StreakDisplay
                  days={currentStreak}
                  isBroken={streakStatus.broken}
                  maxStreak={longestStreak}
                />

                {/* XP Progress */}
                <div className="p-4 sm:p-6 rounded-lg glass glass-border">
                  <XPBar
                    current={rankProgress.current}
                    required={rankProgress.required}
                    percent={rankProgress.percent}
                    currentRank={currentRank}
                  />
                </div>

                {/* Workout Logger */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-display font-bold">Log Workout</h3>
                    <button
                      onClick={() => setUseAdvancedLogger(!useAdvancedLogger)}
                      className="text-xs px-2 sm:px-3 py-1 glass-light rounded border border-accent/50 hover:bg-accent/10 transition text-accent active:scale-95 whitespace-nowrap flex-shrink-0"
                    >
                      {useAdvancedLogger ? 'Simple Mode' : 'Advanced Mode'}
                    </button>
                  </div>
                  {useAdvancedLogger ? <WorkoutLoggerAdvanced /> : <WorkoutLogger />}
                </div>

                {/* Stats Grid */}
                <StatsPanel />
              </div>

              {/* Right Column - Secondary Information */}
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Stats */}
                <div className="p-4 sm:p-6 rounded-lg glass glass-border space-y-3 sm:space-y-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-display">Quick Info</div>
                  <div className="space-y-2 sm:space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Workouts Logged</span>
                      <span className="font-bold">{workouts.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Streak Freezes</span>
                      <span className="font-bold">{streakFreezes}</span>
                    </div>
                    <div className="border-t border-dark-border pt-2 sm:pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Multiplier</span>
                        <span className="text-accent font-bold">
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

                {/* Quests */}
                <QuestsPanel />

                {/* Achievements */}
                <AchievementsPanel />

                {/* Recent Workouts */}
                <WorkoutHistory />
              </div>
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
    </div>
  );
}
