import React from 'react';
import {
  Users,
  Activity,
  AlertTriangle,
  Flame,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';
import { NetworkKPIs } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface KPISummaryProps {
  kpis: NetworkKPIs;
}

export const KPISummary: React.FC<KPISummaryProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mb-8">
      {/* 1. Network Health Index */}
      <SpotlightCard
        className="p-4 flex flex-col justify-between"
        spotlightColor="rgba(16, 185, 129, 0.12)"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold">Network Health</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={kpis.averageHealth} suffix="%" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Exponential
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${kpis.averageHealth}%` }}
            />
          </div>
        </div>
      </SpotlightCard>

      {/* 2. Needs Attention Today */}
      <SpotlightCard
        className="p-4 flex flex-col justify-between"
        spotlightColor="rgba(239, 68, 68, 0.12)"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold">Needs Attention</span>
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              <AnimatedCounter value={kpis.needsAttentionCount} />
            </span>
            <span className="text-xs text-slate-400">contacts &lt;50%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {kpis.overdueCount} overdue · {kpis.driftingCount} drifting
          </p>
        </div>
      </SpotlightCard>

      {/* 3. Consistency Streak */}
      <SpotlightCard
        className="p-4 flex flex-col justify-between"
        spotlightColor="rgba(245, 158, 11, 0.12)"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold">Weekly Streak</span>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              <AnimatedCounter value={kpis.weeklyStreak} />
            </span>
            <span className="text-xs text-slate-400">consecutive weeks</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active relationship momentum
          </p>
        </div>
      </SpotlightCard>

      {/* 4. Active Network Contacts */}
      <SpotlightCard
        className="p-4 flex flex-col justify-between"
        spotlightColor="rgba(99, 102, 241, 0.12)"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold">Total Relationships</span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={kpis.totalFriends} />
            </span>
            <span className="text-xs text-slate-400">contacts</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {kpis.thrivingCount} thriving · {kpis.steadyCount} steady
          </p>
        </div>
      </SpotlightCard>

      {/* 5. Monthly Check-Ins */}
      <SpotlightCard
        className="hidden lg:flex p-4 flex-col justify-between"
        spotlightColor="rgba(20, 184, 166, 0.12)"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold">Monthly Logs</span>
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={kpis.monthlyInteractions} />
            </span>
            <span className="text-xs text-slate-400">last 30 days</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {kpis.totalInteractions} all-time interactions
          </p>
        </div>
      </SpotlightCard>
    </div>
  );
};
