// Iron Mode - Session-based workout with integrated music

import type { NextSession } from './adaptiveEngine';

export type SessionType = 'free' | 'plan_day' | 'boss' | 'emom' | 'ladder';
export type Intensity = 'warmup' | 'grind' | 'boss' | 'cooldown';
export type SetDifficulty = 'easy' | 'okay' | 'hard';

export interface Track {
  trackId: string;
  title: string;
  artistName: string;
  artistHandle: string;
  licenseType: 'royalty_free_collab';
  bpm: number;
  intensity: Intensity;
  audioUrl: string;
  artistUrl: string;
}

export interface Playlist {
  playlistId: string;
  name: string;
  description: string;
  intensity: Intensity;
  trackIds: string[];
}

export interface SessionEvent {
  eventType: 'SET_START' | 'SET_COMPLETE' | 'REST_START' | 'PAUSE' | 'RESUME' | 'SESSION_END';
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
    playlistId?: string;
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

// Music Tracks - Royalty-free from Freebeats.io
export const IRON_MODE_TRACKS: Record<string, Track> = {
  dystopia: {
    trackId: 'dystopia',
    title: 'Dystopia',
    artistName: 'Freebeats.io',
    artistHandle: '@freebeatsio',
    licenseType: 'royalty_free_collab',
    bpm: 140,
    intensity: 'grind',
    audioUrl: '/Dystopia - by Freebeats.io.mp3',
    artistUrl: 'https://freebeats.io',
  },
  myClique: {
    trackId: 'my-clique',
    title: 'My Clique',
    artistName: 'Freebeats.io',
    artistHandle: '@freebeatsio',
    licenseType: 'royalty_free_collab',
    bpm: 150,
    intensity: 'boss',
    audioUrl: '/My Clique - by Freebeats.io.mp3',
    artistUrl: 'https://freebeats.io',
  },
  thuggedOut: {
    trackId: 'thugged-out',
    title: 'Thugged Out',
    artistName: 'Freebeats.io',
    artistHandle: '@freebeatsio',
    licenseType: 'royalty_free_collab',
    bpm: 145,
    intensity: 'grind',
    audioUrl: '/Thugged Out - by Freebeats.io.mp3',
    artistUrl: 'https://freebeats.io',
  },
};

// Playlists
export const IRON_MODE_PLAYLISTS: Record<string, Playlist> = {
  grind: {
    playlistId: 'grind',
    name: 'The Grind',
    description: 'High-intensity workout playlist to push your limits',
    intensity: 'grind',
    trackIds: ['dystopia', 'thugged-out'],
  },
  boss: {
    playlistId: 'boss',
    name: 'Boss Fight',
    description: 'Maximum intensity for crushing personal records',
    intensity: 'boss',
    trackIds: ['my-clique', 'dystopia', 'thugged-out'],
  },
  full: {
    playlistId: 'full',
    name: 'Full Session',
    description: 'Complete workout playlist rotating all tracks',
    intensity: 'grind',
    trackIds: ['dystopia', 'my-clique', 'thugged-out'],
  },
};

// Helper functions
export const getTrackById = (trackId: string): Track | undefined => {
  return IRON_MODE_TRACKS[trackId];
};

export const getPlaylistById = (playlistId: string): Playlist | undefined => {
  return IRON_MODE_PLAYLISTS[playlistId];
};

export const getPlaylistTracks = (playlistId: string): Track[] => {
  const playlist = IRON_MODE_PLAYLISTS[playlistId];
  if (!playlist) return [];
  return playlist.trackIds.map(id => IRON_MODE_TRACKS[id]).filter(Boolean);
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
