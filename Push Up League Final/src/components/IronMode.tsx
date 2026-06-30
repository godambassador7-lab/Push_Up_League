'use client';

import { useEffect, useRef, useState } from 'react';
import { IronModeSetup, SessionConfig } from './IronModeSetup';
import { IronModeSession } from './IronModeSession';
import { IronModeSummary } from './IronModeSummary';
import { IronSession } from '@/lib/ironMode';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { WorkoutSet } from '@/lib/enhancedStore';
import { PUSHUP_TYPES, PushUpType } from '@/lib/pushupTypes';
import countdownSoundUrl from '../3 Seconds Timer With Sound Effect.mp3';

type IronModeScreen = 'setup' | 'starting' | 'session' | 'summary';
type StartCue = 3 | 2 | 1 | 'Start Reps';

const START_REPS_CUE_MS = 700;

interface IronModeProps {
  onExit: () => void;
}

export const IronMode = ({ onExit }: IronModeProps) => {
  const [screen, setScreen] = useState<IronModeScreen>('setup');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [completedSession, setCompletedSession] = useState<IronSession | null>(null);
  const [startCue, setStartCue] = useState<StartCue>(3);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const countdownCueTimeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sessionStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userId = useEnhancedStore((state) => state.userId);
  const addWorkout = useEnhancedStore((state) => state.logWorkout);

  const clearStartCountdown = () => {
    countdownCueTimeoutRefs.current.forEach(clearTimeout);
    countdownCueTimeoutRefs.current = [];

    if (sessionStartTimeoutRef.current) {
      clearTimeout(sessionStartTimeoutRef.current);
      sessionStartTimeoutRef.current = null;
    }

    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current.onplaying = null;
    }
  };

  useEffect(() => clearStartCountdown, []);

  const scheduleStartCues = (startedAt: number) => {
    const scheduleCue = (delayMs: number, cue: StartCue) => {
      const delayFromNow = Math.max(0, startedAt + delayMs - performance.now());
      const timeout = setTimeout(() => setStartCue(cue), delayFromNow);
      countdownCueTimeoutRefs.current.push(timeout);
    };

    scheduleCue(1000, 2);
    scheduleCue(2000, 1);
    scheduleCue(3000, 'Start Reps');

    sessionStartTimeoutRef.current = setTimeout(() => {
      clearStartCountdown();
      setScreen('session');
    }, Math.max(0, startedAt + 3000 + START_REPS_CUE_MS - performance.now()));
  };

  const handleStartSession = (config: SessionConfig) => {
    clearStartCountdown();
    setSessionConfig(config);
    setStartCue(3);
    setScreen('starting');

    if (typeof window !== 'undefined') {
      const audio = countdownAudioRef.current ?? new Audio(countdownSoundUrl);
      let cuesScheduled = false;
      const scheduleOnce = () => {
        if (cuesScheduled) return;
        cuesScheduled = true;
        scheduleStartCues(performance.now());
      };

      countdownAudioRef.current = audio;
      audio.currentTime = 0;
      audio.onplaying = scheduleOnce;
      void audio.play().then(scheduleOnce).catch(scheduleOnce);
      return;
    }

    scheduleStartCues(performance.now());
  };

  const handleEndSession = (session: IronSession) => {
    setCompletedSession(session);

    // Save to store
    if (session.endedAt && session.totalReps > 0) {
      const workoutSets: WorkoutSet[] = session.sets.map((set) => {
        const normalizedVariation = set.variation
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-');
        const candidate = normalizedVariation === 'incline'
          ? 'high-incline'
          : normalizedVariation;
        const type = candidate in PUSHUP_TYPES
          ? candidate as PushUpType
          : 'standard';

        return {
          reps: set.actualReps,
          type,
          restAfter: set.restAfter,
          targetReps: set.targetReps,
          difficulty: set.difficulty,
          completedAt: set.timestamp,
        };
      });

      addWorkout(session.totalReps, workoutSets, false, Math.round(session.totalTime / 60));
    }

    // Save session to localStorage history
    const savedSessions = JSON.parse(localStorage.getItem('iron-mode-sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('iron-mode-sessions', JSON.stringify(savedSessions));

    setScreen('summary');
  };

  const handleExit = () => {
    clearStartCountdown();
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

      {screen === 'starting' && (
        <div className="min-h-screen bg-dark px-4">
          <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center">
            <div className="w-full text-center">
              <div className="mb-6 text-sm font-black uppercase tracking-wider text-gray-400 sm:text-base">
                {startCue === 'Start Reps' ? 'Iron Mode' : 'Session starts in'}
              </div>
              <div
                className={`font-black uppercase leading-none tracking-normal ${
                  startCue === 'Start Reps'
                    ? 'text-6xl text-warning sm:text-8xl md:text-9xl'
                    : 'text-[12rem] text-accent sm:text-[18rem] md:text-[22rem]'
                }`}
              >
                {startCue}
              </div>
              <button
                type="button"
                onClick={() => {
                  clearStartCountdown();
                  setScreen('setup');
                }}
                className="mt-8 rounded-lg border border-dark-border px-5 py-2 text-sm font-bold text-gray-300 transition hover:border-warning hover:text-warning"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
