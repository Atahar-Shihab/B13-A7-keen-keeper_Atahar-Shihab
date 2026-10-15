import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Zap,
  ArrowRight,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { Friend } from '../../types';
import { useFriends } from '../../context/FriendContext';
import {
  getStatusColor,
  getDaysElapsed,
  getTargetCadence,
} from '../../lib/relationshipEngine';

interface FriendCardProps {
  friend: Friend;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const { openCommandPalette } = useFriends();

  const statusColors = getStatusColor(friend.status);
  const daysElapsed = getDaysElapsed(friend.lastContactDate);
  const cadence = getTargetCadence(friend);
  const openTasks = friend.actionItems.filter((a) => !a.completed);

  // SVG Radial Gauge parameters
  const size = 52;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (friend.healthScore / 100) * circumference;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Top section: Avatar, Details, and Radial Gauge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* Avatar & Identifiers */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to={`/friend/${friend.id}`} className="relative shrink-0">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-colors"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  friend.status === 'Thriving'
                    ? 'bg-emerald-500'
                    : friend.status === 'Steady'
                    ? 'bg-blue-500'
                    : friend.status === 'Drifting'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </Link>

            <div className="min-w-0">
              <Link
                to={`/friend/${friend.id}`}
                className="font-bold text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block transition-colors"
              >
                {friend.name}
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {friend.role ? `${friend.role} ` : ''}
                {friend.company ? `@ ${friend.company}` : ''}
              </p>
            </div>
          </div>

          {/* Radial Health Gauge */}
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
              {/* Foreground animated score ring */}
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
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-none">
                {friend.healthScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Circle Tier & Status Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {friend.circleTier}
          </span>
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
          >
            {friend.status}
          </span>
          {openTasks.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 ml-auto">
              <CheckSquare className="w-3 h-3" />
              {openTasks.length} task{openTasks.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {friend.bio}
        </p>

        {/* Cadence Telemetry Metrics */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Last Contact
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {daysElapsed === 0 ? 'Today' : `${daysElapsed}d ago`}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Cadence Target
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Every {cadence} days
            </span>
          </div>
        </div>

        {/* Tags */}
        {friend.tags && friend.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {friend.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => openCommandPalette(friend.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-emerald-600/20 transition-transform active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          Quick Check-In
        </button>

        <Link
          to={`/friend/${friend.id}`}
          className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Vault</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
