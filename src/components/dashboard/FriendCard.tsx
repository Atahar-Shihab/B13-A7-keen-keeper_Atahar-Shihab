import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Zap,
  ArrowRight,
  CheckSquare,
  Phone,
  Mail,
  Send,
  Moon,
} from 'lucide-react';
import { Friend } from '../../types';
import { useFriends } from '../../context/FriendContext';
import {
  getStatusColor,
  getDaysElapsed,
  getTargetCadence,
  isFriendSnoozed,
} from '../../lib/relationshipEngine';
import { SpotlightCard } from '../ui/SpotlightCard';
import { HealthRing } from '../ui/HealthRing';
import { launchOutreach } from '../../lib/outreachLauncher';
import { toast } from 'sonner';

interface FriendCardProps {
  friend: Friend;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const { openCommandPalette, snoozeFriend, unsnoozeFriend } = useFriends();

  const statusColors = getStatusColor(friend.status);
  const daysElapsed = getDaysElapsed(friend.lastContactDate);
  const cadence = getTargetCadence(friend);
  const openTasks = friend.actionItems.filter((a) => !a.completed);
  const snoozed = isFriendSnoozed(friend);

  const handleLaunchOutreach = (channel: 'whatsapp' | 'email' | 'linkedin', e: React.MouseEvent) => {
    e.stopPropagation();
    const res = launchOutreach(channel, {
      name: friend.name,
      phone: friend.phone,
      email: friend.email,
      linkedinUrl: friend.linkedinUrl,
      messageText: `Hi ${friend.name.split(' ')[0]}! Wanted to catch up and see how things are going.`,
    });
    if (!res.success) {
      toast.error(res.error || `Could not open ${channel}`);
    }
  };

  return (
    <SpotlightCard
      className="p-5 flex flex-col justify-between group relative transition-all duration-300 hover:shadow-xl"
      spotlightColor={
        friend.status === 'Thriving'
          ? 'rgba(16, 185, 129, 0.12)'
          : friend.status === 'Steady'
          ? 'rgba(59, 130, 246, 0.12)'
          : friend.status === 'Drifting'
          ? 'rgba(245, 158, 11, 0.14)'
          : 'rgba(239, 68, 68, 0.14)'
      }
    >
      {/* Top section: Avatar, Identifiers, and GSAP Health Ring */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* Avatar & Identifiers */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to={`/friend/${friend.id}`} className="relative shrink-0">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition-colors"
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
                className="font-bold text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition-colors"
              >
                {friend.name}
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {friend.roleOrContext || friend.companyOrOrg || friend.role || friend.circleTier}
              </p>
            </div>
          </div>

          {/* GSAP Health Ring */}
          <div className="shrink-0">
            <HealthRing
              score={friend.healthScore}
              status={friend.status}
              size={48}
              strokeWidth={4.5}
            />
          </div>
        </div>

        {/* Persona, Circle Tier & Status Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
              friend.category === 'career'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {friend.category === 'career' ? 'Career' : 'Personal'}
          </span>

          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {friend.circleTier}
          </span>

          <span
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
          >
            {friend.status}
          </span>

          {openTasks.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 ml-auto">
              <CheckSquare className="w-3 h-3" />
              {openTasks.length} task{openTasks.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {friend.bio}
        </p>

        {/* Cadence Telemetry Metrics & Snooze Status */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Last Touch
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {daysElapsed === 0 ? 'Today' : `${daysElapsed}d ago`}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Target Cadence
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Every {cadence}d
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Status
            </span>
            {snoozed ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unsnoozeFriend(friend.id);
                }}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                title="Snoozed. Click to clear."
              >
                <Moon className="w-3 h-3" />
                <span>Snoozed</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  snoozeFriend(friend.id, 7);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Snooze 7 days"
              >
                +7d snooze
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Quick Outreach Strip */}
        <div className="flex items-center justify-between gap-1 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Outreach:</span>
          <div className="flex items-center gap-1">
            {friend.phone && (
              <button
                type="button"
                onClick={(e) => handleLaunchOutreach('whatsapp', e)}
                className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                title="Launch WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            )}
            {friend.email && (
              <button
                type="button"
                onClick={(e) => handleLaunchOutreach('email', e)}
                className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Send Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            )}
            {friend.linkedinUrl && (
              <button
                type="button"
                onClick={(e) => handleLaunchOutreach('linkedin', e)}
                className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
                title="Open LinkedIn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => openCommandPalette(friend.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-indigo-600/20 transition-transform active:scale-95"
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
    </SpotlightCard>
  );
};
