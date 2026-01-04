'use client';

import { useState } from 'react';
import { IronModeSetup, SessionConfig } from './IronModeSetup';
import { IronModeSession } from './IronModeSession';
import { IronModeSummary } from './IronModeSummary';
import { IronSession } from '@/lib/ironMode';
import { useEnhancedStore } from '@/lib/enhancedStore';

type IronModeScreen = 'setup' | 'session' | 'summary';

interface IronModeProps {
  onExit: () => void;
}

export const IronMode = ({ onExit }: IronModeProps) => {
  const [screen, setScreen] = useState<IronModeScreen>('setup');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [completedSession, setCompletedSession] = useState<IronSession | null>(null);

  const userId = useEnhancedStore((state) => state.userId);
  const addWorkout = useEnhancedStore((state) => state.logWorkout);
  const addXP = useEnhancedStore((state) => state.addXP);

  const handleStartSession = (config: SessionConfig) => {
    setSessionConfig(config);
    setScreen('session');
  };

  const handleEndSession = (session: IronSession) => {
    setCompletedSession(session);

    // Save to store
    if (session.endedAt && session.xpEarned) {
      // Log as workout
      addWorkout(session.totalReps, session.sets);

      // Award XP
      addXP(session.xpEarned);
    }

    // Save session to localStorage history
    const savedSessions = JSON.parse(localStorage.getItem('iron-mode-sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('iron-mode-sessions', JSON.stringify(savedSessions));

    setScreen('summary');
  };

  const handleExit = () => {
    setScreen('setup');
    setSessionConfig(null);
    setCompletedSession(null);
    onExit();
  };

  return (
    <>
      {screen === 'setup' && (
        <IronModeSetup onStartSession={handleStartSession} onCancel={onExit} />
      )}

      {screen === 'session' && sessionConfig && (
        <IronModeSession
          config={sessionConfig}
          onEndSession={handleEndSession}
          userId={userId}
        />
      )}

      {screen === 'summary' && completedSession && (
        <IronModeSummary session={completedSession} onClose={handleExit} />
      )}
    </>
  );
};
