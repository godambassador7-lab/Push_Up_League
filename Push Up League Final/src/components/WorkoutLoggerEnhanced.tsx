'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { Plus, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

export const WorkoutLoggerEnhanced = () => {
  const [pushups, setPushups] = useState(10);
  const [sets, setSets] = useState(1);
  const [dailyChallenge, setDailyChallenge] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const logWorkout = useEnhancedStore((state) => state.logWorkout);
  const getTodayWorkout = useEnhancedStore((state) => state.getTodayWorkout);
  const isDayLocked = useEnhancedStore((state) => state.isDayLocked);

  const todayWorkout = getTodayWorkout();
  const today = new Date().toISOString().split('T')[0];
  const isLocked = isDayLocked(today);

  const handleSubmit = () => {
    setError(null);
    setWarnings([]);

    const result = logWorkout(pushups, undefined, dailyChallenge);

    if (result.success) {
      setPushups(10);
      setSets(1);
      setDailyChallenge(false);
      setSubmitted(true);

      if (result.warnings && result.warnings.length > 0) {
        setWarnings(result.warnings);
      }

      setTimeout(() => {
        setSubmitted(false);
        setWarnings([]);
      }, 5000);
    } else {
      setError(result.message);
      if (result.warnings) {
        setWarnings(result.warnings);
      }
    }
  };

  if (isLocked) {
    return (
      <div className="p-6 rounded-lg glass glass-border">
        <div className="text-center space-y-3">
          <CheckCircle className="mx-auto text-success" size={48} />
          <div className="text-sm text-gray-400 uppercase tracking-wider font-display">Today's Workout</div>
          <div className="text-3xl font-bold text-accent">{todayWorkout?.pushups || 0}</div>
          <div className="text-sm text-gray-400">
            Push-ups logged • {todayWorkout?.xpEarned || 0} XP earned
          </div>
          <div className="mt-4 p-3 glass-light rounded-lg border border-success text-success text-sm">
            ✓ Day locked! Great work staying disciplined.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 rounded-lg glass-border glass">
      {/* Error Message */}
      {error && (
        <div className="p-4 glass-light border border-red-500 rounded-lg text-red-400 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-1">Workout Rejected</div>
              <div>{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-4 glass-light border border-warning rounded-lg text-warning text-sm space-y-1">
          <div className="flex items-center gap-2 font-bold mb-2">
            <AlertTriangle size={18} />
            Integrity Warnings
          </div>
          {warnings.map((warning, i) => (
            <div key={i} className="text-xs">• {warning}</div>
          ))}
        </div>
      )}

      <div>
        <label className="text-sm text-gray-400 uppercase tracking-wider font-display">Push-ups</label>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => setPushups(Math.max(1, pushups - 5))}
            className="p-2 glass-light rounded hover:bg-accent/20 transition"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={pushups}
            onChange={(e) => setPushups(parseInt(e.target.value) || 1)}
            className="flex-1 glass-light border border-dark-border rounded px-4 py-2 text-center text-lg font-bold text-white outline-none focus:border-accent"
          />
          <button
            onClick={() => setPushups(pushups + 5)}
            className="p-2 glass-light rounded hover:bg-accent/20 transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 uppercase tracking-wider font-display">Sets</label>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => setSets(Math.max(1, sets - 1))}
            className="p-2 glass-light rounded hover:bg-accent/20 transition"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(parseInt(e.target.value) || 1)}
            className="flex-1 glass-light border border-dark-border rounded px-4 py-2 text-center text-lg font-bold text-white outline-none focus:border-accent"
          />
          <button
            onClick={() => setSets(sets + 1)}
            className="p-2 glass-light rounded hover:bg-accent/20 transition"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">+5% XP per set</div>
      </div>

      <label className="flex items-center gap-3 p-3 glass-light rounded cursor-pointer hover:bg-accent/10 transition">
        <input
          type="checkbox"
          checked={dailyChallenge}
          onChange={(e) => setDailyChallenge(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm">Daily Challenge Completed (+25% XP)</span>
      </label>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
      >
        Log Workout
      </button>

      {submitted && !error && (
        <div className="p-3 bg-success/20 border border-success rounded text-success text-sm animate-fade-in">
          ✓ Workout logged! Great work.
        </div>
      )}
    </div>
  );
};
