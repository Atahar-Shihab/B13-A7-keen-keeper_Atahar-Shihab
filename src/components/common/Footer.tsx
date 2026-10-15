import React from 'react';
import { Heart, Activity, ShieldCheck, Sparkles, Database } from 'lucide-react';
import { useFriends } from '../../context/FriendContext';

export const Footer: React.FC = () => {
  const { friends, interactions } = useFriends();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                KK
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                KeenKeeper v2.0
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                Production Release
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Flagship personal CRM and algorithmic relationship health decay engine.
              Nurture authentic connections through mathematical cadences, proactive reminders, and AI copilot intelligence.
            </p>
          </div>

          {/* Engine Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              System Telemetry
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Exponential Decay: Active (half-life = C)</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>{friends.length} Contacts · {interactions.length} Interactions</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>LocalStorage Zero-Latency Sync</span>
              </li>
            </ul>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Hotkeys & Access
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Quick Check-In</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Briefing</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Gemini Flash / Synthesizer
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Backup & Export</span>
                <span className="text-[11px] text-slate-400">JSON & CSV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">Atahar Shihab</span>
          </p>
          <p className="text-[11px]">
            KeenKeeper v2.0 · Personal CRM & Relationship Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
