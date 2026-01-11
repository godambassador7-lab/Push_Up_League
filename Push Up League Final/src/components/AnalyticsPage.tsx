'use client';

import { useMemo, useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { PushUpType, getPushUpTypeData, PUSHUP_TYPES } from '@/lib/pushupTypes';
import { TrendingUp, Activity, Target, Calendar, BarChart3 } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
  displayDate: string;
}

interface VariationData {
  type: PushUpType;
  data: DataPoint[];
  total: number;
  average: number;
  peak: number;
  trend: 'up' | 'down' | 'stable';
}

// Convert PUSHUP_TYPES object to array of keys (outside component to avoid re-creation)
const pushupTypes = Object.keys(PUSHUP_TYPES) as PushUpType[];

export const AnalyticsPage = () => {
  const workouts = useEnhancedStore((state) => state.workouts);
  const variationStats = useEnhancedStore((state) => state.variationStats);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedVariation, setSelectedVariation] = useState<PushUpType | 'all'>('all');

  // Calculate analytics data for each variation
  const analyticsData = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        cutoffDate.setFullYear(2000); // Far past
        break;
    }

    const variationDataMap = new Map<PushUpType, DataPoint[]>();

    // Initialize all variation types
    pushupTypes.forEach(type => {
      variationDataMap.set(type, []);
    });

    // Process workouts and aggregate by date and type
    const dailyData = new Map<string, Map<PushUpType, number>>();

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate < cutoffDate) return;

      if (!dailyData.has(workout.date)) {
        dailyData.set(workout.date, new Map());
      }

      const dayData = dailyData.get(workout.date)!;

      if (workout.sets && workout.sets.length > 0) {
        workout.sets.forEach(set => {
          const currentReps = dayData.get(set.type) || 0;
          dayData.set(set.type, currentReps + set.reps);
        });
      } else {
        // Fallback to standard type
        const currentReps = dayData.get('standard') || 0;
        dayData.set('standard', currentReps + workout.pushups);
      }
    });

    // Convert to sorted data points
    const sortedDates = Array.from(dailyData.keys()).sort();

    sortedDates.forEach(date => {
      const dayData = dailyData.get(date)!;
      const displayDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      pushupTypes.forEach(type => {
        const reps = dayData.get(type) || 0;
        if (reps > 0) {
          variationDataMap.get(type)!.push({
            date,
            value: reps,
            displayDate,
          });
        }
      });
    });

    // Calculate statistics for each variation
    const variations: VariationData[] = pushupTypes.map(type => {
      const data = variationDataMap.get(type)!;
      const total = data.reduce((sum, d) => sum + d.value, 0);
      const average = data.length > 0 ? Math.round(total / data.length) : 0;
      const peak = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;

      // Calculate trend (compare first half vs second half)
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (data.length >= 4) {
        const midpoint = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, midpoint);
        const secondHalf = data.slice(midpoint);
        const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;

        if (secondAvg > firstAvg * 1.1) trend = 'up';
        else if (secondAvg < firstAvg * 0.9) trend = 'down';
      }

      return {
        type,
        data,
        total,
        average,
        peak,
        trend,
      };
    }).filter(v => v.total > 0); // Only show variations with data

    return variations;
  }, [workouts, timeRange]);

  // Get overall stats
  const overallStats = useMemo(() => {
    const totalReps = analyticsData.reduce((sum, v) => sum + v.total, 0);
    const totalWorkouts = new Set(
      workouts
        .filter(w => {
          const now = new Date();
          const cutoffDate = new Date();
          switch (timeRange) {
            case '7d': cutoffDate.setDate(now.getDate() - 7); break;
            case '30d': cutoffDate.setDate(now.getDate() - 30); break;
            case '90d': cutoffDate.setDate(now.getDate() - 90); break;
            default: cutoffDate.setFullYear(2000);
          }
          return new Date(w.date) >= cutoffDate;
        })
        .map(w => w.date)
    ).size;

    return { totalReps, totalWorkouts };
  }, [analyticsData, workouts, timeRange]);

  const filteredData = selectedVariation === 'all'
    ? analyticsData
    : analyticsData.filter(v => v.type === selectedVariation);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-3">
            <BarChart3 className="text-accent" size={32} />
            Performance Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">Track your progression across all push-up variations</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeRange === range
                  ? 'bg-accent text-dark'
                  : 'glass-light text-gray-400 hover:text-white'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-accent" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Reps</div>
          </div>
          <div className="text-2xl font-black text-accent">{overallStats.totalReps}</div>
        </div>

        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-electric-blue" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Workouts</div>
          </div>
          <div className="text-2xl font-black text-electric-blue">{overallStats.totalWorkouts}</div>
        </div>

        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-success" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Variations</div>
          </div>
          <div className="text-2xl font-black text-success">{analyticsData.length}</div>
        </div>

        <div className="glass glass-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-warning" />
            <div className="text-xs text-gray-400 uppercase tracking-wider">Avg/Day</div>
          </div>
          <div className="text-2xl font-black text-warning">
            {overallStats.totalWorkouts > 0
              ? Math.round(overallStats.totalReps / overallStats.totalWorkouts)
              : 0}
          </div>
        </div>
      </div>

      {/* Variation Filter */}
      <div className="glass glass-border rounded-lg p-4">
        <div className="text-sm font-bold text-white mb-3">Filter by Variation</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedVariation('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedVariation === 'all'
                ? 'bg-accent text-dark'
                : 'glass-light text-gray-400 hover:text-white'
            }`}
          >
            All Variations
          </button>
          {analyticsData.map(v => {
            const typeData = getPushUpTypeData(v.type);
            return (
              <button
                key={v.type}
                onClick={() => setSelectedVariation(v.type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedVariation === v.type
                    ? 'bg-accent text-dark'
                    : 'glass-light text-gray-400 hover:text-white'
                }`}
              >
                {typeData.emoji} {typeData.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Line Graphs */}
      <div className="space-y-6">
        {filteredData.length === 0 ? (
          <div className="glass glass-border rounded-lg p-8 text-center">
            <Activity size={48} className="text-gray-600 mx-auto mb-4" />
            <div className="text-lg font-bold text-gray-400">No data for this time range</div>
            <div className="text-sm text-gray-500 mt-2">Start logging workouts to see your analytics</div>
          </div>
        ) : (
          filteredData.map(variation => {
            const typeData = getPushUpTypeData(variation.type);
            const maxValue = variation.data.length > 0 ? Math.max(...variation.data.map(d => d.value)) : 1;

            return (
              <div key={variation.type} className="glass glass-border rounded-lg p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-black text-white flex items-center gap-2">
                      <span className="text-2xl">{typeData.emoji}</span>
                      {typeData.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{typeData.description}</div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                    variation.trend === 'up' ? 'bg-success/20 text-success' :
                    variation.trend === 'down' ? 'bg-error/20 text-error' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    <TrendingUp size={14} className={variation.trend === 'down' ? 'rotate-180' : ''} />
                    <span className="text-xs font-bold">
                      {variation.trend === 'up' ? 'Improving' : variation.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="glass-light rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Total Reps</div>
                    <div className="text-xl font-black text-accent">{variation.total}</div>
                  </div>
                  <div className="glass-light rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Average</div>
                    <div className="text-xl font-black text-electric-blue">{variation.average}</div>
                  </div>
                  <div className="glass-light rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Peak</div>
                    <div className="text-xl font-black text-success">{variation.peak}</div>
                  </div>
                </div>

                {/* Line Graph */}
                <div className="relative h-48 sm:h-64">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
                    <div className="text-right">{maxValue}</div>
                    <div className="text-right">{Math.round(maxValue * 0.75)}</div>
                    <div className="text-right">{Math.round(maxValue * 0.5)}</div>
                    <div className="text-right">{Math.round(maxValue * 0.25)}</div>
                    <div className="text-right">0</div>
                  </div>

                  {/* Graph area */}
                  <div className="absolute left-12 right-0 top-0 bottom-8">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="border-t border-dark-border/50" />
                      ))}
                    </div>

                    {/* Line and points */}
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      {/* Area fill */}
                      <defs>
                        <linearGradient id={`gradient-${variation.type}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={typeData.color} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={typeData.color} stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {variation.data.length > 1 && (
                        <>
                          {/* Area */}
                          <path
                            d={`
                              M 0,100
                              ${variation.data.map((point, i) => {
                                const x = (i / (variation.data.length - 1)) * 100;
                                const y = 100 - (point.value / maxValue) * 100;
                                return `L ${x},${y}`;
                              }).join(' ')}
                              L 100,100
                              Z
                            `}
                            fill={`url(#gradient-${variation.type})`}
                            vectorEffect="non-scaling-stroke"
                          />

                          {/* Line */}
                          <polyline
                            points={variation.data.map((point, i) => {
                              const x = (i / (variation.data.length - 1)) * 100;
                              const y = 100 - (point.value / maxValue) * 100;
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke={typeData.color}
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </>
                      )}

                      {/* Data points */}
                      {variation.data.map((point, i) => {
                        const x = variation.data.length === 1 ? 50 : (i / (variation.data.length - 1)) * 100;
                        const y = 100 - (point.value / maxValue) * 100;
                        return (
                          <g key={i}>
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill={typeData.color}
                              className="cursor-pointer hover:r-6 transition-all"
                            />
                            <title>{`${point.displayDate}: ${point.value} reps`}</title>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute left-12 right-0 bottom-0 h-8 flex justify-between items-center text-xs text-gray-500">
                    {variation.data.length > 0 && (
                      <>
                        <div>{variation.data[0].displayDate}</div>
                        {variation.data.length > 2 && (
                          <div>{variation.data[Math.floor(variation.data.length / 2)].displayDate}</div>
                        )}
                        {variation.data.length > 1 && (
                          <div>{variation.data[variation.data.length - 1].displayDate}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
