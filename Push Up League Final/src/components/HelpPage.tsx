'use client';

import { HelpCircle, Mail, MessageCircle, BookOpen, Shield, Zap } from 'lucide-react';

interface HelpPageProps {
  onBack: () => void;
}

export const HelpPage = ({ onBack }: HelpPageProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-hero text-accent">Help & FAQ</h2>
        <p className="text-gray-400 mt-1">Get answers and support</p>
      </div>

      {/* Support Contact */}
      <div className="glass glass-border rounded-lg p-6 bg-gradient-to-r from-accent/10 to-electric-blue/10">
        <div className="flex items-start gap-4">
          <Mail size={32} className="text-accent flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-black text-hero text-white mb-2">Need Help?</h3>
            <p className="text-gray-300 mb-3">
              Our support team is here to assist you with any questions or issues.
            </p>
            <a
              href="mailto:ygamify.help@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg text-accent font-display transition"
            >
              <Mail size={18} />
              ygamify.help@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-hero text-white flex items-center gap-2">
          <HelpCircle size={24} className="text-accent" />
          Frequently Asked Questions
        </h3>

        {/* Getting Started */}
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-start gap-3 mb-3">
            <BookOpen size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <h4 className="font-display text-lg font-bold text-white">Getting Started</h4>
          </div>
          <div className="space-y-4 ml-8">
            <div>
              <p className="font-display text-accent mb-1">How do I create an account?</p>
              <p className="text-sm text-gray-300">
                Click the menu icon and select "Create Account" or use the "Continue with Google" option for quick sign-up.
              </p>
            </div>
            <div>
              <p className="font-display text-accent mb-1">How do I log my first workout?</p>
              <p className="text-sm text-gray-300">
                Once logged in, use the workout logger on the dashboard. Enter your push-up count and press "Log Workout" to start earning XP!
              </p>
            </div>
            <div>
              <p className="font-display text-accent mb-1">What is XP and how do I earn it?</p>
              <p className="text-sm text-gray-300">
                XP (Experience Points) measures your progress. Earn XP by completing workouts, maintaining streaks, and achieving goals. The longer your streak, the higher your multiplier!
              </p>
            </div>
          </div>
        </div>

        {/* Progression System */}
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-start gap-3 mb-3">
            <Zap size={20} className="text-electric-blue flex-shrink-0 mt-0.5" />
            <h4 className="font-display text-lg font-bold text-white">Progression & Ranks</h4>
          </div>
          <div className="space-y-4 ml-8">
            <div>
              <p className="font-display text-electric-blue mb-1">What are the ranks?</p>
              <p className="text-sm text-gray-300">
                There are 8 ranks: Initiate → Iron Hand → Vanguard → Centurion → Titan → Ascendant → Mythic → Immortal. Each rank requires cumulative XP to unlock.
              </p>
            </div>
            <div>
              <p className="font-display text-electric-blue mb-1">How do streaks work?</p>
              <p className="text-sm text-gray-300">
                Complete at least one workout per day to maintain your streak. Streaks provide multipliers: 1.0x (1-3 days) up to 2.0x (60+ days)!
              </p>
            </div>
            <div>
              <p className="font-display text-electric-blue mb-1">What happens if I miss a day?</p>
              <p className="text-sm text-gray-300">
                Missing a day resets your streak and applies an XP penalty. Use a Streak Freeze power-up to save your streak for one missed day.
              </p>
            </div>
          </div>
        </div>

        {/* Gamification Features */}
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-start gap-3 mb-3">
            <MessageCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <h4 className="font-display text-lg font-bold text-white">Achievements & Rewards</h4>
          </div>
          <div className="space-y-4 ml-8">
            <div>
              <p className="font-display text-warning mb-1">How do achievements work?</p>
              <p className="text-sm text-gray-300">
                There are 302+ achievements across 6 categories. You'll unlock them automatically by completing workouts, hitting milestones, and maintaining consistency.
              </p>
            </div>
            <div>
              <p className="font-display text-warning mb-1">What can I do with coins?</p>
              <p className="text-sm text-gray-300">
                Coins can be spent in the Title Shop (110+ cosmetic titles) and Power-Ups Shop (strategic bonuses like Double XP, Streak Freeze, and more).
              </p>
            </div>
            <div>
              <p className="font-display text-warning mb-1">What are quests?</p>
              <p className="text-sm text-gray-300">
                Daily and weekly quests provide bonus XP and coins. Complete specific challenges like "Log 3 workouts this week" for extra rewards.
              </p>
            </div>
          </div>
        </div>

        {/* Account & Privacy */}
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-start gap-3 mb-3">
            <Shield size={20} className="text-success flex-shrink-0 mt-0.5" />
            <h4 className="font-display text-lg font-bold text-white">Account & Privacy</h4>
          </div>
          <div className="space-y-4 ml-8">
            <div>
              <p className="font-display text-success mb-1">Is my data safe?</p>
              <p className="text-sm text-gray-300">
                Yes! All data is securely stored using Firebase with end-to-end encryption. We follow industry best practices for data security.
              </p>
            </div>
            <div>
              <p className="font-display text-success mb-1">Can I delete my account?</p>
              <p className="text-sm text-gray-300">
                Yes. Go to Settings → Privacy → Clear All Data to permanently delete your account and all associated data.
              </p>
            </div>
            <div>
              <p className="font-display text-success mb-1">Does the app work offline?</p>
              <p className="text-sm text-gray-300">
                Yes! The app works offline and syncs your data automatically when you reconnect to the internet.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Issues */}
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-start gap-3 mb-3">
            <HelpCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <h4 className="font-display text-lg font-bold text-white">Troubleshooting</h4>
          </div>
          <div className="space-y-4 ml-8">
            <div>
              <p className="font-display text-error mb-1">My workout isn't saving</p>
              <p className="text-sm text-gray-300">
                Check your internet connection. If offline, the workout will be queued and synced when you're back online. If the problem persists, contact support.
              </p>
            </div>
            <div>
              <p className="font-display text-error mb-1">I can't log in with Google</p>
              <p className="text-sm text-gray-300">
                Make sure popups are enabled in your browser. Clear your cache and cookies, then try again. If issues continue, use email/password login.
              </p>
            </div>
            <div>
              <p className="font-display text-error mb-1">My achievements aren't unlocking</p>
              <p className="text-sm text-gray-300">
                Achievements are checked after each workout. Try refreshing the page or logging out and back in. Contact support if specific achievements seem stuck.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Support */}
      <div className="glass-light border border-dark-border rounded-lg p-5 text-center">
        <p className="text-gray-300 mb-3">Still have questions?</p>
        <a
          href="mailto:ygamify.help@gmail.com?subject=Push-Up League Support Request"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider font-display"
        >
          <Mail size={20} />
          Contact Support
        </a>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>Push-Up League v2.0.0 BETA</p>
        <p className="mt-1">Built with discipline. Powered by consistency.</p>
      </div>
    </div>
  );
};
