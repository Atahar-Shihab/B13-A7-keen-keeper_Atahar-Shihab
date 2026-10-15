import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Zap,
  Calendar,
  MessageSquare,
  Coffee,
  Video,
  Clock,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useFriends } from '../context/FriendContext';
import { HealthGauge } from '../components/profile/HealthGauge';
import { AIBriefingCard } from '../components/profile/AIBriefingCard';
import { ContextVault } from '../components/profile/ContextVault';
import { ActionItemsChecklist } from '../components/profile/ActionItemsChecklist';
import { OutreachActionBar } from '../components/profile/OutreachActionBar';
import { ChannelType } from '../types';

export const FriendDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFriend, getFriendInteractions, openCommandPalette, deleteFriend } = useFriends();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const friend = id ? getFriend(id) : undefined;
  const friendInteractions = id ? getFriendInteractions(id) : [];

  if (!friend) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Relationship Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested contact profile could not be located in your CRM.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteFriend(friend.id);
    navigate('/');
  };

  const getChannelIcon = (ch: ChannelType) => {
    switch (ch) {
      case 'In-Person':
        return <Coffee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Call':
        return <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Text':
        return <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Relationships
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openCommandPalette(friend.id)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Quick Check-In (⌘K)
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start gap-6">
        <img
          src={friend.avatar}
          alt={friend.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md shrink-0"
        />

        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {friend.name}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  friend.category === 'career'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {friend.category === 'career' ? 'Career & Mentors' : 'Personal Circle'}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {friend.circleTier}
              </span>
            </div>

            {(friend.role || friend.company) && (
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {friend.role} {friend.company ? `@ ${friend.company}` : ''}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {friend.bio}
          </p>

          {/* Contact Details & Location */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            {friend.email && (
              <a
                href={`mailto:${friend.email}`}
                className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{friend.email}</span>
              </a>
            )}
            {friend.phone && (
              <a
                href={`tel:${friend.phone}`}
                className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{friend.phone}</span>
              </a>
            )}
            {friend.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{friend.location}</span>
              </span>
            )}
          </div>

          {/* Tags */}
          {friend.tags && friend.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {friend.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 1-Click Outreach & Scheduling Action Bar */}
      <OutreachActionBar
        friend={friend}
        pendingTasks={friend.actionItems.filter((a) => !a.completed)}
      />

      {/* Relationship Health Gauge & Cadence Controls */}
      <HealthGauge friend={friend} />

      {/* AI Relationship Copilot */}
      <AIBriefingCard friend={friend} interactions={friendInteractions} />

      {/* Context Vault & Action Items Side-by-Side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContextVault friend={friend} />
        <ActionItemsChecklist friend={friend} />
      </div>

      {/* Per-Friend Interaction History Stream */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Interaction History with {friend.name}
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {friendInteractions.length} logs
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete historical ledger of calls, meetings, messages, and notes
            </p>
          </div>

          <button
            type="button"
            onClick={() => openCommandPalette(friend.id)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Log Check-In</span>
          </button>
        </div>

        {friendInteractions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No interactions logged with {friend.name} yet. Click "Log Check-In" to record your first conversation.
          </div>
        ) : (
          <div className="space-y-3">
            {friendInteractions.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {getChannelIcon(log.channel)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.channel}
                      </span>
                      <span className="text-[11px] px-2 py-0.2 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                        {log.depth}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {log.notes}
                    </p>
                    {log.topics && log.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {log.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 text-xs text-slate-400">
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Contact Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Relationship with {friend.name}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                This will permanently remove this contact along with all vault entries, action items,
                and associated interaction logs from your CRM database.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendDetails;
