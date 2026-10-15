import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Moon,
  ExternalLink,
  Phone,
  Mail,
  Send,
} from 'lucide-react';
import { Friend, HealthStatus, PersonaCategory } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { getDaysElapsed, isFriendSnoozed } from '../../lib/relationshipEngine';
import { HealthRing } from '../ui/HealthRing';
import { launchOutreach } from '../../lib/outreachLauncher';

interface KanbanBoardProps {
  friends: Friend[];
  activePersona?: PersonaCategory | 'all';
}

interface ColumnConfig {
  id: HealthStatus;
  title: string;
  icon: React.ReactNode;
  bgHeader: string;
  badgeBg: string;
  borderColor: string;
  description: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'Overdue',
    title: 'Overdue Cadence',
    icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    bgHeader: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500 text-white',
    borderColor: 'border-rose-500/20 dark:border-rose-500/30',
    description: 'Health score < 25. Requires immediate reconnection.',
  },
  {
    id: 'Drifting',
    title: 'Drifting Apart',
    icon: <Clock className="w-4 h-4 text-amber-500" />,
    bgHeader: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500 text-slate-950 font-semibold',
    borderColor: 'border-amber-500/20 dark:border-amber-500/30',
    description: 'Score 25–49. Decaying past target cadence threshold.',
  },
  {
    id: 'Steady',
    title: 'Steady & Healthy',
    icon: <Sparkles className="w-4 h-4 text-blue-500" />,
    bgHeader: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500 text-white',
    borderColor: 'border-blue-500/20 dark:border-blue-500/30',
    description: 'Score 50–79. Well-maintained baseline momentum.',
  },
  {
    id: 'Thriving',
    title: 'Thriving Circles',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    bgHeader: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500 text-white',
    borderColor: 'border-emerald-500/20 dark:border-emerald-500/30',
    description: 'Score 80–100. Frequent, multi-channel touchpoints.',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ friends, activePersona = 'all' }) => {
  const navigate = useNavigate();
  const { openCommandPalette, snoozeFriend, unsnoozeFriend } = useFriends();

  // Filter contacts by active persona
  const filteredFriends = React.useMemo(() => {
    if (activePersona === 'all') return friends;
    return friends.filter((f) => f.category === activePersona);
  }, [friends, activePersona]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const columnFriends = filteredFriends.filter((f) => f.status === col.id);
          const avgScore =
            columnFriends.length > 0
              ? Math.round(columnFriends.reduce((sum, f) => sum + f.healthScore, 0) / columnFriends.length)
              : 0;

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border ${col.borderColor} shadow-sm overflow-hidden transition-all duration-300`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${col.bgHeader}`}>{col.icon}</div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      {col.title}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${col.badgeBg}`}>
                    {columnFriends.length}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="truncate">{col.description}</span>
                  {columnFriends.length > 0 && (
                    <span className="font-mono font-medium ml-1 shrink-0">
                      avg {avgScore}%
                    </span>
                  )}
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 flex flex-col gap-2.5 min-h-[380px] max-h-[700px] overflow-y-auto">
                <AnimatePresence>
                  {columnFriends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-600 dark:text-slate-400">
                      <Sparkles className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-2 opacity-50" />
                      <p className="text-xs font-medium">No contacts in this stage</p>
                    </div>
                  ) : (
                    columnFriends.map((friend) => {
                      const snoozed = isFriendSnoozed(friend);
                      const daysAgo = getDaysElapsed(friend.lastContactDate);

                      return (
                        <motion.div
                          key={friend.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group relative rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-md transition-all"
                        >
                          {/* Card Top: Avatar, Name, Persona badge */}
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              />
                              <div className="absolute -bottom-1 -right-1">
                                <HealthRing
                                  score={friend.healthScore}
                                  size={20}
                                  strokeWidth={3}
                                  showScore={false}
                                />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h5
                                  onClick={() => navigate(`/friend/${friend.id}`)}
                                  className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                                >
                                  {friend.name}
                                </h5>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase shrink-0 ${
                                    friend.category === 'career'
                                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                  }`}
                                >
                                  {friend.category === 'career' ? 'Career' : 'Personal'}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                                {friend.roleOrContext || friend.companyOrOrg || friend.circleTier}
                              </p>
                            </div>
                          </div>

                          {/* Cadence info & Snooze pill */}
                          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{daysAgo}d since touch</span>
                            </div>

                            {snoozed ? (
                              <button
                                onClick={() => unsnoozeFriend(friend.id)}
                                className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-medium"
                                title="Click to cancel snooze"
                              >
                                <Moon className="w-3 h-3" />
                                <span>Snoozed</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => snoozeFriend(friend.id, 7)}
                                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                title="Snooze reminder for 7 days"
                              >
                                + 7d snooze
                              </button>
                            )}
                          </div>

                          {/* Action Strip on hover/focus */}
                          <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                            <button
                              onClick={() => openCommandPalette(friend.id)}
                              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Log Catch-Up</span>
                            </button>

                            <div className="flex items-center gap-1">
                              {friend.phone && (
                                <button
                                  onClick={() =>
                                    launchOutreach('whatsapp', {
                                      name: friend.name,
                                      phone: friend.phone,
                                      messageText: `Hey ${friend.name.split(' ')[0]}! How are things?`,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                                  title="WhatsApp"
                                >
                                  <Phone className="w-3 h-3" />
                                </button>
                              )}
                              {friend.email && (
                                <button
                                  onClick={() =>
                                    launchOutreach('email', {
                                      name: friend.name,
                                      email: friend.email,
                                      subject: `Catch-up with ${friend.name}`,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                                  title="Email"
                                >
                                  <Mail className="w-3 h-3" />
                                </button>
                              )}
                              {friend.linkedinUrl && (
                                <button
                                  onClick={() =>
                                    launchOutreach('linkedin', {
                                      name: friend.name,
                                      linkedinUrl: friend.linkedinUrl,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
                                  title="LinkedIn"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/friend/${friend.id}`)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                title="View Profile"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
