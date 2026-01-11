'use client';

import { useState, useMemo } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { calculateCalories, calculateWeeklyStats, calculateMultiSetCalories, lbsToKg, kgToLbs, getCalorieBurnMessage } from '@/lib/calorieCalculator';
import { Flame, TrendingUp, Award, Settings as SettingsIcon, Info } from 'lucide-react';

export const CalorieDashboard = () => {
  const { workouts, bodyWeightKg, setBodyWeight } = useEnhancedStore();
  const [showSettings, setShowSettings] = useState(false);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');
  const [editingWeight, setEditingWeight] = useState(false);
  const [tempWeight, setTempWeight] = useState(
    weightUnit === 'kg' ? bodyWeightKg : kgToLbs(bodyWeightKg)
  );

  // Calculate today's calories
  const todayCalories = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = workouts.filter(w => w.date === today);

    let total = 0;
    todayWorkouts.forEach(w => {
      if (w.sets && w.sets.length > 0) {
        // Use multi-set calculation with actual push-up types
        const calories = calculateMultiSetCalories(
          w.sets.map(set => ({ reps: set.reps, pushupType: set.type })),
          bodyWeightKg
        );
        total += calories;
      } else {
        // Fallback to standard calculation
        const { calories } = calculateCalories(w.pushups, 'standard', bodyWeightKg);
        total += calories;
      }
    });

    return Math.round(total * 10) / 10;
  }, [workouts, bodyWeightKg]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    // Flatten workouts with sets into individual entries
    const workoutData: Array<{ date: string; reps: number; pushupType: any }> = [];

    workouts.forEach(w => {
      if (w.sets && w.sets.length > 0) {
        // Add each set as a separate entry
        w.sets.forEach(set => {
          workoutData.push({
            date: w.date,
            reps: set.reps,
            pushupType: set.type,
          });
        });
      } else {
        // Add as standard push-up
        workoutData.push({
          date: w.date,
          reps: w.pushups,
          pushupType: 'standard' as const,
        });
      }
    });

    return calculateWeeklyStats(workoutData, bodyWeightKg);
  }, [workouts, bodyWeightKg]);

  const handleWeightSave = () => {
    const newWeightKg = weightUnit === 'kg' ? tempWeight : lbsToKg(tempWeight);
    setBodyWeight(newWeightKg);
    setEditingWeight(false);
  };

  const toggleWeightUnit = () => {
    const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
    setWeightUnit(newUnit);
    setTempWeight(newUnit === 'kg' ? bodyWeightKg : kgToLbs(bodyWeightKg));
  };

  return (
    <div className="space-y-4">
      {/* Header with Settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={24} className="text-error" />
          <h3 className="text-xl font-black text-white">Calorie Tracker</h3>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 glass-light rounded-lg hover:bg-accent/10 transition"
        >
          <SettingsIcon size={18} className="text-accent" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass glass-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Body Weight</div>
              <div className="text-xs text-gray-400">Used to estimate calories burned</div>
            </div>
            {!editingWeight && (
              <button
                onClick={() => setEditingWeight(true)}
                className="px-3 py-1.5 text-xs glass-light border border-accent/50 rounded hover:bg-accent/10 transition text-accent font-bold"
              >
                Edit
              </button>
            )}
          </div>

          {editingWeight ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={weightUnit === 'kg' ? 40 : 88}
                max={weightUnit === 'kg' ? 200 : 440}
                step={weightUnit === 'kg' ? 0.5 : 1}
                value={tempWeight}
                onChange={(e) => setTempWeight(Number(e.target.value))}
                className="flex-1 px-3 py-2 glass-light border border-accent/50 rounded text-white text-center font-bold"
              />
              <button
                onClick={toggleWeightUnit}
                className="px-3 py-2 glass-light border border-dark-border rounded text-accent text-sm font-bold hover:bg-accent/10 transition"
              >
                {weightUnit}
              </button>
              <button
                onClick={handleWeightSave}
                className="px-4 py-2 bg-accent text-dark rounded font-bold hover:bg-accent-light transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingWeight(false)}
                className="px-3 py-2 glass-light border border-dark-border rounded text-gray-400 text-sm hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="text-center p-2 glass-light border border-dark-border rounded">
              <span className="text-2xl font-black text-accent">
                {weightUnit === 'kg' ? bodyWeightKg : kgToLbs(bodyWeightKg)}
              </span>
              <span className="text-sm text-gray-400 ml-2">{weightUnit}</span>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-electric-blue/5 border border-electric-blue/30 rounded">
            <Info size={16} className="text-electric-blue flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed">
              <span className="font-bold text-white">Note:</span> Calorie estimates are based on body weight, reps, and push-up difficulty.
              Strength exercises burn fewer calories than cardio—but build muscle that increases daily burn.
            </p>
          </div>
        </div>
      )}

      {/* Today's Calories */}
      <div className="glass glass-border rounded-lg p-6">
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Estimated Calories Burned Today</div>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-error to-warning mb-2">
            {todayCalories}
          </div>
          <div className="text-xs text-gray-400 mb-4">
            {getCalorieBurnMessage(todayCalories)}
          </div>
        </div>
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weekly Total */}
        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-warning" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Weekly Total</div>
          </div>
          <div className="text-2xl font-black text-warning">
            {weeklyStats.totalCalories}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {weeklyStats.totalReps} total reps
          </div>
        </div>

        {/* Daily Average */}
        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-accent" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Daily Avg</div>
          </div>
          <div className="text-2xl font-black text-accent">
            {weeklyStats.averageCaloriesPerDay}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            per day (7 days)
          </div>
        </div>

        {/* Highest Day */}
        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-electric-blue" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Highest Day</div>
          </div>
          <div className="text-2xl font-black text-electric-blue">
            {weeklyStats.highestDay.calories || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {weeklyStats.highestDay.date ? new Date(weeklyStats.highestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
          </div>
        </div>

        {/* Afterburn Bonus */}
        <div className={`glass glass-border rounded-lg p-4 ${weeklyStats.afterburnBonus ? 'border-success/50 bg-success/5' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className={weeklyStats.afterburnBonus ? 'text-success' : 'text-gray-500'} />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Afterburn</div>
          </div>
          <div className={`text-lg font-black ${weeklyStats.afterburnBonus ? 'text-success' : 'text-gray-500'}`}>
            {weeklyStats.afterburnBonus ? 'ACTIVE' : 'Inactive'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {weeklyStats.afterburnBonus ? 'High-volume week!' : 'Need 300+ reps'}
          </div>
        </div>
      </div>

      {/* XP Priority Message */}
      <div className="glass glass-border rounded-lg p-4 bg-accent/5 border-accent/30">
        <div className="flex items-start gap-3">
          <Award size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-accent mb-1">XP is Your Primary Reward</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Calories are a secondary metric. Focus on XP gains and strength progression.
              Weekly calorie totals matter more than daily burns. Building muscle increases your resting metabolic rate!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
