'use client';

import { useState } from 'react';
import { loginUser, signInWithGoogle, getUserProfile, createUserProfile } from '@/lib/firebase';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { syncManager } from '@/lib/syncManager';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login = ({ onSwitchToRegister }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useEnhancedStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Update local store
      await login(email, password);

      // Wait for sync manager to finish loading all data from Firebase
      // The onAuthChange listener in syncManager will trigger automatically
      // and load profile, workouts, and achievements
      console.log('⏳ Waiting for Firebase data to load...');
      await syncManager.waitForLoginLoad();

      setLoading(false);

      // Force page reload to ensure clean state with all data loaded
      console.log('🔄 Reloading page with fresh data...');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        setError(result.error || 'Google sign-in failed');
        setLoading(false);
        return;
      }

      if (result.user) {
        // Check if user profile exists in Firestore
        const userProfile = await getUserProfile(result.user.uid);

        if (!userProfile) {
          // Create new user profile for Google sign-in
          await createUserProfile(result.user.uid, {
            username: result.user.displayName || result.user.email?.split('@')[0] || 'User',
            email: result.user.email || '',
            proficiency: 'beginner',
            maxPushupsInOneSet: 0,
            isWorldRecordCandidate: false,
            totalXp: 0,
            coins: 0,
            currentRank: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastWorkoutDate: null,
            personalBest: 0,
            dailyGoal: 10,
            streakFreezes: 0,
          });
        }

        // Update local store to authenticated state
        await login(result.user.email || '', '');

        // Wait for sync manager to finish loading all data from Firebase
        console.log('⏳ Waiting for Firebase data to load...');
        await syncManager.waitForLoginLoad();
      }

      setLoading(false);

      // Force page reload to ensure clean state with all data loaded
      console.log('🔄 Reloading page with fresh data...');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-6">
      <div className="max-w-md w-full glass glass-border rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-display text-4xl font-bold text-accent mb-2">
            Push-Up League
          </div>
          <div className="text-gray-400">Welcome back, warrior</div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 glass-light border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
              required
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-dark-border"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-dark-border"></div>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mt-6 py-3 glass-light border border-dark-border rounded-lg hover:border-accent/50 transition flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-display text-white group-hover:text-accent transition">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-accent hover:text-accent-light font-bold transition"
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-dark-border text-center">
          <div className="text-xs text-gray-500">
            Secure authentication powered by Firebase
          </div>
        </div>
      </div>
    </div>
  );
};
