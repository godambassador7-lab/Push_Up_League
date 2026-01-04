'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { PROFICIENCY_LEVELS, ProficiencyLevel } from '@/lib/worldRecords';
import { registerUser, createUserProfile } from '@/lib/firebase';
import { User, Mail, Zap, AlertTriangle, Lock } from 'lucide-react';

interface OnboardingWithAuthProps {
  onSwitchToLogin?: () => void;
}

export const OnboardingWithAuth = ({ onSwitchToLogin }: OnboardingWithAuthProps) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('beginner');
  const [maxPushups, setMaxPushups] = useState(10);
  const [showWorldRecordWarning, setShowWorldRecordWarning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useEnhancedStore((state) => state.register);

  const handleProficiencyChange = (level: ProficiencyLevel) => {
    setProficiency(level);
    const profData = PROFICIENCY_LEVELS[level];
    setMaxPushups(profData.maxPushupsRange.min);

    if (level === 'world-class') {
      setShowWorldRecordWarning(true);
    } else {
      setShowWorldRecordWarning(false);
    }
  };

  const handleMaxPushupsChange = (value: number) => {
    setMaxPushups(value);

    if (value > 200) {
      setShowWorldRecordWarning(true);
    } else {
      setShowWorldRecordWarning(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Register with Firebase Auth
      const authResult = await registerUser(email, password);

      if (!authResult.success || !authResult.user) {
        setError(authResult.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Create Firestore profile
      const profileResult = await createUserProfile(authResult.user.uid, {
        userId: authResult.user.uid,
        username,
        email,
        proficiency,
        maxPushupsInOneSet: maxPushups,
        isWorldRecordCandidate: maxPushups > 200 || proficiency === 'world-class',
        totalXp: 0,
        coins: 0,
        currentRank: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null,
        personalBest: 0,
        dailyGoal: 50,
        streakFreezes: 1,
      });

      if (!profileResult.success) {
        setError('Failed to create profile');
        setLoading(false);
        return;
      }

      // Update local store
      register(email, username, proficiency, maxPushups);

      // Success!
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-6">
      <div className="max-w-2xl w-full glass glass-border rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-display text-4xl font-bold text-accent mb-2">
            Welcome to Push-Up League
          </div>
          <div className="text-gray-400">Let's set up your account</div>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition ${
                s <= step ? 'bg-accent' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 glass-light border border-red-500 rounded-lg">
            <div className="text-red-400 mb-2">{error}</div>
            {error.includes('already registered') && onSwitchToLogin && (
              <button
                onClick={onSwitchToLogin}
                className="text-sm text-accent hover:text-accent-light underline transition"
              >
                Switch to Login →
              </button>
            )}
          </div>
        )}

        {/* Step 1: Email & Password */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-display text-gray-400 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-light border border-dark-border rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-display text-gray-400 mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-light border border-dark-border rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-display text-gray-400 mb-2">
                <Lock size={16} className="inline mr-2" />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-light border border-dark-border rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition"
                placeholder="Re-enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-display text-gray-400 mb-2">
                <User size={16} className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-light border border-dark-border rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition"
                placeholder="Choose your warrior name"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!email || !password || !confirmPassword || !username}
              className="w-full py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Proficiency Level */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-display text-gray-400 mb-4">
                <Zap size={16} className="inline mr-2" />
                Select Your Current Level
              </label>
              <div className="space-y-3">
                {Object.entries(PROFICIENCY_LEVELS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => handleProficiencyChange(data.level)}
                    className={`w-full p-4 rounded-lg text-left transition ${
                      proficiency === data.level
                        ? 'glass-border bg-accent/10 border-accent'
                        : 'glass-light border-dark-border hover:border-accent/50'
                    }`}
                  >
                    <div className="font-bold text-lg">{data.label}</div>
                    <div className="text-sm text-gray-400 mt-1">{data.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 glass-light border border-dark-border text-white font-bold rounded-lg hover:border-accent/50 transition uppercase tracking-wider font-display"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Max Push-ups */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-display text-gray-400 mb-4">
                Maximum Push-ups in One Set
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={PROFICIENCY_LEVELS[proficiency].maxPushupsRange.min}
                  max={Math.min(PROFICIENCY_LEVELS[proficiency].maxPushupsRange.max, 300)}
                  value={maxPushups}
                  onChange={(e) => handleMaxPushupsChange(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={maxPushups}
                  onChange={(e) => handleMaxPushupsChange(parseInt(e.target.value) || 0)}
                  className="w-24 glass-light border border-dark-border rounded-lg px-4 py-2 text-center text-xl font-bold text-white outline-none focus:border-accent"
                />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Your best effort in a single continuous set
              </div>
            </div>

            {/* World Record Warning */}
            {showWorldRecordWarning && (
              <div className="glass-light border border-warning rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={24} />
                  <div className="space-y-2">
                    <div className="font-bold text-warning">World Record Territory</div>
                    <div className="text-sm text-gray-300">
                      You've indicated world-class performance levels. You will be placed in the
                      <span className="font-bold text-accent"> World Record Leaders </span>
                      leaderboard with exponentially challenging goals.
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Note: Exceptional performance data may be submitted to Guinness World Records
                      organization for verification.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="glass glass-border rounded-lg p-4 space-y-2">
              <div className="text-sm font-display text-gray-400 uppercase">Your Profile</div>
              <div className="text-sm">
                <span className="text-gray-400">Email:</span>{' '}
                <span className="text-white">{email}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Username:</span>{' '}
                <span className="text-white">{username}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Level:</span>{' '}
                <span className="text-accent">{PROFICIENCY_LEVELS[proficiency].label}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Max Push-ups:</span>{' '}
                <span className="text-accent font-bold">{maxPushups}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 py-3 glass-light border border-dark-border text-white font-bold rounded-lg hover:border-accent/50 transition uppercase tracking-wider font-display disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Start Training'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
