'use client';

import { useState, useEffect } from 'react';
import { SessionType, IRON_MODE_PLAYLISTS, getPlaylistTracks } from '@/lib/ironMode';
import { Music, Zap, Trophy, Clock, TrendingUp, Target } from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { recommendNextSession, NextSession } from '@/lib/adaptiveEngine';
import { getRecommendedTemplate, getTemplateById } from '@/lib/planTemplates';
import { userToAdaptiveUser, getRecentSessionLogs } from '@/lib/adaptiveUtils';
import { getTrainingPlan, getCurrentPlanDay, getTemplateForPlanDay, isWorkoutDay } from '@/lib/trainingPlans';
import { PlanSelector } from './PlanSelector';

interface IronModeSetupProps {
  onStartSession: (config: SessionConfig) => void;
  onCancel: () => void;
}

export interface SessionConfig {
  sessionType: SessionType;
  musicEnabled: boolean;
  playlistId?: string;
  loggingStyle: 'tap' | 'set';
  restTimer: boolean;
  restDuration: number; // seconds

  // Adaptive plan data (for plan_day sessions)
  adaptivePlan?: NextSession;
}

export const IronModeSetup = ({ onStartSession, onCancel }: IronModeSetupProps) => {
  const user = useUserStore();
  const [sessionType, setSessionType] = useState<SessionType>('free');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [playlistId, setPlaylistId] = useState('grind');
  const [loggingStyle, setLoggingStyle] = useState<'tap' | 'set'>('set');
  const [restTimer, setRestTimer] = useState(true);
  const [restDuration, setRestDuration] = useState(90);
  const [adaptivePlan, setAdaptivePlan] = useState<NextSession | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  // Generate adaptive plan when "Plan Day" is selected
  useEffect(() => {
    if (sessionType === 'plan_day') {
      const adaptiveUser = userToAdaptiveUser(user);

      // Check if user has an active training plan
      let template;
      if (user.activePlanId && user.planStartDate) {
        const trainingPlan = getTrainingPlan(user.activePlanId);
        if (trainingPlan) {
          const currentDay = getCurrentPlanDay(user.planStartDate, trainingPlan.duration);
          const templateId = getTemplateForPlanDay(trainingPlan, currentDay);

          if (templateId) {
            template = getTemplateById(templateId);
          }
        }
      }

      // Fall back to recommended template if no plan or template not found
      if (!template) {
        template = getRecommendedTemplate(user.division, user.goal);
      }

      const recentHistory = getRecentSessionLogs(user.workouts, 10);
      const plan = recommendNextSession(adaptiveUser, template, recentHistory);
      setAdaptivePlan(plan);

      // Set rest duration from plan
      if (plan.restSeconds) {
        setRestDuration(plan.restSeconds);
      }
    }
  }, [sessionType, user]);

  const handleStart = () => {
    onStartSession({
      sessionType,
      musicEnabled,
      playlistId: musicEnabled ? playlistId : undefined,
      loggingStyle,
      restTimer,
      restDuration,
      adaptivePlan: sessionType === 'plan_day' && adaptivePlan ? adaptivePlan : undefined,
    });
  };

  const sessionTypes: { id: SessionType; name: string; description: string; icon: any }[] = [
    {
      id: 'free',
      name: 'Free Session',
      description: 'No rules, just push-ups and music',
      icon: Zap,
    },
    {
      id: 'plan_day',
      name: 'Plan Day',
      description: 'Follow your adaptive training plan',
      icon: Target,
    },
    {
      id: 'boss',
      name: 'Boss Fight',
      description: 'Max intensity, chase a new record',
      icon: Trophy,
    },
    {
      id: 'emom',
      name: 'EMOM',
      description: 'Every minute on the minute',
      icon: Clock,
    },
    {
      id: 'ladder',
      name: 'Ladder',
      description: 'Progressive rep increase each set',
      icon: TrendingUp,
    },
  ];

  const playlists = Object.values(IRON_MODE_PLAYLISTS);
  const selectedPlaylist = playlistId ? IRON_MODE_PLAYLISTS[playlistId] : null;
  const selectedTracks = selectedPlaylist ? getPlaylistTracks(playlistId) : [];

  const activePlan = user.activePlanId ? getTrainingPlan(user.activePlanId) : null;
  const currentDay = activePlan && user.planStartDate ? getCurrentPlanDay(user.planStartDate, activePlan.duration) : null;
  const isTodayWorkoutDay = activePlan && currentDay ? isWorkoutDay(activePlan, currentDay) : false;

  return (
    <>
      {showPlanSelector && <PlanSelector onClose={() => setShowPlanSelector(false)} />}

      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-hero bg-gradient-to-r from-accent via-electric-blue to-warning bg-clip-text text-transparent mb-3">
              IRON MODE
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Session-based training with integrated music
            </p>
          </div>

          {/* Training Plan Info */}
          {sessionType === 'plan_day' && (
            <div className="glass glass-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Training Plan
                </div>
                <button
                  onClick={() => setShowPlanSelector(true)}
                  className="px-3 py-1.5 text-xs font-bold glass-light border border-accent/50 rounded hover:bg-accent/10 transition text-accent"
                >
                  {activePlan ? 'Change Plan' : 'Select Plan'}
                </button>
              </div>

              {activePlan && currentDay !== null ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{activePlan.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{activePlan.difficulty}</span>
                  </div>
                  <div className="text-sm text-gray-400">{activePlan.description}</div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Day:</span>
                      <span className="ml-2 font-bold text-accent">{currentDay} / {activePlan.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 font-bold ${isTodayWorkoutDay ? 'text-success' : 'text-warning'}`}>
                        {isTodayWorkoutDay ? 'Workout Day' : 'Rest Day'}
                      </span>
                    </div>
                  </div>
                  {!isTodayWorkoutDay && (
                    <div className="mt-3 p-3 bg-warning/10 border border-warning/30 rounded text-sm text-warning">
                      Today is a rest day in your plan. You can still workout or select a different session type.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-3">No training plan selected</p>
                  <button
                    onClick={() => setShowPlanSelector(true)}
                    className="px-4 py-2 bg-accent/20 border border-accent rounded font-bold text-accent hover:bg-accent/30 transition"
                  >
                    Choose a Plan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Session Type Selection */}
          <div className="glass glass-border rounded-lg p-4 sm:p-6">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Session Type
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sessionTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = sessionType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSessionType(type.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    isSelected
                      ? 'bg-accent/20 border-accent'
                      : 'glass-light border-dark-border hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      size={20}
                      className={isSelected ? 'text-accent' : 'text-gray-400'}
                    />
                    <div className={`font-bold ${isSelected ? 'text-accent' : 'text-white'}`}>
                      {type.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{type.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Music Settings */}
        <div className="glass glass-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music size={18} className="text-accent" />
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Music
              </div>
            </div>
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
                musicEnabled
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 border border-dark-border'
              }`}
            >
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {musicEnabled && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 mb-2">Select Playlist</div>
              {playlists.map((playlist) => {
                const isSelected = playlistId === playlist.playlistId;
                return (
                  <button
                    key={playlist.playlistId}
                    onClick={() => setPlaylistId(playlist.playlistId)}
                    className={`w-full p-3 rounded-lg border transition text-left ${
                      isSelected
                        ? 'bg-accent/10 border-accent'
                        : 'glass-light border-dark-border hover:border-accent/50'
                    }`}
                  >
                    <div className={`font-bold text-sm ${isSelected ? 'text-accent' : 'text-white'}`}>
                      {playlist.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{playlist.description}</div>
                    {isSelected && selectedTracks.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-dark-border">
                        <div className="text-xs text-gray-500 mb-1">Tracks:</div>
                        {selectedTracks.map((track) => (
                          <div key={track.trackId} className="text-xs text-gray-400">
                            • {track.title} - {track.artistName} ({track.bpm} BPM)
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Logging & Rest Settings */}
        <div className="glass glass-border rounded-lg p-4 sm:p-6 space-y-4">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Settings
          </div>

          {/* Logging Style */}
          <div>
            <div className="text-xs text-gray-500 mb-2">Rep Logging</div>
            <div className="flex gap-3">
              <button
                onClick={() => setLoggingStyle('set')}
                className={`flex-1 p-3 rounded-lg border transition ${
                  loggingStyle === 'set'
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'glass-light border-dark-border text-gray-400'
                }`}
              >
                <div className="font-bold text-sm">Set-Based</div>
                <div className="text-xs opacity-75">Recommended</div>
              </button>
              <button
                onClick={() => setLoggingStyle('tap')}
                className={`flex-1 p-3 rounded-lg border transition ${
                  loggingStyle === 'tap'
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'glass-light border-dark-border text-gray-400'
                }`}
              >
                <div className="font-bold text-sm">Tap-to-Count</div>
                <div className="text-xs opacity-75">Interactive</div>
              </button>
            </div>
          </div>

          {/* Rest Timer */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Rest Timer</div>
              <div className="text-xs text-gray-400">Auto-start after each set</div>
            </div>
            <button
              onClick={() => setRestTimer(!restTimer)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
                restTimer
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 border border-dark-border'
              }`}
            >
              {restTimer ? 'ON' : 'OFF'}
            </button>
          </div>

          {restTimer && (
            <div>
              <div className="text-xs text-gray-500 mb-2">Rest Duration (seconds)</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRestDuration(Math.max(30, restDuration - 15))}
                  className="px-3 py-2 glass-light rounded hover:bg-accent/20 transition"
                >
                  -15
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-accent">{restDuration}</div>
                  <div className="text-xs text-gray-500">seconds</div>
                </div>
                <button
                  onClick={() => setRestDuration(Math.min(300, restDuration + 15))}
                  className="px-3 py-2 glass-light rounded hover:bg-accent/20 transition"
                >
                  +15
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Adaptive Plan Preview (Plan Day only) */}
        {sessionType === 'plan_day' && adaptivePlan && (
          <div className="glass glass-border rounded-lg p-4 sm:p-6">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              AI Training Plan
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                    adaptivePlan.debug.status === 'PROMOTE'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : adaptivePlan.debug.status === 'REGRESS'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  }`}
                >
                  {adaptivePlan.debug.status}
                </div>
                {adaptivePlan.debug.plateau && (
                  <div className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                    PLATEAU DETECTED
                  </div>
                )}
              </div>

              {/* Workout Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Variation</div>
                  <div className="text-sm font-bold text-accent">{adaptivePlan.variation}</div>
                </div>
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Sets</div>
                  <div className="text-sm font-bold text-accent">{adaptivePlan.sets}</div>
                </div>
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Rest</div>
                  <div className="text-sm font-bold text-accent">{adaptivePlan.restSeconds}s</div>
                </div>
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Est. XP</div>
                  <div className="text-sm font-bold text-electric-blue">
                    {adaptivePlan.xp.estimatedXP}
                  </div>
                </div>
              </div>

              {/* Rep Targets */}
              <div className="glass-light p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Rep Targets</div>
                <div className="flex flex-wrap gap-2">
                  {adaptivePlan.targetReps.map((reps, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-accent/20 border border-accent/50 rounded text-sm font-bold text-accent"
                    >
                      Set {idx + 1}: {reps}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tempo */}
              {adaptivePlan.tempo && (
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Tempo</div>
                  <div className="text-sm text-gray-300">
                    <span className="font-bold text-accent">{adaptivePlan.tempo}</span>
                    <span className="text-xs ml-2 text-gray-500">
                      (eccentric-pause-concentric)
                    </span>
                  </div>
                </div>
              )}

              {/* Coaching Notes */}
              {adaptivePlan.coachingNotes.length > 0 && (
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-2">Coach Notes</div>
                  <div className="space-y-1">
                    {adaptivePlan.coachingNotes.map((note, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 glass-light rounded">
                  <div className="text-xs text-gray-500">Completion</div>
                  <div className="text-sm font-bold text-accent">
                    {Math.round(adaptivePlan.debug.completionRate * 100)}%
                  </div>
                </div>
                <div className="text-center p-2 glass-light rounded">
                  <div className="text-xs text-gray-500">Avg RIR</div>
                  <div className="text-sm font-bold text-accent">
                    {adaptivePlan.debug.avgRIR?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <div className="text-center p-2 glass-light rounded">
                  <div className="text-xs text-gray-500">Readiness</div>
                  <div className="text-sm font-bold text-accent">
                    {Math.round(adaptivePlan.debug.readiness * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 glass-light border border-dark-border rounded-lg font-bold hover:border-accent transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-3 bg-gradient-to-r from-accent to-electric-blue text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
