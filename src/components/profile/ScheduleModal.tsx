import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Download, ExternalLink, X, Sparkles } from 'lucide-react';
import { Friend, ActionItem } from '../../types';
import { downloadIcsFile, openGoogleCalendar } from '../../lib/calendarExport';
import { toast } from 'sonner';

interface ScheduleModalProps {
  friend: Friend;
  isOpen: boolean;
  onClose: () => void;
  pendingTasks?: ActionItem[];
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  friend,
  isOpen,
  onClose,
  pendingTasks = [],
}) => {
  // Default meeting time: tomorrow at 10:00 AM local time
  const defaultMeetingDate = new Date();
  defaultMeetingDate.setDate(defaultMeetingDate.getDate() + 1);
  defaultMeetingDate.setHours(10, 0, 0, 0);

  const [meetingDate, setMeetingDate] = useState<string>(
    defaultMeetingDate.toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [location, setLocation] = useState<string>('Google Meet / Video Call');
  const [meetingTitle, setMeetingTitle] = useState<string>(
    `KeenKeeper Catch-Up with ${friend.name}`
  );

  // Build agenda from friend's bio and pending tasks
  const defaultAgenda = [
    `Relationship check-in with ${friend.name} (${friend.roleOrContext || friend.circleTier}).`,
    '',
    pendingTasks.length > 0
      ? `Open Commitments:\n${pendingTasks.map((t) => `• ${t.title}`).join('\n')}`
      : 'Review recent milestones and shared projects.',
    '',
    `Notes from Context Vault:\n${friend.vault.slice(0, 2).map((v) => `• [${v.category}] ${v.title}: ${v.description}`).join('\n') || '• No recent vault items.'}`,
  ].join('\n');

  const [description, setDescription] = useState<string>(defaultAgenda);

  if (!isOpen) return null;

  const handleDownloadIcs = () => {
    const start = new Date(meetingDate);
    downloadIcsFile({
      title: meetingTitle,
      description,
      location,
      startTime: start,
      durationMinutes,
    });
    toast.success('Calendar .ics file downloaded!');
    onClose();
  };

  const handleOpenGoogleCalendar = () => {
    const start = new Date(meetingDate);
    openGoogleCalendar({
      title: meetingTitle,
      description,
      location,
      startTime: start,
      durationMinutes,
    });
    toast.success('Opening Google Calendar event template...');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="schedule-modal-title" className="text-sm font-bold tracking-tight">
                Schedule Check-In with {friend.name}
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                1-Click Google Calendar or RFC-5545 .ics invite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={15}>15 minutes (Quick Sync)</option>
                <option value={30}>30 minutes (Catch-Up)</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes (Deep Talk)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Location / Platform</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Google Meet, Zoom, Phone, or Coffee shop"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Agenda / Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Pre-filled Agenda & Briefing</span>
              </label>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Included in invite</span>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px] leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ics</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGoogleCalendar}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
