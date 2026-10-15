import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  Activity,
  Flame,
  Users,
  AlertTriangle,
  Sparkles,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useFriends } from '../context/FriendContext';
import { PersonaCategory } from '../types';
import {
  calculateNetworkKPIs,
  calculate12WeekMomentum,
  calculateChannelMix,
  calculateTierHealthBreakdown,
} from '../lib/relationshipEngine';
import {
  exportJSONBackup,
  exportCSVReport,
  parseAndValidateJSONBackup,
} from '../lib/dataPortability';
import { MomentumAreaChart } from '../components/analytics/MomentumAreaChart';
import { ChannelDonut } from '../components/analytics/ChannelDonut';
import { CircleHealthChart } from '../components/analytics/CircleHealthChart';
import { AtRiskList } from '../components/analytics/AtRiskList';
import { PersonaSwitcher } from '../components/dashboard/PersonaSwitcher';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

export const Stats: React.FC = () => {
  const { friends, interactions, importFullState } = useFriends();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statsPersona, setStatsPersona] = useState<PersonaCategory | 'all'>('all');

  // Filter friends and interactions by selected persona
  const filteredFriends = useMemo(() => {
    if (statsPersona === 'all') return friends;
    return friends.filter((f) => f.category === statsPersona);
  }, [friends, statsPersona]);

  const filteredInteractions = useMemo(() => {
    if (statsPersona === 'all') return interactions;
    const friendIdSet = new Set(filteredFriends.map((f) => f.id));
    return interactions.filter((i) => friendIdSet.has(i.friendId));
  }, [interactions, filteredFriends, statsPersona]);

  const personaCounts = useMemo(
    () => ({
      all: friends.length,
      personal: friends.filter((f) => f.category === 'personal').length,
      career: friends.filter((f) => f.category === 'career').length,
    }),
    [friends]
  );

  // Analytics datasets
  const kpis = useMemo(() => {
    return calculateNetworkKPIs(filteredFriends, filteredInteractions);
  }, [filteredFriends, filteredInteractions]);

  const momentumData = useMemo(() => {
    return calculate12WeekMomentum(filteredInteractions);
  }, [filteredInteractions]);

  const channelData = useMemo(() => {
    return calculateChannelMix(filteredInteractions);
  }, [filteredInteractions]);

  const tierHealthData = useMemo(() => {
    return calculateTierHealthBreakdown(filteredFriends);
  }, [filteredFriends]);

  // Portability Actions
  const handleExportJSON = () => {
    exportJSONBackup(friends, interactions);
    toast.success('Downloaded full JSON backup!');
  };

  const handleExportCSV = () => {
    exportCSVReport(filteredFriends);
    toast.success(`Exported ${filteredFriends.length} contacts to CSV!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const { friends: newFriends, interactions: newInteractions } =
          parseAndValidateJSONBackup(text);

        importFullState(newFriends, newInteractions);
        toast.success(
          `Successfully restored ${newFriends.length} contacts and ${newInteractions.length} logs!`
        );
      } catch (err: any) {
        toast.error(err.message || 'Error restoring JSON backup');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header & Export Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Executive Relationship Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mathematical health metrics, channel velocity, and CRM data portability
          </p>
        </div>

        {/* Data Portability Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
            title="Download CSV spreadsheet report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
            title="Download full JSON CRM backup"
          >
            <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Backup JSON</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/20 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Restore Backup</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Persona Scope Switcher Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Analytics Persona Scope:
          </span>
        </div>
        <PersonaSwitcher
          value={statsPersona}
          onChange={setStatsPersona}
          counts={personaCounts}
        />
      </div>

      {/* Top 4 KPI Metric Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Network Health */}
        <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(16, 185, 129, 0.12)">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Network Health</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={kpis.averageHealth} suffix="%" />
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.thrivingCount} Thriving · {kpis.steadyCount} Steady
            </p>
          </div>
        </SpotlightCard>

        {/* KPI 2: Needs Attention */}
        <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(239, 68, 68, 0.12)">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Decaying Relationships</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              <AnimatedCounter value={kpis.needsAttentionCount} />
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.overdueCount} Overdue · {kpis.driftingCount} Drifting
            </p>
          </div>
        </SpotlightCard>

        {/* KPI 3: Weekly Streak */}
        <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(245, 158, 11, 0.12)">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Consistency Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              <AnimatedCounter value={kpis.weeklyStreak} />
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Consecutive active weeks</p>
          </div>
        </SpotlightCard>

        {/* KPI 4: Monthly Interactions */}
        <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(99, 102, 241, 0.12)">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">30-Day Touchpoints</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={kpis.monthlyInteractions} />
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.totalInteractions} all-time interactions
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* 2-Column Row: Momentum Chart + Channel Mix Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MomentumAreaChart data={momentumData} />
        </div>
        <div>
          <ChannelDonut data={channelData} />
        </div>
      </div>

      {/* 2-Column Row: Circle Health Breakdown + Priority At-Risk List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CircleHealthChart data={tierHealthData} />
        </div>
        <div>
          <AtRiskList friends={filteredFriends} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
