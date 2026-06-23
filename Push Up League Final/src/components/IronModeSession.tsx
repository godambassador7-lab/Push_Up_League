'use client';

import { useState, useEffect, useRef } from 'react';
import { SessionConfig } from './IronModeSetup';
import {
  IronSession,
  SetLog,
  SetDifficulty,
  SessionEvent,
  calculateSessionXP,
  getTrackById,
  generateSessionId,
} from '@/lib/ironMode';
import { Play, Pause, Plus, Check, X } from 'lucide-react';
import { PushUpType, PUSHUP_TYPES } from '@/lib/pushupTypes';

interface IronModeSessionProps {
  config: SessionConfig;
  onEndSession: (session: IronSession) => void;
  userId: string;
}

const pushUpTypes = Object.values(PUSHUP_TYPES);

export const IronModeSession = ({ config, onEndSession, userId }: IronModeSessionProps) => {
  // Session state
  const [session, setSession] = useState<IronSession>(() => ({
    sessionId: generateSessionId(),
    userId,
    startedAt: Date.now(),
    mode: config.sessionType,
    music: {
      enabled: config.musicEnabled,
      trackId: config.trackId,
      tracksPlayed: config.musicEnabled && config.trackId ? [config.trackId] : [],
    },
    sets: [],
    events: [],
    totalReps: 0,
    totalTime: 0,
  }));

  // Current set state
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(10);
  const [currentVariation, setCurrentVariation] = useState<PushUpType>(
    config.variationIds[0] ?? 'standard'
  );
  const [targetReps, setTargetReps] = useState(10);
  const [difficulty, setDifficulty] = useState<SetDifficulty>('okay');

  // Timer state
  const [sessionTime, setSessionTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Music state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = config.trackId ? getTrackById(config.trackId) : undefined;

  // Session timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Rest timer
  useEffect(() => {
    if (!isResting || isPaused) return;

    const interval = setInterval(() => {
      setRestTime((prev) => {
        if (prev >= config.restDuration) {
          setIsResting(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, isPaused, config.restDuration]);

  // Music auto-play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !config.musicEnabled) return;

    if (isPaused) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => setIsPlaying(false));
  }, [config.musicEnabled, currentTrack, isPaused]);

  // Auto-save session draft
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('iron-mode-draft', JSON.stringify(session));
    }, 5000);

    return () => clearInterval(interval);
  }, [session]);

  const playMusic = () => {
    if (audioRef.current && currentTrack) {
      void audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);

    if (newPausedState) {
      pauseMusic();
      addEvent('PAUSE');
    } else {
      playMusic();
      addEvent('RESUME');
    }
  };

  const addEvent = (eventType: SessionEvent['eventType'], data?: any) => {
    setSession((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          eventType,
          timestamp: Date.now(),
          data,
        },
      ],
    }));
  };

  const completeSet = () => {
    const setLog: SetLog = {
      setNumber: currentSet,
      variation: currentVariation,
      targetReps,
      actualReps: currentReps,
      difficulty,
      timestamp: Date.now(),
      restAfter: config.restTimer ? config.restDuration : undefined,
    };

    setSession((prev) => ({
      ...prev,
      sets: [...prev.sets, setLog],
      totalReps: prev.totalReps + currentReps,
    }));

    addEvent('SET_COMPLETE', setLog);

    // Auto-save after completing set
    localStorage.setItem(
      'iron-mode-draft',
      JSON.stringify({ ...session, sets: [...session.sets, setLog] })
    );

    // Start rest timer
    if (config.restTimer) {
      setIsResting(true);
      setRestTime(0);
      addEvent('REST_START');

      // Duck music volume during rest
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
      }
    }

    // Prepare next set
    if (config.variationMode === 'rotate' && config.variationIds.length > 0) {
      const nextVariationIndex = currentSet % config.variationIds.length;
      setCurrentVariation(config.variationIds[nextVariationIndex]);
    }
    setCurrentSet((prev) => prev + 1);
    setCurrentReps(10);
    setDifficulty('okay');
  };

  // Restore music volume after rest
  useEffect(() => {
    if (!isResting && audioRef.current) {
      audioRef.current.volume = 1.0;
    }
  }, [isResting]);

  const endSession = () => {
    const endedAt = Date.now();
    const completedSession: IronSession = {
      ...session,
      endedAt,
      events: [
        ...session.events,
        { eventType: 'SESSION_END', timestamp: endedAt },
      ],
      totalTime: sessionTime,
    };
    const finalSession: IronSession = {
      ...completedSession,
      xpEarned: calculateSessionXP(completedSession),
    };

    pauseMusic();
    localStorage.removeItem('iron-mode-draft');
    onEndSession(finalSession);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-dark p-4">
      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          loop
          autoPlay={config.musicEnabled}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header - Session Timer */}
        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Session Time</div>
              <div className="text-3xl font-black text-accent">{formatTime(sessionTime)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Total Reps</div>
              <div className="text-2xl font-bold text-electric-blue">{session.totalReps}</div>
            </div>
          </div>
        </div>

        {/* Now Playing */}
        {config.musicEnabled && currentTrack && (
          <div className="glass glass-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">Now Playing</div>
                <div className="font-bold text-white truncate">{currentTrack.title}</div>
                <div className="text-xs text-gray-500">{currentTrack.artistName}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (isPlaying ? pauseMusic() : playMusic())}
                  className="p-2 glass-light rounded-lg hover:bg-accent/20 transition"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest Timer */}
        {isResting && (
          <div className="glass glass-border rounded-lg p-6 bg-accent/10 border-accent">
            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Rest Period</div>
              <div className="text-5xl font-black text-accent mb-2">
                {formatTime(config.restDuration - restTime)}
              </div>
              <div className="h-2 bg-dark-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000"
                  style={{ width: `${(restTime / config.restDuration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Current Set Card */}
        {!isResting && (
          <div className="glass glass-border rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400 uppercase tracking-wider">Set {currentSet}</div>
              <div className="text-xl font-bold text-white mt-1">
                {PUSHUP_TYPES[currentVariation].name}
              </div>
            </div>

            {/* Rep Input */}
            <div className="space-y-4">
              {config.variationMode === 'manual' && (
                <label className="block">
                  <span className="block text-xs text-gray-400 mb-2">Push-Up Type</span>
                  <select
                    value={currentVariation}
                    onChange={(event) => setCurrentVariation(event.target.value as PushUpType)}
                    className="w-full min-h-11 rounded-lg border border-dark-border bg-dark-card px-3 text-sm font-bold text-white outline-none focus:border-accent"
                  >
                    {pushUpTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.difficulty}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div>
                <div className="text-xs text-gray-400 mb-2">Reps Completed</div>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={() => setCurrentReps(Math.max(1, currentReps - 1))}
                    className="p-3 glass-light rounded-lg hover:bg-accent/20 transition"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setCurrentReps(Math.max(1, currentReps - 5))}
                    className="p-3 glass-light rounded-lg hover:bg-accent/20 transition"
                  >
                    -5
                  </button>
                  <div className="w-24 text-center">
                    <input
                      type="number"
                      value={currentReps}
                      onChange={(e) => setCurrentReps(parseInt(e.target.value) || 1)}
                      className="w-full glass-light border border-accent rounded-lg px-4 py-3 text-center text-3xl font-black text-accent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setCurrentReps(currentReps + 5)}
                    className="p-3 glass-light rounded-lg hover:bg-accent/20 transition"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => setCurrentReps(currentReps + 1)}
                    className="p-3 glass-light rounded-lg hover:bg-accent/20 transition"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <div className="text-xs text-gray-400 mb-2 text-center">How did it feel?</div>
                <div className="flex gap-2 justify-center">
                  {(['easy', 'okay', 'hard'] as SetDifficulty[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-2 rounded-lg font-bold capitalize transition ${
                        difficulty === level
                          ? 'bg-accent text-dark'
                          : 'glass-light text-gray-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete Set Button */}
              <button
                onClick={completeSet}
                className="w-full py-4 bg-gradient-to-r from-accent to-electric-blue text-dark font-black text-lg rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Check size={24} />
                Complete Set
              </button>
            </div>
          </div>
        )}

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass glass-border rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Sets Completed</div>
            <div className="text-2xl font-bold text-accent mt-1">{session.sets.length}</div>
          </div>
          <div className="glass glass-border rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Reps/Set</div>
            <div className="text-2xl font-bold text-electric-blue mt-1">
              {session.sets.length > 0
                ? Math.round(session.totalReps / session.sets.length)
                : 0}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={togglePause}
            className="flex-1 py-3 glass-light border border-accent rounded-lg font-bold hover:bg-accent/10 transition"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={endSession}
            className="flex-1 py-3 bg-gradient-to-r from-warning to-gold text-dark font-bold rounded-lg hover:shadow-lg transition uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <X size={20} />
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};
