import React, { useState, useMemo } from 'react';
import { Clock, Sliders, ChevronDown, ChevronUp, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Friend, CircleTier, HealthStatus } from '../../types';
import {
  getStatusColor,
  getDaysElapsed,
  getTargetCadence,
  classifyStatus,
} from '../../lib/relationshipEngine';
import { useFriends } from '../../context/FriendContext';

interface HealthGaugeProps {
  friend: Friend;
}

const TIERS: CircleTier[] = [
  'Inner Circle',
  'Close Friends',
  'Key Network',
  'Acquaintances',
];

export const HealthGauge: React.FC<HealthGaugeProps> = ({ friend }) => {
  const { updateFriend, openCommandPalette } = useFriends();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatedDaysAhead, setSimulatedDaysAhead] = useState(7);

  const statusColors = getStatusColor(friend.status);
  const daysElapsed = getDaysElapsed(friend.lastContactDate);
  const cadence = getTargetCadence(friend);

  // SVG Radial Gauge parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (friend.healthScore / 100) * circumference;

  // Projected health calculation for simulator
  const projectedDaysElapsed = daysElapsed + simulatedDaysAhead;
  const projectedScore = useMemo(() => {
    if (simulatedDaysAhead === 0) return friend.healthScore;
    const decayExponent = -0.693 * (projectedDaysElapsed / Math.max(1, cadence));
    const raw = 100 * Math.exp(decayExponent);
    return Math.max(0, Math.min(100, Math.round(raw)));
  }, [daysElapsed, simulatedDaysAhead, cadence, friend.healthScore, projectedDaysElapsed]);

  const projectedStatus: HealthStatus = classifyStatus(projectedScore);
  const projectedStatusColors = getStatusColor(projectedStatus);

  const handleTierChange = (newTier: CircleTier) => {
    updateFriend(friend.id, { circleTier: newTier });
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Top Gauge & Cadence Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Health Radial Gauge */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Health Score animated ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={statusColors.ring}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                {friend.healthScore}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Health
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
              >
                {friend.status}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Exponential Half-Life Model
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {friend.healthScore >= 80
                ? 'Thriving Relationship'
                : friend.healthScore >= 50
                ? 'Steady Connection'
                : friend.healthScore >= 25
                ? 'Drifting from Cadence'
                : 'Overdue for Outreach'}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {daysElapsed === 0
                ? 'Interacted today!'
                : `${daysElapsed} days elapsed since last logged connection.`}
            </p>
          </div>
        </div>

        {/* Right: Cadence Controls & Telemetry */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Tier Selector */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cadence Tier
            </label>
            <select
              value={friend.circleTier}
              onChange={(e) => handleTierChange(e.target.value as CircleTier)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t} ({t === 'Inner Circle' ? '7d' : t === 'Close Friends' ? '14d' : t === 'Key Network' ? '30d' : '90d'})
                </option>
              ))}
            </select>
          </div>

          {/* Cadence Telemetry Stat */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center gap-3">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Cadence Target
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Check-in every {cadence} days
              </span>
            </div>
          </div>

          {/* Simulator Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSimulatorOpen
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title="Toggle Decay Simulator"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulator</span>
            {isSimulatorOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Interactive Decay Simulator Panel */}
      {isSimulatorOpen && (
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Mathematical Health Decay Simulator
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Simulate how health evolves over time without outreach (Half-life = {cadence} days)
              </p>
            </div>

            {/* Quick Days Preset Chips */}
            <div className="flex items-center gap-1.5 text-xs">
              {[3, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSimulatedDaysAhead(days)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    simulatedDaysAhead === days
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  +{days}d
                </button>
              ))}
            </div>
          </div>

          {/* Slider Row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Time without outreach: <strong className="text-slate-900 dark:text-white">+{simulatedDaysAhead} days</strong> (total {projectedDaysElapsed}d)</span>
              <span>Projected: <strong className={projectedStatusColors.text}>{projectedScore}% ({projectedStatus})</strong></span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={simulatedDaysAhead}
              onChange={(e) => setSimulatedDaysAhead(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Outcomes Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            {/* If you reach out today */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Connect Today
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Resets cadence and restores health to 100%
                </span>
              </div>
              <button
                type="button"
                onClick={() => openCommandPalette(friend.id)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shrink-0 shadow-2xs flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                Log Now
              </button>
            </div>

            {/* In simulated window */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${projectedStatusColors.bg} ${projectedStatusColors.border}`}>
              <div>
                <span className={`font-bold block ${projectedStatusColors.text}`}>
                  In {simulatedDaysAhead} Days Without Contact
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Decays to {projectedScore}% · {projectedStatus}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${projectedStatusColors.bg} ${projectedStatusColors.text} ${projectedStatusColors.border}`}>
                {projectedStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
