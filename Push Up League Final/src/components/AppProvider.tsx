'use client';

import { ReactNode } from 'react';
import { useSyncManager } from '@/lib/syncManager';
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

  return (
    <>
      <AchievementToastManager />
      {children}
    </>
  );
}
