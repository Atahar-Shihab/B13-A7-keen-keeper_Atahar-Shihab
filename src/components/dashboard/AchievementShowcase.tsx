import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useFriends } from '../../context/FriendContext';
import { calculateNetworkMastery, Achievement } from '../../lib/achievementEngine';

export const AchievementShowcase: React.FC = () => {
  const { friends, interactions } = useFriends();
  const [isExpanded, setIsExpanded] = useState(false);

  const mastery = useMemo(
    () => calculateNetworkMastery(friends, interactions),
    [friends, interactions]
  );

  const getTierBadgeStyle = (achievement: Achievement) => {
    if (!achievement.unlocked) {
      return 'opacity-60 grayscale border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850';
    }
    switch (achievement.tier) {
      case 'platinum':
        return 'border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 shadow-xs shadow-purple-500/20';
      case 'gold':
        return 'border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 shadow-xs shadow-amber-500/20';
      case 'silver':
        return 'border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-xs shadow-blue-500/20';
      case 'bronze':
      default:
        return 'border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-xs shadow-emerald-500/20';
    }
  };

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header & Level Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Network Mastery: Level {mastery.level}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {mastery.levelTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mastery.totalXP.toLocaleString()} XP earned · {mastery.unlockedAchievementsCount} of {mastery.totalAchievementsCount} badges unlocked
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <span>{isExpanded ? 'Collapse Badges' : 'View All Badges'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span>Level {mastery.level} Progress</span>
          <span>
            {mastery.currentLevelXP} / {mastery.nextLevelXP} XP ({mastery.progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${mastery.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges Preview / Expanded Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {(isExpanded ? mastery.achievements : mastery.achievements.slice(0, 4)).map(
          (achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-2xl border transition-all hover:scale-[1.02] flex flex-col justify-between ${getTierBadgeStyle(
                achievement
              )}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl select-none">{achievement.icon}</span>
                  {achievement.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {achievement.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                  {achievement.description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium mb-1">
                  <span>{achievement.unlocked ? 'Complete' : 'Progress'}</span>
                  <span>{achievement.progressLabel}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-slate-200/60 dark:bg-slate-700/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      achievement.unlocked
                        ? 'bg-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
