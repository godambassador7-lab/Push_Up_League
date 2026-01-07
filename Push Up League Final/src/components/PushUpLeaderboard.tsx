'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';
import { getStandardLeaderboard, getWorldRecordLeaderboard } from '@/lib/firebase';
import { TITLE_CATALOG, getCategoryColor, getCategoryGlowClass } from '@/lib/titleShop';
import { useEnhancedStore } from '@/lib/enhancedStore';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  totalPushups: number;
  totalXp: number;
  currentStreak: number;
  currentRank: number;
  rankTitle: string;
  isWorldRecord?: boolean;
}

type LeaderboardTab = 'push-up' | 'world-record';

export const PushUpLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('push-up');
  const [pushUpLeaders, setPushUpLeaders] = useState<LeaderboardEntry[]>([]);
  const [worldRecordLeaders, setWorldRecordLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  const isAuthenticated = useEnhancedStore((state) => state.isAuthenticated);
  const userId = useEnhancedStore((state) => state.userId);
  const username = useEnhancedStore((state) => state.username);
  const totalXp = useEnhancedStore((state) => state.totalXp);
  const currentStreak = useEnhancedStore((state) => state.currentStreak);
  const currentRank = useEnhancedStore((state) => state.currentRank);
  const workouts = useEnhancedStore((state) => state.workouts);
  const isWorldRecordCandidate = useEnhancedStore((state) => state.isWorldRecordCandidate);
  const activeTitle = useEnhancedStore((state) => state.activeTitle);
  const activeTitleData = activeTitle ? TITLE_CATALOG.find(t => t.id === activeTitle) : null;
  const activeTitleClass = activeTitleData ? getCategoryColor(activeTitleData.category) : '';
  const activeTitleGlow = activeTitleData ? getCategoryGlowClass(activeTitleData.category) : '';

  const RANK_TITLES = ['', 'Initiate', 'Iron Hand', 'Vanguard', 'Centurion', 'Titan', 'Ascendant', 'Mythic', 'Immortal'];

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    setLoading(true);

    try {
      // Try to load from Firebase
      const [standardData, worldRecordData] = await Promise.all([
        getStandardLeaderboard(100),
        getWorldRecordLeaderboard(50),
      ]);

      if (standardData.length > 0) {
        // Firebase data available
        const formattedStandard = standardData.map((entry: any, index: number) => ({
          rank: index + 1,
          userId: entry.userId || `user-${index}`,
          username: entry.username,
          totalPushups: entry.totalPushups || 0,
          totalXp: entry.totalXp,
          currentStreak: entry.currentStreak,
          currentRank: entry.currentRank,
          rankTitle: RANK_TITLES[entry.currentRank] || 'Initiate',
        }));
        setPushUpLeaders(formattedStandard);
      } else {
        // Use mock data for development
        setPushUpLeaders(getMockLeaderboard('standard'));
      }

      if (worldRecordData.length > 0) {
        const formattedWorldRecord = worldRecordData.map((entry: any, index: number) => ({
          rank: index + 1,
          userId: entry.userId || `wr-${index}`,
          username: entry.username,
          totalPushups: entry.totalPushups || 0,
          totalXp: entry.totalXp,
          currentStreak: entry.currentStreak,
          currentRank: entry.currentRank,
          rankTitle: RANK_TITLES[entry.currentRank] || 'Immortal',
          isWorldRecord: true,
        }));
        setWorldRecordLeaders(formattedWorldRecord);
      } else {
        setWorldRecordLeaders(getMockLeaderboard('world-record'));
      }

      // Add current user to leaderboard if not already there
      if (isAuthenticated) {
        addCurrentUserToLeaderboard();
      }
    } catch (error) {
      console.error('Error loading leaderboards:', error);
      // Fall back to mock data
      setPushUpLeaders(getMockLeaderboard('standard'));
      setWorldRecordLeaders(getMockLeaderboard('world-record'));
    }

    setLoading(false);
  };

  const addCurrentUserToLeaderboard = () => {
    const totalPushups = workouts.reduce((sum, w) => sum + w.pushups, 0);
    const currentUser: LeaderboardEntry = {
      rank: 0,
      userId,
      username,
      totalPushups,
      totalXp,
      currentStreak,
      currentRank,
      rankTitle: RANK_TITLES[currentRank] || 'Initiate',
      isWorldRecord: isWorldRecordCandidate,
    };

    if (isWorldRecordCandidate) {
      // Add to world record leaderboard
      const updatedLeaders = [...worldRecordLeaders, currentUser]
        .sort((a, b) => b.totalPushups - a.totalPushups)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setWorldRecordLeaders(updatedLeaders);

      const myRank = updatedLeaders.findIndex(e => e.userId === userId) + 1;
      setUserRank(myRank);
    } else {
      // Add to standard leaderboard
      const updatedLeaders = [...pushUpLeaders, currentUser]
        .sort((a, b) => b.totalPushups - a.totalPushups)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setPushUpLeaders(updatedLeaders);

      const myRank = updatedLeaders.findIndex(e => e.userId === userId) + 1;
      setUserRank(myRank);
    }
  };

  const getMockLeaderboard = (type: 'standard' | 'world-record'): LeaderboardEntry[] => {
    if (type === 'standard') {
      return [
        { rank: 1, userId: 'u1', username: 'IronWarrior', totalPushups: 15420, totalXp: 2500, currentStreak: 45, currentRank: 7, rankTitle: 'Mythic' },
        { rank: 2, userId: 'u2', username: 'FitnessBeast', totalPushups: 13200, totalXp: 2300, currentStreak: 32, currentRank: 6, rankTitle: 'Ascendant' },
        { rank: 3, userId: 'u3', username: 'PushUpKing', totalPushups: 11850, totalXp: 2100, currentStreak: 28, currentRank: 5, rankTitle: 'Titan' },
        { rank: 4, userId: 'u4', username: 'GymRat420', totalPushups: 9975, totalXp: 1950, currentStreak: 21, currentRank: 5, rankTitle: 'Titan' },
        { rank: 5, userId: 'u5', username: 'CoreChamp', totalPushups: 8640, totalXp: 1800, currentStreak: 18, currentRank: 4, rankTitle: 'Centurion' },
        { rank: 6, userId: 'u6', username: 'DailyGrinder', totalPushups: 7200, totalXp: 1650, currentStreak: 42, currentRank: 4, rankTitle: 'Centurion' },
        { rank: 7, userId: 'u7', username: 'AthleteX', totalPushups: 6300, totalXp: 1500, currentStreak: 15, currentRank: 3, rankTitle: 'Vanguard' },
        { rank: 8, userId: 'u8', username: 'PushPro', totalPushups: 5550, totalXp: 1350, currentStreak: 12, currentRank: 3, rankTitle: 'Vanguard' },
        { rank: 9, userId: 'u9', username: 'StreakMaster', totalPushups: 4800, totalXp: 1200, currentStreak: 60, currentRank: 2, rankTitle: 'Iron Hand' },
        { rank: 10, userId: 'u10', username: 'BeginnerBoss', totalPushups: 3900, totalXp: 1000, currentStreak: 8, currentRank: 2, rankTitle: 'Iron Hand' },
      ];
    } else {
      return [
        { rank: 1, userId: 'wr1', username: 'WorldChampion2024', totalPushups: 185000, totalXp: 35000, currentStreak: 90, currentRank: 8, rankTitle: 'Immortal', isWorldRecord: true },
        { rank: 2, userId: 'wr2', username: 'RecordBreaker', totalPushups: 142000, totalXp: 28000, currentStreak: 75, currentRank: 8, rankTitle: 'Immortal', isWorldRecord: true },
        { rank: 3, userId: 'wr3', username: 'EliteAthlete', totalPushups: 98000, totalXp: 22000, currentStreak: 60, currentRank: 7, rankTitle: 'Mythic', isWorldRecord: true },
      ];
    }
  };

  const leaders = activeTab === 'push-up' ? pushUpLeaders : worldRecordLeaders;
  const isCurrentUserTab = activeTab === 'push-up' ? !isWorldRecordCandidate : isWorldRecordCandidate;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('push-up')}
          className={`flex-1 py-3 px-4 rounded-lg font-display font-bold transition ${
            activeTab === 'push-up'
              ? 'glass-border bg-accent/10 text-accent'
              : 'glass-light text-gray-400 hover:text-white'
          }`}
        >
          <Trophy size={18} className="inline mr-2" />
          Push Up Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('world-record')}
          className={`flex-1 py-3 px-4 rounded-lg font-display font-bold transition ${
            activeTab === 'world-record'
              ? 'glass-border bg-warning/10 text-warning border-warning'
              : 'glass-light text-gray-400 hover:text-white'
          }`}
        >
          <Crown size={18} className="inline mr-2" />
          World Record Leaders
        </button>
      </div>

      {/* Info Banner */}
      <div className="glass glass-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-accent" size={24} />
          <div>
            <div className="font-bold text-white">
              {activeTab === 'push-up' ? 'Compete with Athletes Worldwide' : 'Elite World-Class Territory'}
            </div>
            <div className="text-sm text-gray-400">
              {activeTab === 'push-up'
                ? 'Rankings based on total push-ups completed. Keep grinding to climb!'
                : 'World-class performers with exceptional daily capacity and world record potential.'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass glass-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-dark-border bg-gradient-to-r from-accent/5 to-transparent">
          <div className="font-display text-xl font-bold flex items-center justify-between">
            <span>
              {activeTab === 'push-up' ? 'Top Athletes' : 'Elite Champions'}
            </span>
            <span className="text-sm text-gray-400 font-normal">
              {loading ? 'Loading...' : `${leaders.length} athletes`}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="animate-pulse">Loading leaderboard...</div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="mx-auto text-gray-600 mb-4" size={48} />
            <div className="text-gray-400">No athletes yet. Be the first!</div>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {leaders.slice(0, 50).map((entry) => {
              const isCurrentUser = entry.userId === userId;

              return (
                <div
                  key={entry.userId}
                  className={`p-4 flex items-center justify-between transition ${
                    isCurrentUser
                      ? 'bg-accent/10 border-l-4 border-accent'
                      : 'hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg flex-shrink-0 ${
                        entry.rank === 1
                          ? 'bg-gradient-to-br from-gold to-yellow-600 text-dark shadow-lg shadow-gold/50'
                          : entry.rank === 2
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-dark shadow-lg shadow-gray-400/50'
                          : entry.rank === 3
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-dark shadow-lg shadow-orange-500/50'
                          : 'glass-light text-accent border border-dark-border'
                      }`}
                    >
                      {entry.rank <= 3 ? (
                        entry.rank === 1 ? '🏆' : entry.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        entry.rank
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white flex items-center gap-2 truncate">
                        {entry.username}
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">YOU</span>
                        )}
                        {isCurrentUser && activeTitleData && (
                          <span className={`text-xs px-2 py-0.5 rounded border ${activeTitleClass} ${activeTitleGlow}`}>
                            {activeTitleData.name}
                          </span>
                        )}
                        {entry.isWorldRecord && (
                          <Crown size={16} className="text-warning flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Medal size={14} className="text-accent" />
                          {entry.rankTitle}
                        </span>
                        <span>•</span>
                        <span>{entry.currentStreak} day streak</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent font-display">
                        {entry.totalPushups.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">total push-ups</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.totalXp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Your Rank Card */}
      {isAuthenticated && isCurrentUserTab && (
        <div className="glass glass-border rounded-lg p-4 border-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award size={32} className="text-accent" />
              <div>
                <div className="text-sm text-gray-400">Your Current Rank</div>
                <div className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  #{userRank || '—'}
                  <span className="text-gray-500 text-sm font-normal">
                    out of {leaders.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Push-ups</div>
              <div className="text-3xl font-bold text-accent font-display">
                {workouts.reduce((sum, w) => sum + w.pushups, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {userRank && userRank > 10 && (
            <div className="mt-4 pt-4 border-t border-dark-border text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" />
                <span>
                  Keep going! You're {userRank - 10} ranks away from the top 10.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Not Authenticated Message */}
      {!isAuthenticated && (
        <div className="glass glass-border rounded-lg p-6 text-center">
          <Trophy className="mx-auto text-gray-600 mb-3" size={40} />
          <div className="font-bold text-white mb-2">Join the Competition</div>
          <div className="text-sm text-gray-400 mb-4">
            Create an account to see your rank and compete with athletes worldwide
          </div>
          <a
            href="/features"
            className="inline-block px-6 py-2 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display text-sm"
          >
            Get Started
          </a>
        </div>
      )}
    </div>
  );
};
