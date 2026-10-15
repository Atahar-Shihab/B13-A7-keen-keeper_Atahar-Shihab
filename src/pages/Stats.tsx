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
import { useFriends } from '../context/FriendContext';
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

export const Stats: React.FC = () => {
  const { friends, interactions, importFullState } = useFriends();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Analytics datasets
  const kpis = useMemo(() => {
    return calculateNetworkKPIs(friends, interactions);
  }, [friends, interactions]);

  const momentumData = useMemo(() => {
    return calculate12WeekMomentum(interactions);
  }, [interactions]);

  const channelData = useMemo(() => {
    return calculateChannelMix(interactions);
  }, [interactions]);

  const tierHealthData = useMemo(() => {
    return calculateTierHealthBreakdown(friends);
  }, [friends]);

  // Portability Actions
  const handleExportJSON = () => {
    exportJSONBackup(friends, interactions);
  };

  const handleExportCSV = () => {
    exportCSVReport(friends);
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
        setImportMessage(`Successfully restored ${newFriends.length} contacts and ${newInteractions.length} logs!`);
        setTimeout(() => setImportMessage(null), 4000);
      } catch (err: any) {
        alert(err.message || 'Error restoring JSON backup');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header & Export Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
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
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
            title="Download CSV spreadsheet report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
            title="Download full JSON CRM backup"
          >
            <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Backup JSON</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors">
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

      {/* Import Notification Banner */}
      {importMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{importMessage}</span>
        </div>
      )}

      {/* Top 4 KPI Metric Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Network Health */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Network Health</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {kpis.averageHealth}%
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.thrivingCount} Thriving · {kpis.steadyCount} Steady
            </p>
          </div>
        </div>

        {/* KPI 2: Weekly Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Weekly Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {kpis.weeklyStreak} Weeks
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Consecutive outreach momentum
            </p>
          </div>
        </div>

        {/* KPI 3: Total Logs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Interactions</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {kpis.totalInteractions}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.monthlyInteractions} in last 30 days
            </p>
          </div>
        </div>

        {/* KPI 4: Needs Attention */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Needs Attention</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {kpis.needsAttentionCount} Contacts
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.overdueCount} Overdue · {kpis.driftingCount} Drifting
            </p>
          </div>
        </div>
      </div>

      {/* 4-Panel Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: 12-Week Momentum Area Chart */}
        <MomentumAreaChart data={momentumData} />

        {/* Panel 2: Channel Mix Donut Chart */}
        <ChannelDonut data={channelData} />

        {/* Panel 3: Circle Tier Health vs Benchmark */}
        <CircleHealthChart data={tierHealthData} />

        {/* Panel 4: At-Risk & Drifting Watchlist */}
        <AtRiskList friends={friends} />
      </div>
    </div>
  );
};

export default Stats;
