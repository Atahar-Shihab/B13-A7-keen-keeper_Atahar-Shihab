import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Users, Clock, BarChart3, Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-300">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
        Error 404 · Navigation Lost
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
        Relationship Out of Range
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The route you are navigating to does not exist or may have been relocated.
        Return to your active relationship directory or check recent interaction activity.
      </p>

      {/* Quick recovery links */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/timeline"
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>Activity Timeline</span>
        </Link>

        <Link
          to="/stats"
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <span>Analytics Suite</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
