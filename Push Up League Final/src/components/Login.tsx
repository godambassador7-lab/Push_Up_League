'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/firebase';
import { useEnhancedStore } from '@/lib/enhancedStore';
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

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-dark-border text-center">
          <div className="text-xs text-gray-500">
            Secure authentication powered by Firebase
          </div>
        </div>
      </div>
    </div>
  );
};
