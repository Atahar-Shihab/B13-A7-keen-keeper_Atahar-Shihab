import React from 'react';
import { Shield, Clock, Calendar, Activity, Sliders } from 'lucide-react';
import { Friend, CircleTier } from '../../types';
import {
  getStatusColor,
  getDaysElapsed,
  getTargetCadence,
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
  const { updateFriend } = useFriends();

  const statusColors = getStatusColor(friend.status);
  const daysElapsed = getDaysElapsed(friend.lastContactDate);
  const cadence = getTargetCadence(friend);

  // SVG Radial Gauge parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (friend.healthScore / 100) * circumference;

  const handleTierChange = (newTier: CircleTier) => {
    updateFriend(friend.id, { circleTier: newTier });
  };

  const handleCustomCadenceChange = (days: number | undefined) => {
    updateFriend(friend.id, { customCadenceDays: days });
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
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
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
        {/* Tier Selector */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cadence Tier
          </label>
          <select
            value={friend.circleTier}
            onChange={(e) => handleTierChange(e.target.value as CircleTier)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
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
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Cadence Target
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Check-in every {cadence} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
