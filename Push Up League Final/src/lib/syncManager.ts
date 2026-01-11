import { useEffect } from 'react';
import { useEnhancedStore } from './enhancedStore';
import {
  onAuthChange,
  getUserProfile,
  getUserWorkouts,
  getUserAchievements,
  updateUserProfile,
  saveWorkout,
  saveAchievement,
  subscribeToUserWorkouts,
} from './firebase';
import type { User } from 'firebase/auth';

/**
 * Sync Manager - Handles bidirectional sync between local store and Firebase
 * Ensures data consistency across local storage and cloud
 */

export class SyncManager {
  private static instance: SyncManager;
  private unsubscribeWorkouts: (() => void) | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTimestamp: number = 0;

  private constructor() {}

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Initialize sync manager and set up auth listener
   */
  initialize() {
    // Listen for auth state changes
    onAuthChange((user) => {
      if (user) {
        this.handleUserLogin(user);
      } else {
        this.handleUserLogout();
      }
    });

    // Set up periodic sync (every 30 seconds)
    this.syncInterval = setInterval(() => {
      this.performPeriodicSync();
    }, 30000);

    // Load from localStorage on init
    this.loadFromLocalStorage();
  }

  /**
   * Handle user login - load data from Firebase
   */
  private async handleUserLogin(user: User) {
    const store = useEnhancedStore.getState();

    try {
      console.log('🔄 Loading user data from Firebase for:', user.uid);

      // Load user profile from Firebase
      const profile = await getUserProfile(user.uid);

      if (profile) {
        console.log('✅ Profile loaded from Firebase:', profile);

        // Update local store with Firebase data
        store.setUserProfile(profile.email, profile.proficiency as any, profile.maxPushupsInOneSet);

        // Manually update all fields from Firebase
        useEnhancedStore.setState({
          userId: profile.userId,
          username: profile.username,
          email: profile.email,
          isAuthenticated: true,
          proficiency: profile.proficiency as any,
          maxPushupsInOneSet: profile.maxPushupsInOneSet,
          isWorldRecordCandidate: profile.isWorldRecordCandidate,
          waiverAccepted: profile.waiverAccepted || false,
          waiverAcceptedAt: profile.waiverAcceptedAt || null,
          waiverVersion: profile.waiverVersion || null,
          waiverSignatureName: profile.waiverSignatureName || null,
          accountCreatedAt: profile.accountCreatedAt || null,
          totalXp: profile.totalXp,
          coins: profile.coins,
          currentRank: profile.currentRank,
          currentStreak: profile.currentStreak,
          longestStreak: profile.longestStreak,
          lastWorkoutDate: profile.lastWorkoutDate,
          personalBest: profile.personalBest,
          dailyGoal: profile.dailyGoal,
          streakFreezes: profile.streakFreezes,
          bodyWeightKg: (profile as any).bodyWeightKg || 77,
          totalLifetimePushups: (profile as any).totalLifetimePushups || 0,
          variationStats: (profile as any).variationStats || useEnhancedStore.getState().variationStats,
          variationPBs: (profile as any).variationPBs || useEnhancedStore.getState().variationPBs,
          purchasedTitles: (profile as any).purchasedTitles || [],
          activeTitle: (profile as any).activeTitle || null,
          unlockedAchievements: (profile as any).unlockedAchievements || [],
        });
      } else {
        console.warn('⚠️ No profile found in Firebase for user:', user.uid);
      }

      // Load workouts
      const workouts = await getUserWorkouts(user.uid);
      console.log(`📊 Loaded ${workouts.length} workouts from Firebase`);

      if (workouts.length > 0) {
        useEnhancedStore.setState({
          workouts: workouts.map(w => ({
            id: w.id,
            date: w.date,
            pushups: w.pushups,
            sets: w.sets as any, // Firebase stores number, will migrate to WorkoutSet[] later
            xpEarned: w.xpEarned,
            coinsEarned: w.coinsEarned || 0,
            goalCompleted: w.goalCompleted || false,
            streakMultiplier: w.streakMultiplier,
            challengeBonus: w.challengeBonus,
            isLocked: w.isLocked,
            lockedAt: w.lockedAt,
          })),
        });
      } else {
        console.warn('⚠️ No workouts found in Firebase for user:', user.uid);
      }

      // Load achievements (only if authenticated)
      try {
        const achievements = await getUserAchievements(user.uid);
        if (achievements.length > 0) {
          useEnhancedStore.setState({
            achievements: achievements.map(a => ({
              id: a.id,
              title: a.title,
              description: a.description,
              unlockedAt: a.unlockedAt,
              type: a.type as any,
            })),
          });
        }
      } catch (achievementError) {
        console.warn('Could not load achievements from Firebase:', achievementError);
        // Continue without achievements - they'll be managed locally
      }

      // Subscribe to real-time workout updates
      this.unsubscribeWorkouts = subscribeToUserWorkouts(user.uid, (firebaseWorkouts) => {
        console.log(`🔔 Real-time update: ${firebaseWorkouts.length} workouts`);
        useEnhancedStore.setState({
          workouts: firebaseWorkouts.map(w => ({
            id: w.id,
            date: w.date,
            pushups: w.pushups,
            sets: w.sets as any, // Firebase stores number, will migrate to WorkoutSet[] later
            xpEarned: w.xpEarned,
            coinsEarned: w.coinsEarned || 0,
            goalCompleted: w.goalCompleted || false,
            streakMultiplier: w.streakMultiplier,
            challengeBonus: w.challengeBonus,
            isLocked: w.isLocked,
            lockedAt: w.lockedAt,
          })),
        });
        // Save to localStorage after real-time update
        this.saveToLocalStorage();
      });

      // Save to localStorage immediately after initial load
      this.saveToLocalStorage();
      console.log('💾 Data saved to localStorage');
    } catch (error) {
      console.error('❌ Error loading user data from Firebase:', error);
    }
  }

