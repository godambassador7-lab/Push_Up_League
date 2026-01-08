'use client';

import { useState } from 'react';
import { Settings, Info, X, ChevronRight, User, Lock, Bell, Palette, Database, LogOut, Save, Trash2, ShoppingBag, Zap, Youtube, AlertCircle, Flame, Scale } from 'lucide-react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { syncManager } from '@/lib/syncManager';
import { TitleShop } from './TitleShop';
import { PowerUpsShop } from './PowerUpsShop';
import { CalorieDashboard } from './CalorieDashboard';

interface MenuProps {
  onClose: () => void;
}

export const Menu = ({ onClose }: MenuProps) => {
  const [activeSection, setActiveSection] = useState<'main' | 'settings' | 'about' | 'profile' | 'privacy' | 'shop' | 'powerups' | 'calories' | 'legal'>('main');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const username = useEnhancedStore((state) => state.username);
  const email = useEnhancedStore((state) => state.email);
  const proficiency = useEnhancedStore((state) => state.proficiency);
  const maxPushupsInOneSet = useEnhancedStore((state) => state.maxPushupsInOneSet);
  const isAuthenticated = useEnhancedStore((state) => state.isAuthenticated);
  const totalXp = useEnhancedStore((state) => state.totalXp);
  const workouts = useEnhancedStore((state) => state.workouts);
  const logout = useEnhancedStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleManualSync = async () => {
    await syncManager.forceSyncNow();
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const handleClearData = () => {
    if (showClearConfirm) {
      localStorage.clear();
      window.location.reload();
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark/80 backdrop-blur-sm">
      <div className={`${activeSection === 'shop' || activeSection === 'powerups' ? 'max-w-6xl' : 'max-w-2xl'} w-full glass glass-border rounded-2xl overflow-hidden animate-fade-in transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-2xl font-bold font-display text-accent">
            {activeSection === 'main' && 'Menu'}
            {activeSection === 'settings' && 'Settings'}
            {activeSection === 'profile' && 'Profile'}
            {activeSection === 'privacy' && 'Privacy'}
            {activeSection === 'about' && 'About'}
            {activeSection === 'shop' && 'Title Shop'}
            {activeSection === 'powerups' && 'Power-Ups Shop'}
            {activeSection === 'calories' && 'Calorie Tracker'}
            {activeSection === 'legal' && 'Legal & Terms'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Main Menu */}
          {activeSection === 'main' && (
            <div className="space-y-4">
              {/* User Info */}
              {isAuthenticated && (
                <div className="p-4 glass-light rounded-lg border border-dark-border mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-electric-blue flex items-center justify-center">
                      <User size={24} className="text-dark" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{username}</div>
                      <div className="text-sm text-gray-400">{email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <button
                onClick={() => setActiveSection('powerups')}
                className="w-full p-4 glass-light rounded-lg border border-electric-blue/50 hover:border-electric-blue transition flex items-center justify-between group bg-electric-blue/5"
              >
                <div className="flex items-center gap-3">
                  <Zap size={20} className="text-electric-blue" />
                  <span className="font-display text-electric-blue">Power-Ups Shop</span>
                </div>
                <ChevronRight size={20} className="text-electric-blue/60 group-hover:text-electric-blue transition" />
              </button>

              <button
                onClick={() => setActiveSection('shop')}
                className="w-full p-4 glass-light rounded-lg border border-warning/50 hover:border-warning transition flex items-center justify-between group bg-warning/5"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-warning" />
                  <span className="font-display text-warning">Title Shop</span>
                </div>
                <ChevronRight size={20} className="text-warning/60 group-hover:text-warning transition" />
              </button>

              <button
                onClick={() => setActiveSection('calories')}
                className="w-full p-4 glass-light rounded-lg border border-error/50 hover:border-error transition flex items-center justify-between group bg-error/5"
              >
                <div className="flex items-center gap-3">
                  <Flame size={20} className="text-error" />
                  <span className="font-display text-error">Calorie Tracker</span>
                </div>
                <ChevronRight size={20} className="text-error/60 group-hover:text-error transition" />
              </button>

              <button
                onClick={() => setActiveSection('settings')}
                className="w-full p-4 glass-light rounded-lg border border-dark-border hover:border-accent/50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-accent" />
                  <span className="font-display">Settings</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-accent transition" />
              </button>

              <button
                onClick={() => setActiveSection('about')}
                className="w-full p-4 glass-light rounded-lg border border-dark-border hover:border-accent/50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Info size={20} className="text-accent" />
                  <span className="font-display">About</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-accent transition" />
              </button>

              <button
                onClick={() => setActiveSection('legal')}
                className="w-full p-4 glass-light rounded-lg border border-dark-border hover:border-accent/50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Scale size={20} className="text-accent" />
                  <span className="font-display">Legal & Terms</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-accent transition" />
              </button>

              {/* Logout Button */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full p-4 glass-light rounded-lg border border-red-500/50 hover:border-red-500 transition flex items-center justify-center gap-3 text-red-400 hover:text-red-300 mt-8"
                >
                  <LogOut size={20} />
                  <span className="font-display">Logout</span>
                </button>
              )}
            </div>
          )}

          {/* Power-Ups Shop Section */}
          {activeSection === 'powerups' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('main')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Menu
              </button>

              <PowerUpsShop />
            </div>
          )}

          {/* Title Shop Section */}
          {activeSection === 'shop' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('main')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Menu
              </button>

              <TitleShop />
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('main')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Menu
              </button>

              {/* Tutorial Notice Banner */}
              <div className="glass-light rounded-lg border border-electric-blue/50 p-4 bg-electric-blue/5">
                <div className="flex items-start gap-3">
                  <Youtube size={24} className="text-electric-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-display text-electric-blue mb-1 flex items-center gap-2">
                      Push-Up Form Tutorials Coming Soon
                      <AlertCircle size={16} className="text-electric-blue/60" />
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                      We're working on comprehensive video tutorials for all 58 push-up variations to help you master proper form and technique.
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="font-bold text-white">In the meantime:</span> Please reference YouTube or other trusted fitness sources to ensure correct form. Proper technique is essential for preventing injury and maximizing gains.
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-3">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-display">Account</div>
                <div className="glass-light rounded-lg border border-dark-border overflow-hidden">
                  <button
                    onClick={() => setActiveSection('profile')}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent/10 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-accent" />
                      <div className="text-left">
                        <div className="text-sm font-display">Profile</div>
                        <div className="text-xs text-gray-400">Manage your profile information</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-accent transition" />
                  </button>

                  <div className="border-t border-dark-border"></div>

                  <button
                    onClick={() => setActiveSection('privacy')}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent/10 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-accent" />
                      <div className="text-left">
                        <div className="text-sm font-display">Privacy</div>
                        <div className="text-xs text-gray-400">Data and privacy settings</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-accent transition" />
                  </button>
                </div>
              </div>

              {/* App Settings */}
              <div className="space-y-3">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-display">App</div>
                <div className="glass-light rounded-lg border border-dark-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-accent" />
                      <div>
                        <div className="text-sm font-display">Notifications</div>
                        <div className="text-xs text-gray-400">Workout reminders and achievements</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationsEnabled}
                        onChange={handleNotificationToggle}
                      />
                      <div className="w-11 h-6 bg-dark-border rounded-full peer peer-checked:bg-accent transition"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between border-t border-dark-border pt-4">
                    <div className="flex items-center gap-3">
                      <Palette size={18} className="text-accent" />
                      <div>
                        <div className="text-sm font-display">Theme</div>
                        <div className="text-xs text-gray-400">Dark mode (default)</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleManualSync}
                    className="w-full flex items-center justify-between border-t border-dark-border pt-4 hover:opacity-80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Database size={18} className="text-accent" />
                      <div className="text-left">
                        <div className="text-sm font-display">Data Storage</div>
                        <div className="text-xs text-gray-400">
                          {isAuthenticated ? 'Local + Firebase sync' : 'Local only'}
                        </div>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <div className="flex items-center gap-2">
                        {showSaveConfirm ? (
                          <span className="text-xs text-success">✓ Synced</span>
                        ) : (
                          <Save size={16} className="text-accent" />
                        )}
                      </div>
                    )}
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="glass-light rounded-lg border border-red-500/30 p-4 mt-6">
                  <div className="text-xs text-red-400 uppercase tracking-wider font-display mb-3">Danger Zone</div>
                  <button
                    onClick={handleClearData}
                    className="w-full p-3 glass-light rounded-lg border border-red-500/50 hover:border-red-500 transition flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm font-display">
                      {showClearConfirm ? 'Click again to confirm' : 'Clear All Local Data'}
                    </span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {showClearConfirm ? 'This cannot be undone!' : 'Removes all data from this device'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('settings')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Settings
              </button>

              <div className="glass-light rounded-lg border border-dark-border p-6 space-y-6">
                <h3 className="font-display text-lg text-accent">Profile Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Username</label>
                    <div className="glass-light border border-dark-border rounded-lg px-4 py-3 text-white">
                      {username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
                    <div className="glass-light border border-dark-border rounded-lg px-4 py-3 text-white">
                      {email || 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Proficiency Level</label>
                    <div className="glass-light border border-dark-border rounded-lg px-4 py-3 text-accent font-bold capitalize">
                      {proficiency}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Max Push-ups (One Set)</label>
                    <div className="glass-light border border-dark-border rounded-lg px-4 py-3 text-accent font-bold">
                      {maxPushupsInOneSet}
                    </div>
                  </div>

                  <div className="border-t border-dark-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total XP</span>
                      <span className="text-white font-bold">{totalXp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Workouts Logged</span>
                      <span className="text-white font-bold">{workouts.length}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Profile editing coming soon
                </p>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('settings')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Settings
              </button>

              <div className="glass-light rounded-lg border border-dark-border p-6 space-y-6">
                <h3 className="font-display text-lg text-accent">Privacy & Data</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-display mb-2">Data Collection</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We only collect data necessary for app functionality: workout logs, achievements,
                      and profile information. No personal data is sold or shared with third parties.
                    </p>
                  </div>

                  <div className="border-t border-dark-border pt-4">
                    <h4 className="text-sm font-display mb-2">Data Storage</h4>
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li>• Local data stored on your device</li>
                      <li>• Cloud backup via Firebase (when authenticated)</li>
                      <li>• End-to-end encryption for sensitive data</li>
                      <li>• You can delete your data anytime</li>
                    </ul>
                  </div>

                  <div className="border-t border-dark-border pt-4">
                    <h4 className="text-sm font-display mb-2">Account Deletion</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      To delete your account and all associated data, please contact support.
                    </p>
                    <button
                      onClick={() => alert('Support: pushup-league@support.com')}
                      className="text-xs text-accent hover:text-accent-light underline"
                    >
                      Request Account Deletion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('main')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Menu
              </button>

              {/* App Info */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-accent to-electric-blue flex items-center justify-center">
                  <span className="text-4xl font-bold text-dark">PL</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-accent">Push-Up League</h3>
                  <p className="text-sm text-gray-400 mt-1">Version 1.0.0</p>
                </div>
              </div>

              {/* Description */}
              <div className="glass-light rounded-lg border border-dark-border p-6 space-y-4">
                <div>
                  <h4 className="font-display text-accent mb-2">About the App</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Push-Up League is a gamified fitness tracking app designed to help you build
                    unstoppable discipline through consistent push-up training. Track your progress,
                    compete on global leaderboards, and achieve your fitness goals.
                  </p>
                </div>

                <div className="border-t border-dark-border pt-4">
                  <h4 className="font-display text-accent mb-2">Key Features</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Advanced proficiency system with integrity validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Dual leaderboards for standard and world-class athletes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Day locking system to preserve workout integrity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Firebase cloud sync with offline support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Dynamic daily goals based on your progression</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-dark-border pt-4">
                  <h4 className="font-display text-accent mb-2">Built With</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 14', 'React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Zustand'].map((tech) => (
                      <span key={tech} className="px-3 py-1 glass rounded-full text-xs text-gray-300 border border-dark-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Credits */}
              <div className="text-center text-xs text-gray-500 pt-4">
                <p>Created with dedication to fitness and discipline</p>
                <p className="mt-1">© 2025 Push-Up League. All rights reserved.</p>
              </div>
            </div>
          )}

          {/* Calorie Tracker Section */}
          {activeSection === 'calories' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('main')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Menu
              </button>

              <CalorieDashboard />
            </div>
          )}

          {/* Legal & Terms Section */}
          {activeSection === 'legal' && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection('main')}
                className="text-sm text-accent hover:text-accent-light flex items-center gap-2 mb-4"
              >
                ← Back to Menu
              </button>

              {/* Terms of Service */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={24} className="text-warning" />
                  <h3 className="text-xl font-black text-hero text-accent">Terms of Service & Liability Waiver</h3>
                </div>

                <div className="glass-light rounded-lg p-6 border border-dark-border space-y-4 max-h-[60vh] overflow-y-auto">
                  {/* Last Updated */}
                  <div className="text-xs text-gray-500 italic border-b border-dark-border pb-3">
                    Last Updated: January 8, 2026
                  </div>

                  {/* Introduction */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">1. ACCEPTANCE OF TERMS</h4>
                    <p className="text-sm text-gray-300">
                      By accessing and using Push-Up League ("the App"), you accept and agree to be bound by the
                      terms and conditions of this agreement. If you do not agree to these terms, you should not
                      use this application.
                    </p>
                  </div>

                  {/* Assumption of Risk */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">2. ASSUMPTION OF RISK</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      You acknowledge and understand that:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Physical exercise, including push-ups and other bodyweight exercises, involves inherent risks
                        of injury, including but not limited to muscle strains, joint injuries, cardiovascular events, and death.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>You are voluntarily participating in these activities with full knowledge of the risks involved.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>You assume all risks associated with the use of this App and any exercises performed based on
                        the App's features, including but not limited to injury, illness, or death.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Liability Waiver */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">3. RELEASE OF LIABILITY</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      To the fullest extent permitted by law, you hereby release, waive, discharge, and covenant not to sue
                      Push-Up League, its developers, owners, affiliates, employees, agents, and representatives (collectively,
                      "Released Parties") from any and all liability, claims, demands, actions, and causes of action whatsoever
                      arising out of or related to:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Any loss, damage, injury, or death that may be sustained by you or any property belonging to you,
                        whether caused by the negligence of the Released Parties or otherwise, while using the App or participating
                        in any activity suggested, tracked, or gamified by the App.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Any injury, disability, death, or loss or damage to person or property arising from your use of the App.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Medical Disclaimer */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">4. MEDICAL DISCLAIMER</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      This App is NOT a substitute for professional medical advice, diagnosis, or treatment. You acknowledge that:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>You should consult with a qualified healthcare provider before beginning any exercise program.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>The App does not provide medical advice and should not be relied upon as such.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>If you experience any pain, discomfort, or other symptoms during exercise, you should stop
                        immediately and consult a healthcare provider.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>You are solely responsible for your health and safety while using this App.</span>
                      </li>
                    </ul>
                  </div>

                  {/* User Responsibilities */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">5. USER RESPONSIBILITIES</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      By using this App, you agree to:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Research and practice proper exercise form and technique before attempting any exercises.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Listen to your body and exercise within your physical capabilities and limitations.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Use appropriate equipment and ensure a safe exercise environment.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Not hold the App or Released Parties responsible for any injuries, accidents, or harm sustained.</span>
                      </li>
                    </ul>
                  </div>

                  {/* No Warranty */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">6. NO WARRANTY</h4>
                    <p className="text-sm text-gray-300">
                      THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                      INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                      NON-INFRINGEMENT. The Released Parties make no warranty that the App will meet your requirements or that
                      it will be uninterrupted, timely, secure, or error-free.
                    </p>
                  </div>

                  {/* Limitation of Liability */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">7. LIMITATION OF LIABILITY</h4>
                    <p className="text-sm text-gray-300">
                      IN NO EVENT SHALL THE RELEASED PARTIES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                      OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS
                      OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA,
                      OR ANY OTHER LOSSES, WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, ARISING OUT
                      OF OR IN CONNECTION WITH YOUR USE OF THE APP, EVEN IF THE RELEASED PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY
                      OF SUCH DAMAGES.
                    </p>
                  </div>

                  {/* Indemnification */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">8. INDEMNIFICATION</h4>
                    <p className="text-sm text-gray-300">
                      You agree to indemnify, defend, and hold harmless the Released Parties from and against any and all claims,
                      liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that such parties
                      may incur as a result of or arising from your use of the App or your violation of these Terms of Service.
                    </p>
                  </div>

                  {/* Severability */}
                  <div>
                    <h4 className="font-bold text-accent mb-2">9. SEVERABILITY</h4>
                    <p className="text-sm text-gray-300">
                      If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or
                      eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect
                      and enforceable.
                    </p>
                  </div>

                  {/* Acknowledgment */}
                  <div className="border-t border-dark-border pt-4 mt-4">
                    <p className="text-sm text-gray-300 font-semibold">
                      BY USING THIS APP, YOU ACKNOWLEDGE THAT YOU HAVE READ THIS AGREEMENT, UNDERSTAND IT, AND AGREE TO BE BOUND BY ITS
                      TERMS AND CONDITIONS. YOU FURTHER AGREE THAT IT IS THE COMPLETE AND EXCLUSIVE STATEMENT OF THE AGREEMENT BETWEEN
                      YOU AND THE RELEASED PARTIES, WHICH SUPERSEDES ANY PROPOSAL OR PRIOR AGREEMENT, ORAL OR WRITTEN, AND ANY OTHER
                      COMMUNICATIONS BETWEEN YOU AND THE RELEASED PARTIES RELATING TO THE SUBJECT MATTER OF THIS AGREEMENT.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="glass rounded-lg p-4 border border-dark-border">
                  <h4 className="font-bold text-accent mb-2">Questions or Concerns?</h4>
                  <p className="text-sm text-gray-300">
                    If you have any questions about these terms or concerns about your use of the App, please discontinue use
                    and consult with a legal or medical professional as appropriate.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
