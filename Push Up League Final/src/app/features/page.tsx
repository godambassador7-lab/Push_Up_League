'use client';

import { useState } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';
import { Leaderboards } from '@/components/Leaderboards';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { Calendar, Users, Shield, Target } from 'lucide-react';

export default function FeaturesPage() {
  const [activeView, setActiveView] = useState<'calendar' | 'leaderboards'>('calendar');
  const isAuthenticated = useEnhancedStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-dark relative p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-accent mb-2">
            New Features
          </h1>
          <p className="text-gray-400">
            Enhanced tracking, integrity systems, and competitive leaderboards
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass glass-border rounded-lg p-4">
            <Calendar className="text-accent mb-3" size={32} />
            <div className="font-display font-bold text-white mb-1">
              Day Locking
            </div>
            <div className="text-sm text-gray-400">
              Lock completed days to prevent editing and maintain integrity
            </div>
          </div>

          <div className="glass glass-border rounded-lg p-4">
            <Shield className="text-accent mb-3" size={32} />
            <div className="font-display font-bold text-white mb-1">
              Integrity Algorithm
            </div>
            <div className="text-sm text-gray-400">
              Smart validation based on proficiency and world records
            </div>
          </div>

          <div className="glass glass-border rounded-lg p-4">
            <Target className="text-accent mb-3" size={32} />
            <div className="font-display font-bold text-white mb-1">
              Dynamic Goals
            </div>
            <div className="text-sm text-gray-400">
              Goals that adapt to your progress and skill level
            </div>
          </div>

          <div className="glass glass-border rounded-lg p-4">
            <Users className="text-accent mb-3" size={32} />
            <div className="font-display font-bold text-white mb-1">
              Dual Leaderboards
            </div>
            <div className="text-sm text-gray-400">
              Standard and World Record Leader competitions
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex-1 py-3 px-4 rounded-lg font-display font-bold transition ${
              activeView === 'calendar'
                ? 'glass-border bg-accent/10 text-accent'
                : 'glass-light text-gray-400 hover:text-white'
            }`}
          >
            <Calendar size={18} className="inline mr-2" />
            Workout Calendar
          </button>
          <button
            onClick={() => setActiveView('leaderboards')}
            className={`flex-1 py-3 px-4 rounded-lg font-display font-bold transition ${
              activeView === 'leaderboards'
                ? 'glass-border bg-accent/10 text-accent'
                : 'glass-light text-gray-400 hover:text-white'
            }`}
          >
            <Users size={18} className="inline mr-2" />
            Leaderboards
          </button>
        </div>

        {/* Content */}
        <div>
          {activeView === 'calendar' ? (
            <WorkoutCalendar />
          ) : (
            <Leaderboards />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 glass glass-border rounded-lg p-6">
          <div className="font-display text-xl font-bold text-white mb-4">
            How It Works
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <div className="font-bold text-accent mb-1">1. Profile Assessment</div>
              <div>
                During registration, you select your proficiency level and maximum push-ups in one set.
                This determines your starting goals and integrity thresholds.
              </div>
            </div>

            <div>
              <div className="font-bold text-accent mb-1">2. Integrity Validation</div>
              <div>
                Every workout is validated against your proficiency, personal history, and world record data.
                Suspicious patterns trigger warnings, while extreme anomalies require verification.
              </div>
            </div>

            <div>
              <div className="font-bold text-accent mb-1">3. Day Locking</div>
              <div>
                Once you're satisfied with a day's workout, lock it to prevent further edits. This ensures
                data integrity and creates a permanent record of your achievement.
              </div>
            </div>

            <div>
              <div className="font-bold text-accent mb-1">4. World Record Territory</div>
              <div>
                Athletes who claim world-class performance levels (200+ push-ups in one set or 10,000+ daily)
                are placed in the World Record Leaders board with exponentially harder goals. Exceptional
                performances may be submitted to Guinness World Records for verification.
              </div>
            </div>

            <div>
              <div className="font-bold text-accent mb-1">5. Progressive Goals</div>
              <div>
                Your daily goal increases based on your streak, personal best, and proficiency level.
                The system ensures you're always challenged but never overwhelmed.
              </div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
