import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Phone,
  MessageSquare,
  Video,
  Coffee,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  User,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFriends } from '../../context/FriendContext';
import { Friend, ChannelType, InteractionDepth } from '../../types';
import { getStatusColor } from '../../lib/relationshipEngine';

const CHANNELS: { type: ChannelType; label: string; icon: React.ReactNode; weight: string }[] = [
  { type: 'In-Person', label: 'In-Person', icon: <Coffee className="w-4 h-4" />, weight: '1.25x' },
  { type: 'Video', label: 'Video Call', icon: <Video className="w-4 h-4" />, weight: '1.15x' },
  { type: 'Call', label: 'Phone Call', icon: <Phone className="w-4 h-4" />, weight: '1.08x' },
  { type: 'Text', label: 'Message / Text', icon: <MessageSquare className="w-4 h-4" />, weight: '1.0x' },
];

const DEPTHS: { depth: InteractionDepth; label: string; desc: string }[] = [
  { depth: 'Deep Talk', label: 'Deep Talk', desc: 'Substantive life/career discussion' },
  { depth: 'Catch-Up', label: 'Catch-Up', desc: 'General news and milestone update' },
  { depth: 'Quick Sync', label: 'Quick Sync', desc: 'Brief message, meme, or link' },
];

export const CommandPalette: React.FC = () => {
  const {
    friends,
    isCommandPaletteOpen,
    preselectedFriendForCommand,
    closeCommandPalette,
    addInteraction,
    addActionItem,
  } = useFriends();

  const [search, setSearch] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [channel, setChannel] = useState<ChannelType>('In-Person');
  const [depth, setDepth] = useState<InteractionDepth>('Catch-Up');
  const [notes, setNotes] = useState('');
  const [followUpTask, setFollowUpTask] = useState('');
  const [includeFollowUp, setIncludeFollowUp] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  // When preselected friend is provided (e.g. from FriendCard Quick Check-In)
  useEffect(() => {
    if (preselectedFriendForCommand) {
      const found = friends.find((f) => f.id === preselectedFriendForCommand);
      if (found) {
        setSelectedFriend(found);
      }
    } else {
      setSelectedFriend(null);
    }
  }, [preselectedFriendForCommand, friends]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => {
        if (selectedFriend) {
          notesInputRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 50);
    } else {
      // Reset form state when closed
      setSearch('');
      setSelectedFriend(null);
      setNotes('');
      setFollowUpTask('');
      setIncludeFollowUp(false);
      setFocusedIndex(0);
    }
  }, [isCommandPaletteOpen, selectedFriend]);

  // Filter friends based on query
  const filteredFriends = friends.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.circleTier.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q)) ||
      (f.company && f.company.toLowerCase().includes(q))
    );
  });

  // Global Keyboard Navigation (Escape, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      } else if (!selectedFriend) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1 < filteredFriends.length ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && filteredFriends[focusedIndex]) {
          e.preventDefault();
          setSelectedFriend(filteredFriends[focusedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, selectedFriend, filteredFriends, focusedIndex, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  const handleLogInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#14b8a6', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    // Add interaction to context
    addInteraction({
      friendId: selectedFriend.id,
      channel,
      depth,
      notes: notes.trim() || `Connected via ${channel} (${depth})`,
      date: new Date().toISOString(),
    });

    // Optionally add follow-up action item
    if (includeFollowUp && followUpTask.trim()) {
      addActionItem(selectedFriend.id, {
        title: followUpTask.trim(),
        completed: false,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
    }

    closeCommandPalette();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={closeCommandPalette}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedFriend ? `Quick Check-In: ${selectedFriend.name}` : 'Command Palette & Quick Check-In'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              ESC to exit
            </kbd>
            <button
              onClick={closeCommandPalette}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Mode A: Friend Search */}
        {!selectedFriend ? (
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search contact by name, circle tier, tag, or company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedIndex(0);
                }}
                className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="p-3 overflow-y-auto max-h-[380px] space-y-1">
              {filteredFriends.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No relationships match "{search}".
                </div>
              ) : (
                filteredFriends.map((friend, idx) => {
                  const statusColors = getStatusColor(friend.status);
                  const isFocused = idx === focusedIndex;

                  return (
                    <div
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isFocused
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-2xs'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {friend.name}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              · {friend.circleTier}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {friend.role && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {friend.role} {friend.company ? `@ ${friend.company}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                        >
                          {friend.healthScore}% · {friend.status}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select & Log</span>
              </div>
              <span>{filteredFriends.length} contacts indexed</span>
            </div>
          </div>
        ) : (
          /* Content Mode B: Fast Check-In Form */
          <form onSubmit={handleLogInteraction} className="p-6 space-y-5 overflow-y-auto">
            {/* Selected Friend Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedFriend.avatar}
                  alt={selectedFriend.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedFriend.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedFriend.circleTier} · Last Contact:{' '}
                    {new Date(selectedFriend.lastContactDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFriend(null)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Change Contact
              </button>
            </div>

            {/* Interaction Channel Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Interaction Channel (Decay Weight Boost)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CHANNELS.map((c) => {
                  const isSelected = channel === c.type;
                  return (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => setChannel(c.type)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                        {c.icon}
                      </div>
                      <span>{c.label}</span>
                      <span className="text-[10px] font-mono opacity-70">{c.weight}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation Depth */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Conversation Depth & Quality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEPTHS.map((d) => {
                  const isSelected = depth === d.depth;
                  return (
                    <button
                      key={d.depth}
                      type="button"
                      onClick={() => setDepth(d.depth)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold">{d.label}</div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>
                        {d.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Interaction Takeaways & Context Notes
              </label>
              <textarea
                ref={notesInputRef}
                rows={3}
                placeholder="What did you talk about? Any milestones, books, career updates, or mutual friends mentioned?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Optional Follow-up Action Item */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeFollowUp}
                  onChange={(e) => setIncludeFollowUp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 dark:bg-slate-900"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Add follow-up promise or task for this relationship
                </span>
              </label>

              {includeFollowUp && (
                <input
                  type="text"
                  placeholder="e.g. Send link to system design paper / mail birthday card"
                  value={followUpTask}
                  onChange={(e) => setFollowUpTask(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              )}
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedFriend(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back to Search
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Log Check-In & Boost Health
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
