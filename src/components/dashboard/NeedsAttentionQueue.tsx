import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Friend } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { getStatusColor, getDaysElapsed, getTargetCadence } from '../../lib/relationshipEngine';

interface NeedsAttentionQueueProps {
  attentionQueue: Friend[];
}

export const NeedsAttentionQueue: React.FC<NeedsAttentionQueueProps> = ({
  attentionQueue,
}) => {
  const { openCommandPalette } = useFriends();

  if (attentionQueue.length === 0) {
    return (
      <div className="mb-8 p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            All Relationships On Track!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every contact across your Inner Circle, Close Friends, and Key Network is thriving or steady. Excellent relationship hygiene!
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Needs Attention Today
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {attentionQueue.length} Drifting / Overdue
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          Weighted by Circle Tier importance & exponential cadence decay
        </p>
      </div>

      {/* Horizontal scrolling priority cards */}
      <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
        {attentionQueue.map((friend, idx) => {
          const statusColors = getStatusColor(friend.status);
          const daysElapsed = getDaysElapsed(friend.lastContactDate);
          const cadence = getTargetCadence(friend);
          const daysOverdue = Math.max(0, daysElapsed - cadence);

          return (
            <div
              key={friend.id}
              className="min-w-[280px] sm:min-w-[310px] max-w-[320px] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between shrink-0 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Priority index badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Priority #{idx + 1}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                >
                  {friend.healthScore}% · {friend.status}
                </span>
              </div>

              {/* Friend Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0">
                  <Link
                    to={`/friend/${friend.id}`}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block transition-colors"
                  >
                    {friend.name}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {friend.circleTier}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>
                      {daysElapsed}d since contact ({daysOverdue > 0 ? `+${daysOverdue}d overdue` : 'cadence boundary'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio / Reason snippet */}
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 italic">
                "{friend.bio}"
              </p>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCommandPalette(friend.id)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Quick Check-In
                </button>
                <Link
                  to={`/friend/${friend.id}`}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                  title="View Profile & AI Copilot"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
