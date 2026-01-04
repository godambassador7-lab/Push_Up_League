'use client';

import { useEffect, ReactNode } from 'react';
import { useSyncManager } from '@/lib/syncManager';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { AchievementToastManager } from './AchievementToastManager';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider - Wraps the app to handle:
 * - Firebase/Local sync
 * - Auto-save to localStorage
 * - Auth state management
 * - Real-time updates
 */
export function AppProvider({ children }: AppProviderProps) {
  // Initialize sync manager
  useSyncManager();

  // Subscribe to store changes and auto-save
  useEffect(() => {
    const unsubscribe = useEnhancedStore.subscribe((state, prevState) => {
      // Auto-save to localStorage on any state change
      if (typeof window !== 'undefined') {
        try {
          const dataToSave = {
            userId: state.userId,
            username: state.username,
            email: state.email,
            proficiency: state.proficiency,
            maxPushupsInOneSet: state.maxPushupsInOneSet,
            isWorldRecordCandidate: state.isWorldRecordCandidate,
            totalXp: state.totalXp,
            coins: state.coins,
            currentRank: state.currentRank,
            currentStreak: state.currentStreak,
            longestStreak: state.longestStreak,
            lastWorkoutDate: state.lastWorkoutDate,
            workouts: state.workouts,
            achievements: state.achievements,
            unlockedAchievements: state.unlockedAchievements,
            personalBest: state.personalBest,
            dailyGoal: state.dailyGoal,
            streakFreezes: state.streakFreezes,
          };

          localStorage.setItem('pushup-league-data', JSON.stringify(dataToSave));
        } catch (error) {
          console.error('Error auto-saving to localStorage:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pushup-league-data');

        if (saved) {
          const data = JSON.parse(saved);

          useEnhancedStore.setState({
            userId: data.userId || useEnhancedStore.getState().userId,
            username: data.username || useEnhancedStore.getState().username,
            email: data.email || '',
            proficiency: data.proficiency || 'beginner',
            maxPushupsInOneSet: data.maxPushupsInOneSet || 10,
            isWorldRecordCandidate: data.isWorldRecordCandidate || false,
            totalXp: data.totalXp || 0,
            coins: data.coins || 0,
            currentRank: data.currentRank || 1,
            currentStreak: data.currentStreak || 0,
            longestStreak: data.longestStreak || 0,
            lastWorkoutDate: data.lastWorkoutDate || null,
            workouts: data.workouts || [],
            achievements: data.achievements || [],
            unlockedAchievements: data.unlockedAchievements || [],
            personalBest: data.personalBest || 0,
            dailyGoal: data.dailyGoal || 50,
            streakFreezes: data.streakFreezes || 1,
          });
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }, []);

  return (
    <>
      <AchievementToastManager />
      {children}
    </>
  );
}
