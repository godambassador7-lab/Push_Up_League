'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const basePath = process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_BASE_PATH || '')
    : '';
  const logoSrc = `${basePath}/logo.png`;

  useEffect(() => {
    const duration = 1500; // 1.5 seconds total
    const intervalTime = 20; // Update every 20ms
    const increment = (100 / duration) * intervalTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadComplete?.();
          }, 200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse delay-150" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="relative w-32 h-32 animate-fade-in">
          <img
            src={logoSrc}
            alt="Push Up League"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Loading Bar Container */}
        <div className="w-80 space-y-3">
          {/* Progress Bar Background */}
          <div className="relative h-3 bg-dark-card rounded-full overflow-hidden border border-dark-border">
            {/* Animated glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
              }}
            />

            {/* Progress Bar Fill */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-electric-blue to-cyan-bright rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 20px rgba(0, 188, 212, 0.5)',
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            </div>
          </div>

          {/* Percentage Display */}
          <div className="text-center">
            <span className="text-2xl font-bold font-display bg-gradient-to-r from-accent via-electric-blue to-cyan-bright bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-gray-400 text-sm uppercase tracking-widest animate-pulse">
          Initializing...
        </div>
      </div>
    </div>
  );
};
