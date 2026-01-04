'use client';

import { IronSession, calculateSessionXP, getTrackById } from '@/lib/ironMode';
import { Trophy, Clock, Zap, TrendingUp, Music, ExternalLink } from 'lucide-react';

interface IronModeSummaryProps {
  session: IronSession;
  onClose: () => void;
}

export const IronModeSummary = ({ session, onClose }: IronModeSummaryProps) => {
  const xpEarned = calculateSessionXP(session);
  const duration = session.totalTime;
  const setsCompleted = session.sets.length;
  const avgRepsPerSet = setsCompleted > 0 ? Math.round(session.totalReps / setsCompleted) : 0;

  // Calculate completion stats
  const targetHits = session.sets.filter((s) => s.actualReps >= s.targetReps).length;
  const completionRate = setsCompleted > 0 ? Math.round((targetHits / setsCompleted) * 100) : 0;

  // Music stats
  const uniqueTracks = new Set(session.music.tracksPlayed);
  const tracksListened = Array.from(uniqueTracks)
    .map((id) => getTrackById(id))
    .filter(Boolean);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center glass glass-border rounded-lg p-8">
          <div className="text-5xl mb-4">🏆</div>
          <div className="text-3xl sm:text-4xl font-black text-hero bg-gradient-to-r from-accent via-electric-blue to-warning bg-clip-text text-transparent mb-2">
            SESSION COMPLETE
          </div>
          <div className="text-gray-400">You crushed it!</div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass glass-border rounded-lg p-6 text-center">
            <div className="text-electric-blue mb-2">
              <Trophy size={32} className="mx-auto" />
            </div>
            <div className="text-3xl font-black text-accent">{session.totalReps}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Reps</div>
          </div>

          <div className="glass glass-border rounded-lg p-6 text-center">
            <div className="text-warning mb-2">
              <Zap size={32} className="mx-auto" />
            </div>
            <div className="text-3xl font-black text-warning">{xpEarned}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">XP Earned</div>
          </div>

          <div className="glass glass-border rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">
              <Clock size={28} className="mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">{formatTime(duration)}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Duration</div>
          </div>

          <div className="glass glass-border rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">
              <TrendingUp size={28} className="mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">{avgRepsPerSet}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Avg Reps/Set</div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="glass glass-border rounded-lg p-6">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Performance
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sets Completed</span>
              <span className="font-bold text-accent">{setsCompleted}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target Achievement</span>
              <span className="font-bold text-electric-blue">{completionRate}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Difficulty Rating</span>
              <div className="flex gap-1">
                {session.sets.map((set, i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 rounded ${
                      set.difficulty === 'easy'
                        ? 'bg-green-400'
                        : set.difficulty === 'okay'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Completion Rate Bar */}
            <div className="pt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className="h-3 bg-dark-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-electric-blue"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Music Section */}
        {session.music.enabled && tracksListened.length > 0 && (
          <div className="glass glass-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Music size={18} className="text-accent" />
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Music by
              </div>
            </div>

            <div className="space-y-3">
              {tracksListened.map((track) => (
                <div
                  key={track.trackId}
                  className="glass-light rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{track.title}</div>
                    <div className="text-sm text-gray-400">{track.artistName}</div>
                  </div>
                  <a
                    href={track.artistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 glass-light rounded-lg hover:bg-accent/20 transition text-accent"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              ))}

              <div className="text-xs text-gray-500 text-center pt-2">
                Tap to follow / stream / support
              </div>
            </div>
          </div>
        )}

        {/* Bonuses Applied */}
        <div className="glass glass-border rounded-lg p-6">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            XP Bonuses Applied
          </div>
          <div className="space-y-2 text-sm">
            {session.events.filter((e) => e.eventType === 'PAUSE').length === 0 && (
              <div className="flex justify-between items-center text-success">
                <span>✓ No pauses</span>
                <span className="font-bold">+20%</span>
              </div>
            )}
            {completionRate >= 90 && (
              <div className="flex justify-between items-center text-success">
                <span>✓ High completion rate</span>
                <span className="font-bold">+15%</span>
              </div>
            )}
            {session.mode === 'boss' && (
              <div className="flex justify-between items-center text-warning">
                <span>✓ Boss Mode</span>
                <span className="font-bold">+30%</span>
              </div>
            )}
          </div>
        </div>

        {/* Adaptive Plan Results (Plan Day only) */}
        {session.mode === 'plan_day' && session.adaptivePlan && (
          <div className="glass glass-border rounded-lg p-6 bg-accent/10 border-accent">
            <div className="text-sm font-bold text-accent uppercase tracking-wider mb-4">
              Plan Day Results
            </div>

            <div className="space-y-4">
              {/* Plan vs Actual Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Planned Variation</div>
                  <div className="text-sm font-bold text-white">
                    {session.adaptivePlan.variation}
                  </div>
                </div>
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Actual Variation</div>
                  <div className="text-sm font-bold text-white">
                    {session.sets[0]?.variation || session.adaptivePlan.variation}
                  </div>
                </div>
              </div>

              {/* Set Comparison */}
              <div className="glass-light p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Set Performance</div>
                <div className="space-y-2">
                  {session.adaptivePlan.targetReps.map((planned, idx) => {
                    const actual = session.sets[idx];
                    const hit = actual && actual.actualReps >= planned;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Set {idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {planned} planned
                          </span>
                          <span className="text-sm font-bold">→</span>
                          <span
                            className={`text-sm font-bold ${
                              hit ? 'text-success' : 'text-warning'
                            }`}
                          >
                            {actual?.actualReps || 0} done
                          </span>
                          {hit && <span className="text-success">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coaching Notes */}
              {session.adaptivePlan.coachingNotes.length > 0 && (
                <div className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-2">Coach Feedback</div>
                  <div className="space-y-1">
                    {session.adaptivePlan.coachingNotes.map((note, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${
                    session.adaptivePlan.debug.status === 'PROMOTE'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : session.adaptivePlan.debug.status === 'REGRESS'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  }`}
                >
                  Plan Status: {session.adaptivePlan.debug.status}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Session Recommendation */}
        <div className="glass glass-border rounded-lg p-6 bg-accent/10 border-accent">
          <div className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
            Next Session Recommendation
          </div>
          <div className="text-gray-300">
            {avgRepsPerSet >= 15
              ? '🔥 Strong performance! Consider increasing intensity or trying Boss Mode.'
              : avgRepsPerSet >= 10
              ? '💪 Solid work! Keep consistent to build endurance.'
              : '🎯 Focus on form over quantity. Quality reps build strength.'}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-accent to-electric-blue text-dark font-black text-lg rounded-lg hover:shadow-lg hover:shadow-accent/50 transition uppercase tracking-wider"
        >
          Back to Dashboard
        </button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <div>Session saved automatically</div>
          <div className="mt-1">
            Generated with{' '}
            <a href="https://claude.com/claude-code" className="text-accent hover:underline">
              Claude Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
