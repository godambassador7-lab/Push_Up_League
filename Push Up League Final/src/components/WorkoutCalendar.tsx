'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { calculateCalories, calculateMultiSetCalories, DEFAULT_BODY_WEIGHT_KG } from '@/lib/calorieCalculator';
import { getPushUpTypeData } from '@/lib/pushupTypes';
import { ChevronLeft, ChevronRight, ChevronDown, Lock, CheckCircle, Target, Calendar as CalendarIcon } from 'lucide-react';

export const WorkoutCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
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

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getWorkoutForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find(w => w.date === dateStr);
  };

  const getWorkoutForFullDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find(w => w.date === dateStr);
  };

  const getWorkoutBreakdown = (workout: NonNullable<ReturnType<typeof getWorkoutForDate>>) => {
    if (workout.sets && workout.sets.length > 0) {
      const grouped = new Map<string, { reps: number }>();
      workout.sets.forEach((set) => {
        const key = set.type;
        const current = grouped.get(key) || { reps: 0 };
        grouped.set(key, { reps: current.reps + set.reps });
      });
      return Array.from(grouped.entries()).map(([type, data]) => ({
        type,
        reps: data.reps,
        calories: calculateCalories(data.reps, type, DEFAULT_BODY_WEIGHT_KG).calories,
        label: getPushUpTypeData(type).name,
      }));
    }

    return [{
      type: 'standard',
      reps: workout.pushups,
      calories: calculateCalories(workout.pushups, 'standard', DEFAULT_BODY_WEIGHT_KG).calories,
      label: getPushUpTypeData('standard').name,
    }];
  };

  const getWorkoutCalories = (workout: NonNullable<ReturnType<typeof getWorkoutForDate>>) => {
    if (workout.sets && workout.sets.length > 0) {
      return calculateMultiSetCalories(
        workout.sets.map((set) => ({ reps: set.reps, pushupType: set.type })),
        DEFAULT_BODY_WEIGHT_KG
      );
    }
    return calculateCalories(workout.pushups, 'standard', DEFAULT_BODY_WEIGHT_KG).calories;
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

  const weekDays = viewMode === 'week' ? getWeekDays() : [];

  return (
    <div className="w-full max-w-full">
      <div className="glass glass-border rounded-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="font-display text-2xl font-bold text-white">
              {viewMode === 'month'
                ? `${monthNames[month]} ${year}`
                : `Week of ${monthNames[weekDays[0]?.getMonth()]} ${weekDays[0]?.getDate()}, ${weekDays[0]?.getFullYear()}`
              }
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Track and lock your daily push-ups
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex gap-1 glass-light rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  viewMode === 'month'
                    ? 'bg-accent text-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  viewMode === 'week'
                    ? 'bg-accent text-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Week
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={viewMode === 'month' ? previousMonth : previousWeek}
                className="p-2 glass-light rounded-lg hover:bg-accent/20 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={viewMode === 'month' ? nextMonth : nextWeek}
                className="p-2 glass-light rounded-lg hover:bg-accent/20 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
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

      {/* Month View */}
      {viewMode === 'month' && (
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
          const isExpanded = expandedDay === day;
          const caloriesBurned = workout ? getWorkoutCalories(workout) : 0;
          const breakdown = workout ? getWorkoutBreakdown(workout) : [];

          return (
            <div
              key={day}
              className={`aspect-square relative rounded-lg transition ${
                isToday
                  ? 'glass-border ring-2 ring-accent'
                  : hasWorkout
                  ? 'glass glass-border'
                  : 'glass-light border border-dark-border'
              } ${isFuture ? 'opacity-50' : ''} ${isExpanded ? 'z-20 overflow-visible' : ''}`}
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

                {hasWorkout && (
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day)}
                    className="absolute bottom-1 left-1 p-1 glass-light rounded hover:bg-accent/20 transition text-gray-400 hover:text-accent"
                    title={isExpanded ? 'Hide details' : 'Show details'}
                  >
                    <ChevronDown size={10} className={`${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
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

              {hasWorkout && isExpanded && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 max-w-[80vw] glass border border-dark-border rounded-lg p-3 text-xs text-gray-300 shadow-xl">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-gray-400 mb-2">
                    <span>Workout Details</span>
                    <span>{caloriesBurned.toFixed(1)} cal</span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {breakdown.map((item) => (
                      <div key={item.type} className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{item.label}</div>
                          <div className="text-[11px] text-gray-400">{item.reps} reps</div>
                        </div>
                        <div className="text-[11px] text-warning font-bold">{item.calories.toFixed(1)} cal</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-3 sm:gap-4">
          {weekDays.map((date, index) => {
            const workout = getWorkoutForFullDate(date);
            const dateKey = date.toISOString().split('T')[0];
            const isToday = today.toDateString() === date.toDateString();
            const isFuture = date > today;
            const hasWorkout = !!workout;
            const isLocked = workout?.isLocked || false;
            const metGoal = workout && workout.pushups >= dailyGoal;
            const isExpanded = expandedDay === date.getDate();
            const caloriesBurned = workout ? getWorkoutCalories(workout) : 0;
            const breakdown = workout ? getWorkoutBreakdown(workout) : [];

            return (
              <div
                key={dateKey}
                className={`relative rounded-lg transition min-h-[200px] sm:min-h-[240px] ${
                  isToday
                    ? 'glass-border ring-2 ring-accent'
                    : hasWorkout
                    ? 'glass glass-border'
                    : 'glass-light border border-dark-border'
                } ${isFuture ? 'opacity-50' : ''} ${isExpanded ? 'z-20' : ''}`}
              >
                {/* Day header */}
                <div className="p-3 border-b border-dark-border">
                  <div className="text-xs text-gray-500 uppercase">{dayNames[index]}</div>
                  <div className={`text-lg font-bold mt-1 ${isToday ? 'text-accent' : 'text-white'}`}>
                    {date.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {monthNames[date.getMonth()]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  {hasWorkout ? (
                    <div className="space-y-3">
                      {/* Total pushups */}
                      <div className="glass-light rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Total Reps</div>
                        <div className="text-2xl font-black text-accent">{workout.pushups}</div>
                      </div>

                      {/* Calories */}
                      <div className="glass-light rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Calories</div>
                        <div className="text-lg font-bold text-warning">{caloriesBurned.toFixed(1)}</div>
                      </div>

                      {/* Breakdown */}
                      {breakdown.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-400 mb-2">Variations</div>
                          <div className="space-y-1.5">
                            {breakdown.slice(0, 3).map((item) => (
                              <div key={item.type} className="flex justify-between items-center text-xs">
                                <span className="text-gray-300 truncate">{item.label}</span>
                                <span className="text-accent font-bold ml-2">{item.reps}</span>
                              </div>
                            ))}
                            {breakdown.length > 3 && (
                              <div className="text-xs text-gray-500 mt-1">
                                +{breakdown.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Status indicators */}
                      <div className="flex items-center gap-2 pt-2 border-t border-dark-border">
                        {metGoal && (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <Target size={12} />
                            <span>Goal Met</span>
                          </div>
                        )}
                        {isLocked && (
                          <div className="flex items-center gap-1 text-xs text-warning">
                            <Lock size={12} />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>

                      {/* Lock button */}
                      {!isLocked && !isFuture && (
                        <button
                          onClick={() => lockDay(dateKey)}
                          className="w-full mt-2 px-3 py-2 glass-light border border-accent/30 rounded-lg hover:bg-accent/10 transition text-accent text-xs font-bold"
                        >
                          Lock Day
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <CalendarIcon size={32} className="mb-2 opacity-50" />
                      <div className="text-xs">No workout</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
    </div>
  );
};