  /**
   * Handle user logout - clear subscriptions
   */
  private handleUserLogout() {
    if (this.unsubscribeWorkouts) {
      this.unsubscribeWorkouts();
      this.unsubscribeWorkouts = null;
    }

    // Keep local data in localStorage for offline access
    this.saveToLocalStorage();
  }

  /**
   * Sync local changes to Firebase
   */
  async syncToFirebase() {
    const store = useEnhancedStore.getState();

    if (!store.isAuthenticated || !store.userId) {
      console.log('⏭️ Skipping sync - not authenticated');
      return; // Not authenticated, skip sync
    }

    console.log('🔄 Syncing to Firebase...');

    try {
      // Sync user profile with all fields
      console.log('📤 Uploading user profile to Firebase...');
      await updateUserProfile(store.userId, {
        userId: store.userId,
        username: store.username,
        email: store.email,
        proficiency: store.proficiency,
        maxPushupsInOneSet: store.maxPushupsInOneSet,
        isWorldRecordCandidate: store.isWorldRecordCandidate,
        waiverAccepted: store.waiverAccepted,
        waiverAcceptedAt: store.waiverAcceptedAt,
        waiverVersion: store.waiverVersion,
        waiverSignatureName: store.waiverSignatureName,
        accountCreatedAt: store.accountCreatedAt,
        totalXp: store.totalXp,
        coins: store.coins,
        currentRank: store.currentRank,
        currentStreak: store.currentStreak,
        longestStreak: store.longestStreak,
        lastWorkoutDate: store.lastWorkoutDate,
        personalBest: store.personalBest,
        dailyGoal: store.dailyGoal,
        streakFreezes: store.streakFreezes,
        bodyWeightKg: store.bodyWeightKg,
        totalLifetimePushups: store.totalLifetimePushups,
        variationStats: store.variationStats,
        variationPBs: store.variationPBs,
        purchasedTitles: store.purchasedTitles,
        activeTitle: store.activeTitle,
        unlockedAchievements: store.unlockedAchievements,
      } as any);

      console.log('✅ User profile synced to Firebase');

      // Sync workouts (only new ones)
      const firebaseWorkouts = await getUserWorkouts(store.userId);
      const firebaseWorkoutIds = new Set(firebaseWorkouts.map(w => w.id));

      let newWorkoutsCount = 0;
      for (const workout of store.workouts) {
        if (!firebaseWorkoutIds.has(workout.id)) {
          // New workout, save to Firebase
          await saveWorkout({
            ...workout,
            sets: workout.sets as any, // Convert WorkoutSet[] to number for Firebase
            userId: store.userId,
            createdAt: null as any, // Will be set by Firebase
          });
          newWorkoutsCount++;
        }
      }

      if (newWorkoutsCount > 0) {
        console.log(`✅ Synced ${newWorkoutsCount} new workout(s) to Firebase`);
      }

      // Sync achievements (only new ones) - wrap in try-catch to prevent blocking
      try {
        const firebaseAchievements = await getUserAchievements(store.userId);
        const firebaseAchievementIds = new Set(firebaseAchievements.map(a => a.id));

        for (const achievement of store.achievements) {
          if (!firebaseAchievementIds.has(achievement.id)) {
            await saveAchievement({
              ...achievement,
              userId: store.userId,
            });
          }
        }
      } catch (achievementSyncError) {
        console.warn('Could not sync achievements to Firebase:', achievementSyncError);
        // Continue - achievements will be managed locally
      }

      this.lastSyncTimestamp = Date.now();
      console.log('✅ Firebase sync complete');
    } catch (error) {
      console.error('❌ Error syncing to Firebase:', error);
    }
  }

