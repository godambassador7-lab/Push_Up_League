'use client';

import { useUserStore } from '@/lib/store';
import { Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const WorkoutHistory = () => {
  const workouts = useUserStore((state) => state.workouts);
  const sortedWorkouts = [...workouts].reverse().slice(0, 10);

  if (workouts.length === 0) {
    return (
      <div className="p-6 rounded-lg glass glass-border text-center">
        <div className="text-sm text-gray-400">No workouts logged yet. Get started!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-400 uppercase tracking-wider font-display">Recent Workouts</div>
      <div className="space-y-2">
        {sortedWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="p-3 rounded-lg glass-light border border-dark-border flex items-center justify-between hover:border-accent/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-bold text-lg">{workout.pushups}</div>
                <div className="text-xs text-gray-400">push-ups</div>
              </div>
              <div className="h-10 w-px bg-dark-border" />
              <div>
                <div className="text-xs text-gray-400 uppercase">
                  {new Date(workout.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-sm text-gray-300 mt-0.5">
                  {workout.xpEarned} XP • {workout.streakMultiplier.toFixed(2)}x multiplier
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Flame size={14} className="text-accent" />
                <span className="text-xs text-gray-400">+{workout.xpEarned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
