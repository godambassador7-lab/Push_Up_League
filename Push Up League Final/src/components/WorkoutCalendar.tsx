'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { ChevronLeft, ChevronRight, Lock, CheckCircle, Target } from 'lucide-react';

export const WorkoutCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const workouts = useEnhancedStore((state) => state.workouts);
  const dailyGoal = useEnhancedStore((state) => state.dailyGoal);
  const lockDay = useEnhancedStore((state) => state.lockDay);
  const isDayLocked = useEnhancedStore((state) => state.isDayLocked);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getWorkoutForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find(w => w.date === dateStr);
  };

  const handleLockDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const workout = getWorkoutForDate(day);

    if (workout && !workout.isLocked) {
      lockDay(dateStr);
    }
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  // Create array for calendar cells
  const calendarCells = [];

  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(null);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="glass glass-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-display text-2xl font-bold text-white">
            {monthNames[month]} {year}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Track and lock your daily push-ups
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 glass-light rounded-lg hover:bg-accent/20 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 glass-light rounded-lg hover:bg-accent/20 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs text-gray-500 font-display uppercase py-2">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const workout = getWorkoutForDate(day);
          const isToday = isCurrentMonth && day === todayDate;
          const isFuture = year > today.getFullYear() ||
                          (year === today.getFullYear() && month > today.getMonth()) ||
                          (year === today.getFullYear() && month === today.getMonth() && day > todayDate);
          const hasWorkout = !!workout;
          const isLocked = workout?.isLocked || false;
          const metGoal = workout && workout.pushups >= dailyGoal;

          return (
            <div
              key={day}
              className={`aspect-square relative rounded-lg transition ${
                isToday
                  ? 'glass-border ring-2 ring-accent'
                  : hasWorkout
                  ? 'glass glass-border'
                  : 'glass-light border border-dark-border'
              } ${isFuture ? 'opacity-50' : ''}`}
            >
              {/* Day number */}
              <div className="absolute top-1 left-1 text-xs font-bold text-gray-400">
                {day}
              </div>

              {/* Content */}
              <div className="flex flex-col items-center justify-center h-full p-1">
                {hasWorkout && (
                  <>
                    <div className="text-lg font-bold text-accent">
                      {workout.pushups}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {metGoal && <Target size={12} className="text-success" />}
                      {isLocked && <Lock size={12} className="text-warning" />}
                    </div>
                  </>
                )}

                {/* Lock button */}
                {hasWorkout && !isLocked && !isFuture && (
                  <button
                    onClick={() => handleLockDay(day)}
                    className="absolute bottom-1 right-1 p-1 glass-light rounded hover:bg-accent/20 transition text-gray-400 hover:text-accent"
                    title="Lock this day"
                  >
                    <Lock size={10} />
                  </button>
                )}

                {isLocked && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle size={12} className="text-success" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-dark-border grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-success" />
          <span className="text-gray-400">Goal Met ({dailyGoal}+)</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-warning" />
          <span className="text-gray-400">Day Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded glass-border ring-2 ring-accent" />
          <span className="text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-success" />
          <span className="text-gray-400">Completed</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 glass-light rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Daily Goal</div>
        <div className="text-2xl font-bold font-display text-accent">{dailyGoal} push-ups</div>
        <div className="text-xs text-gray-500 mt-2">
          Lock a day to prevent further edits and maintain integrity
        </div>
      </div>
    </div>
  );
};
