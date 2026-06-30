// Iron Mode - Session-based workout with integrated music

import type { NextSession } from './adaptiveEngine';

export type SessionType = 'free' | 'plan_day' | 'boss' | 'emom' | 'ladder';
export type Intensity = 'warmup' | 'grind' | 'boss' | 'cooldown';
export type SetDifficulty = 'easy' | 'okay' | 'hard';

export interface Track {
  trackId: string;
  title: string;
  artistName: string;
  intensity: Intensity;
  audioUrl: string;
  artistUrl?: string;
}

export interface SessionEvent {
  eventType: 'SET_START' | 'SET_COMPLETE' | 'REST_START' | 'PAUSE' | 'RESUME' | 'TRACK_CHANGE' | 'SESSION_END';
  timestamp: number;
  data?: any;
}

export interface SetLog {
  setNumber: number;
  variation: string;
  targetReps: number;
  actualReps: number;
  rir?: number; // Reps in reserve
  difficulty: SetDifficulty;
  timestamp: number;
  restAfter?: number; // seconds
}

export interface IronSession {
  sessionId: string;
  userId: string;
  startedAt: number;
  endedAt?: number;
  mode: SessionType;
  music: {
    enabled: boolean;
    trackId?: string;
    tracksPlayed: string[];
  };
  planContext?: {
    templateId?: string;
    variation: string;
  };
  adaptivePlan?: NextSession; // Adaptive training plan data (for plan_day sessions)
  sets: SetLog[];
  events: SessionEvent[];
  totalReps: number;
  totalTime: number; // seconds
  xpEarned?: number;
}

const trackAsset = (filename: string) =>
  `${process.env.NEXT_PUBLIC_RESOLVED_BASE_PATH || ''}/iron-mode-tracks/${filename}`;

const freebeatsCredit = {
  artistName: 'Freebeats.io',
  artistUrl: 'https://freebeats.io/',
};

// The curated Iron Mode library. Keep this list limited to provided app assets.
export const IRON_MODE_TRACKS: Record<string, Track> = {
  'dat-hitta': {
    trackId: 'dat-hitta',
    title: 'Dat Hitta',
    ...freebeatsCredit,
    intensity: 'grind',
    audioUrl: trackAsset('dat-hitta.mp3'),
  },
  dystopia: {
    trackId: 'dystopia',
    title: 'Dystopia',
    ...freebeatsCredit,
    intensity: 'grind',
    audioUrl: trackAsset('dystopia.mp3'),
  },
  flex: {
    trackId: 'flex',
    title: 'Flex',
    ...freebeatsCredit,
    intensity: 'warmup',
    audioUrl: trackAsset('flex.mp3'),
  },
  'flood-the-block': {
    trackId: 'flood-the-block',
    title: 'Flood The Block',
    ...freebeatsCredit,
    intensity: 'boss',
    audioUrl: trackAsset('flood-the-block.mp3'),
  },
  'my-clique': {
    trackId: 'my-clique',
    title: 'My Clique',
    ...freebeatsCredit,
    intensity: 'boss',
    audioUrl: trackAsset('my-clique.mp3'),
  },
};

// Helper functions
export const getTrackById = (trackId: string): Track | undefined => {
  return IRON_MODE_TRACKS[trackId];
};

export const calculateSessionXP = (session: IronSession): number => {
  let baseXP = session.totalReps * 2;

  // Bonus for completion without long pauses
  const pauseEvents = session.events.filter(e => e.eventType === 'PAUSE').length;
  if (pauseEvents === 0) {
    baseXP *= 1.2;
  }

  // Bonus for hitting targets
  const setsCompleted = session.sets.filter(s => s.actualReps >= s.targetReps).length;
  const completionRate = setsCompleted / (session.sets.length || 1);
  if (completionRate >= 0.9) {
    baseXP *= 1.15;
  }

  // Bonus for boss mode
  if (session.mode === 'boss') {
    baseXP *= 1.3;
  }

  return Math.floor(baseXP);
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};
