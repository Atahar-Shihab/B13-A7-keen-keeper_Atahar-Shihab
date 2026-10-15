import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Send,
  Calendar,
  MessageSquare,
  Moon,
  Sun,
  Copy,
  Check,
} from 'lucide-react';
import { Friend, ActionItem } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { launchOutreach } from '../../lib/outreachLauncher';
import { isFriendSnoozed, getDaysElapsed } from '../../lib/relationshipEngine';
import { ScheduleModal } from './ScheduleModal';
import { toast } from 'sonner';

interface OutreachActionBarProps {
  friend: Friend;
  pendingTasks?: ActionItem[];
}

export const OutreachActionBar: React.FC<OutreachActionBarProps> = ({
  friend,
  pendingTasks = [],
}) => {
  const { openCommandPalette, snoozeFriend, unsnoozeFriend } = useFriends();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const snoozed = isFriendSnoozed(friend);

  const handleLaunch = (channel: 'whatsapp' | 'email' | 'linkedin') => {
    const res = launchOutreach(channel, {
      name: friend.name,
      phone: friend.phone,
      email: friend.email,
      linkedinUrl: friend.linkedinUrl,
      messageText: `Hi ${friend.name.split(' ')[0]}! Wanted to catch up and see how things are going.`,
      subject: `Catch-up with ${friend.name}`,
    });

    if (!res.success) {
      toast.error(res.error || `Could not open ${channel}`);
    } else {
      toast.success(`Launched ${channel}!`);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Left: Communication Channels */}
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <button
            onClick={() => handleLaunch('whatsapp')}
            disabled={!friend.phone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            title={friend.phone ? `WhatsApp ${friend.phone}` : 'No phone number available'}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Email */}
          <button
            onClick={() => handleLaunch('email')}
            disabled={!friend.email}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            title={friend.email ? `Email ${friend.email}` : 'No email available'}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleLaunch('linkedin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            title={friend.linkedinUrl || 'Search LinkedIn profile'}
          >
            <Send className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </button>

          {/* Schedule Calendar */}
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Schedule calendar catch-up"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>

        {/* Right: CRM Controls (Check-In & Snooze) */}
        <div className="flex items-center gap-2">
          {snoozed ? (
            <button
              onClick={() => unsnoozeFriend(friend.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
              title="Click to clear snooze"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Snoozed</span>
            </button>
          ) : (
            <button
              onClick={() => snoozeFriend(friend.id, 7)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
              title="Snooze check-in reminders for 7 days"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Snooze 7d</span>
            </button>
          )}

          <button
            onClick={() => openCommandPalette(friend.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Log Catch-Up</span>
          </button>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        friend={friend}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        pendingTasks={pendingTasks}
      />
    </>
  );
};
