'use client';

import { Sparkles, Flame, Trophy, Shield, Gift, Zap, Calendar, TrendingUp } from 'lucide-react';

interface UpdatesPageProps {
  onBack: () => void;
}

export const UpdatesPage = ({ onBack }: UpdatesPageProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-hero text-accent">What's New</h2>
        <p className="text-gray-400 mt-1">Latest features and updates</p>
      </div>

      {/* Latest Updates Banner */}
      <div className="glass glass-border rounded-lg p-6 bg-gradient-to-r from-accent/10 to-electric-blue/10">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles size={28} className="text-accent" />
          <div>
            <h3 className="text-xl font-black text-hero text-white">Version 1.0.0 - Beta Release</h3>
            <p className="text-xs text-gray-400">January 2026</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Welcome to Push-Up League! We're excited to bring you a gamified fitness experience.
          More exciting features are coming soon!
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-hero text-white">🎮 Core Features</h3>

        {/* Animated Streak Flames */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Flame size={24} className="text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Animated Streak Flames</h4>
              <p className="text-sm text-gray-400">
                Dynamic color-changing flames that evolve with your streak! Orange → Green → Blue → Purple → Black with dancing animations.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Bonus System */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <Gift size={24} className="text-warning" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Random Daily Bonuses</h4>
              <p className="text-sm text-gray-400">
                2 surprise bonus days each week! Get +50% XP, 2x Coins, or both. Keep coming back to catch the bonuses!
              </p>
            </div>
          </div>
        </div>

        {/* Title Shop */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold/20">
              <Trophy size={24} className="text-gold" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Title Shop & Customization</h4>
              <p className="text-sm text-gray-400">
                Unlock and collect unique titles from Common to Legendary! Show off your achievements with custom flair.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <Shield size={24} className="text-success" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Safety First</h4>
              <p className="text-sm text-gray-400">
                Comprehensive safety waiver with electronic signature, legal terms, and injury prevention guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Power-Ups System */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-electric-blue/20">
              <Zap size={24} className="text-electric-blue" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Power-Ups Shop</h4>
              <p className="text-sm text-gray-400">
                Strategic power-ups including Streak Freeze, Double XP, Challenge Reroll, and Goal Reducer.
              </p>
            </div>
          </div>
        </div>

        {/* Workout Tracking */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rank-silver/20">
              <Calendar size={24} className="text-rank-silver" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Advanced Workout Calendar</h4>
              <p className="text-sm text-gray-400">
                Visual calendar with heatmap intensity, streak tracking, and detailed workout history.
              </p>
            </div>
          </div>
        </div>

        {/* Rank System */}
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rank-mythic/20">
              <TrendingUp size={24} className="text-rank-mythic" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">8-Tier Rank System</h4>
              <p className="text-sm text-gray-400">
                Progress from Initiate to Immortal! Earn XP, level up, and unlock achievements along the way.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="space-y-3">
        <h3 className="text-xl font-black text-hero text-white">✨ Other Features</h3>
        <div className="glass-light rounded-lg p-4 border border-dark-border">
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Multiple push-up variations with different XP/Coin multipliers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Daily goals with adaptive difficulty based on your progress</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Comprehensive achievement system with bronze, silver, gold, and platinum tiers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Quest system with daily and weekly challenges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Leaderboard for competitive tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Detailed statistics and progress tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Dark mode UI with glassmorphism design</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Mobile-optimized interface with iOS safe area support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="glass glass-border rounded-lg p-6 bg-gradient-to-r from-rank-mythic/10 to-rank-gold/10 border-rank-mythic/30">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={24} className="text-rank-mythic animate-pulse" />
          <h3 className="text-xl font-black text-hero text-rank-mythic">Coming Soon!</h3>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          We're constantly working on new features to make your fitness journey even more exciting. Stay tuned for:
        </p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-rank-mythic mt-0.5">🔮</span>
            <span>Social features and friend challenges</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rank-mythic mt-0.5">🔮</span>
            <span>More push-up variations and workout programs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rank-mythic mt-0.5">🔮</span>
            <span>Custom challenges and tournaments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rank-mythic mt-0.5">🔮</span>
            <span>Enhanced rewards and exclusive cosmetics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rank-mythic mt-0.5">🔮</span>
            <span>Integration with fitness trackers</span>
          </li>
        </ul>
        <div className="mt-4 pt-4 border-t border-rank-mythic/20">
          <p className="text-xs text-gray-400 italic">
            Have a feature request? We'd love to hear from you! Your feedback helps shape the future of Push-Up League.
          </p>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="glass-light rounded-lg p-4 border border-dark-border text-center">
        <p className="text-sm text-gray-300">
          Thank you for being part of the Push-Up League community! 💪
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Keep pushing, stay consistent, and achieve your goals!
        </p>
      </div>
    </div>
  );
};
