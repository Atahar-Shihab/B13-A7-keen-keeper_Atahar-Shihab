import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Friend } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { getStatusColor, getDaysElapsed, getTargetCadence } from '../../lib/relationshipEngine';

interface AtRiskListProps {
  friends: Friend[];
}

export const AtRiskList: React.FC<AtRiskListProps> = ({ friends }) => {
  const { openCommandPalette } = useFriends();

  // Filter at-risk contacts (health score < 50) and sort lowest first
  const atRiskFriends = friends
    .filter((f) => f.healthScore < 50)
    .sort((a, b) => a.healthScore - b.healthScore);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Drifting & At-Risk Watchlist
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Contacts whose health score has dropped below the 50% boundary
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {atRiskFriends.length} At-Risk
        </span>
      </div>

      {atRiskFriends.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Zero At-Risk Contacts!
          </span>
          <span>All relationships are currently steady or thriving.</span>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {atRiskFriends.map((friend) => {
            const statusColors = getStatusColor(friend.status);
            const daysElapsed = getDaysElapsed(friend.lastContactDate);
            const cadence = getTargetCadence(friend);

            return (
              <div
                key={friend.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/friend/${friend.id}`}
                      className="font-bold text-xs text-slate-900 dark:text-white hover:text-emerald-600 block truncate"
                    >
                      {friend.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{friend.circleTier}</span>
                      <span>·</span>
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        {daysElapsed}d since contact (target {cadence}d)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                  >
                    {friend.healthScore}%
                  </span>

                  <button
                    type="button"
                    onClick={() => openCommandPalette(friend.id)}
                    className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-colors"
                    title="Quick Check-In"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Prioritize Inner Circle & Close Friends</span>
        <Link to="/" className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <span>Priority Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
