'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { TITLE_CATALOG, getCategoryColor, getCategoryGlowClass } from '@/lib/titleShop';
import { RankBadge } from './RankBadge';
import { Menu } from './Menu';
import { MenuIcon, Star } from 'lucide-react';
import { StreakFlame } from './StreakFlame';

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const basePath = process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_BASE_PATH || '')
    : '';
  const logoSrc = `${basePath}/logo.png`;

  const username = useUserStore((state) => state.username);
  const currentRank = useUserStore((state) => state.currentRank);
  const currentStreak = useUserStore((state) => state.currentStreak);
  const lastWorkoutDate = useUserStore((state) => state.lastWorkoutDate);
  const activeTitle = useEnhancedStore((state) => state.activeTitle);

  const activeTitleData = activeTitle ? TITLE_CATALOG.find(t => t.id === activeTitle) : null;
  const activeTitleClass = activeTitleData ? getCategoryColor(activeTitleData.category) : '';
  const activeTitleGlow = activeTitleData ? getCategoryGlowClass(activeTitleData.category) : '';

  const today = new Date().toISOString().split('T')[0];
  const isBroken = lastWorkoutDate !== today;

  return (
    <>
      <header className="border-b glass-border glass backdrop-blur-glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <img
              src={logoSrc}
              alt="Push Up League Logo"
              className="w-24 h-24 sm:w-[144px] sm:h-[144px] rounded-lg flex-shrink-0"
            />
            <div className="flex flex-col justify-center">
              <div className="font-black text-2xl sm:text-4xl lg:text-5xl text-hero bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent truncate uppercase" style={{ letterSpacing: '0.05em', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900 }}>PUSH-UP LEAGUE</div>
              <div className="sm:hidden text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2 py-0.5 bg-dark-border rounded w-fit mt-1">BETA</div>
            </div>
            <div className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2 py-0.5 bg-dark-border rounded flex-shrink-0">BETA</div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
            {/* User Info - Hidden on mobile */}
            <div className="hidden md:block text-right">
              <div className="flex items-center gap-2 justify-end">
                <div className="text-sm font-bold">{username}</div>
                {activeTitleData && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 glass-light border rounded text-xs ${activeTitleClass} ${activeTitleGlow}`}>
                    <Star size={10} fill="currentColor" />
                    <span className="font-bold">{activeTitleData.name}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <StreakFlame streak={currentStreak} isBroken={isBroken} size={12} />
                {currentStreak} day streak
              </div>
            </div>

            {/* Divider - Hidden on mobile */}
            <div className="hidden md:block h-10 w-px bg-dark-border" />

            {/* Rank Badge */}
            <RankBadge rank={currentRank} size="sm" />

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block h-10 w-px bg-dark-border" />

            {/* Menu Button */}
            <button
              onClick={() => setShowMenu(true)}
              className="p-1.5 sm:p-2 hover:bg-accent/10 rounded-lg transition active:scale-95"
              aria-label="Open menu"
            >
              <MenuIcon size={20} className="sm:w-6 sm:h-6 text-accent" />
            </button>
          </div>
        </div>
      </header>

      {showMenu && <Menu onClose={() => setShowMenu(false)} />}
    </>
  );
};