  /**
   * Periodic sync - runs every 30 seconds
   */
  private async performPeriodicSync() {
    const store = useEnhancedStore.getState();

    if (store.isAuthenticated) {
      await this.syncToFirebase();
    }

    // Always save to localStorage
    this.saveToLocalStorage();
  }

  /**
   * Save current state to localStorage
   */
  saveToLocalStorage() {
    const store = useEnhancedStore.getState();

    const dataToSave = {
      userId: store.userId,
      username: store.username,
      email: store.email,
      proficiency: store.proficiency,
      maxPushupsInOneSet: store.maxPushupsInOneSet,
      isWorldRecordCandidate: store.isWorldRecordCandidate,
      waiverAccepted: store.waiverAccepted,
      waiverAcceptedAt: store.waiverAcceptedAt,
      waiverVersion: store.waiverVersion,
      waiverSignatureName: store.waiverSignatureName,
      accountCreatedAt: store.accountCreatedAt,
      totalXp: store.totalXp,
      coins: store.coins,
      currentRank: store.currentRank,
      currentStreak: store.currentStreak,
      longestStreak: store.longestStreak,
      lastWorkoutDate: store.lastWorkoutDate,
      workouts: store.workouts,
      achievements: store.achievements,
      personalBest: store.personalBest,
      dailyGoal: store.dailyGoal,
      streakFreezes: store.streakFreezes,
      powerUpPurchaseHistory: store.powerUpPurchaseHistory,
      bodyWeightKg: store.bodyWeightKg,
      totalLifetimePushups: store.totalLifetimePushups,
      variationStats: store.variationStats,
      variationPBs: store.variationPBs,
      purchasedTitles: store.purchasedTitles,
      activeTitle: store.activeTitle,
      unlockedAchievements: store.unlockedAchievements,
      lastSyncTimestamp: this.lastSyncTimestamp,
    };

    try {
      localStorage.setItem('pushup-league-data', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('pushup-league-data');

      if (saved) {
        const data = JSON.parse(saved);

        useEnhancedStore.setState({
          userId: data.userId,
          username: data.username,
          email: data.email,
          proficiency: data.proficiency || 'beginner',
          maxPushupsInOneSet: data.maxPushupsInOneSet || 10,
          isWorldRecordCandidate: data.isWorldRecordCandidate || false,
          waiverAccepted: data.waiverAccepted || false,
          waiverAcceptedAt: data.waiverAcceptedAt || null,
          waiverVersion: data.waiverVersion || null,
          waiverSignatureName: data.waiverSignatureName || null,
          accountCreatedAt: data.accountCreatedAt || null,
          totalXp: data.totalXp || 0,
          coins: data.coins || 0,
          currentRank: data.currentRank || 1,
          currentStreak: data.currentStreak || 0,
          longestStreak: data.longestStreak || 0,
          lastWorkoutDate: data.lastWorkoutDate || null,
          workouts: data.workouts || [],
          achievements: data.achievements || [],
          personalBest: data.personalBest || 0,
          dailyGoal: data.dailyGoal || 50,
          streakFreezes: data.streakFreezes || 1,
          powerUpPurchaseHistory: data.powerUpPurchaseHistory || useEnhancedStore.getState().powerUpPurchaseHistory,
          bodyWeightKg: data.bodyWeightKg || 77,
          totalLifetimePushups: data.totalLifetimePushups || 0,
          variationStats: data.variationStats || useEnhancedStore.getState().variationStats,
          variationPBs: data.variationPBs || useEnhancedStore.getState().variationPBs,
          purchasedTitles: data.purchasedTitles || [],
          activeTitle: data.activeTitle || null,
          unlockedAchievements: data.unlockedAchievements || [],
        });

        this.lastSyncTimestamp = data.lastSyncTimestamp || 0;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  /**
   * Force sync now
   */
  async forceSyncNow() {
    await this.syncToFirebase();
    this.saveToLocalStorage();
  }

  /**
   * Cleanup
   */
  cleanup() {
    if (this.unsubscribeWorkouts) {
      this.unsubscribeWorkouts();
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

// Export singleton instance
export const syncManager = SyncManager.getInstance();

/**
 * React Hook to initialize sync manager
 */
export function useSyncManager() {
  useEffect(() => {
    syncManager.initialize();

    return () => {
      syncManager.cleanup();
    };
  }, []);
}

/**
 * Helper hook to trigger manual sync
 */
export function useManualSync() {
  return {
    syncNow: () => syncManager.forceSyncNow(),
    saveLocal: () => syncManager.saveToLocalStorage(),
  };
}
