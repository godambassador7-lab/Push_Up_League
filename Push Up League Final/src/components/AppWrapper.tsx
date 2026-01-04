'use client';

import { useState, ReactNode, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { AppProvider } from './AppProvider';

interface AppWrapperProps {
  children: ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Fallback: ensure loading completes even if callback fails
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second fallback

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}
      <div className={isLoading ? 'hidden' : 'block'}>
        <AppProvider>
          {children}
        </AppProvider>
      </div>
    </>
  );
}
