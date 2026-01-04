'use client';

import { PushUpLeaderboard } from './PushUpLeaderboard';

/**
 * Leaderboards - Now uses the unified PushUpLeaderboard component
 * Maintains backward compatibility while using new system
 */
export const Leaderboards = () => {
  return <PushUpLeaderboard />;
};
