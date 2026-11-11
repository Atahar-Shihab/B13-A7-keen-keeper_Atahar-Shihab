import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Cake, Gift, PartyPopper, ChevronRight } from 'lucide-react';
import { useFriends } from '../../context/FriendContext';
import { getUpcomingCelebrations, UpcomingCelebration } from '../../lib/celebrationEngine';

export const UpcomingCelebrations: React.FC = () => {
  const { friends } = useFriends();

  const celebrations = useMemo(
    () => getUpcomingCelebrations(friends, 30),
    [friends]
  );

  if (celebrations.length === 0) return null;

  const getIcon = (celebration: UpcomingCelebration) => {
    if (celebration.daysUntil === 0) {
      return <PartyPopper className="w-4 h-4 text-amber-500" />;
    }
    return celebration.type === 'birthday' ? (
      <Cake className="w-4 h-4 text-pink-500" />
    ) : (
      <Gift className="w-4 h-4 text-indigo-500" />
    );
  };

  const getUrgencyClass = (daysUntil: number) => {
    if (daysUntil === 0)
      return 'bg-gradient-to-r from-amber-50 to-pink-50 dark:from-amber-950/40 dark:to-pink-950/40 border-amber-300 dark:border-amber-800 ring-2 ring-amber-200/50 dark:ring-amber-800/30';
    if (daysUntil <= 3)
      return 'bg-pink-50/60 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900';
    if (daysUntil <= 7)
      return 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900';
    return 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800';
  };

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Cake className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Upcoming Celebrations
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Birthdays & anniversaries in the next 30 days
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
          {celebrations.length} upcoming
        </span>
      </div>

      <div className="space-y-2.5">
        {celebrations.slice(0, 5).map((celebration) => (
          <Link
            key={`${celebration.friendId}-${celebration.type}`}
            to={`/friend/${celebration.friendId}`}
            className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all hover:shadow-md group ${getUrgencyClass(
              celebration.daysUntil
            )}`}
          >
            <img
              src={celebration.friendAvatar}
              alt={celebration.friendName}
              className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getIcon(celebration)}
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {celebration.friendName}
                </span>
                {celebration.turnsAge && celebration.type === 'birthday' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-semibold">
                    Turns {celebration.turnsAge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {celebration.label}
              </p>
            </div>

            <div className="text-right shrink-0 flex items-center gap-2">
              <div>
                {celebration.daysUntil === 0 ? (
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 animate-pulse">
                    TODAY!
                  </span>
                ) : (
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {celebration.daysUntil}
                    <span className="text-xs font-medium text-slate-400 ml-0.5">
                      d
                    </span>
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {celebrations.length > 5 && (
        <p className="text-center text-[11px] text-slate-400 pt-1">
          + {celebrations.length - 5} more celebrations coming up
        </p>
      )}
    </section>
  );
};
