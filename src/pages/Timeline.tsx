import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Search,
  Filter,
  Plus,
  Coffee,
  Video,
  Phone,
  MessageSquare,
  Edit2,
  Trash2,
  Calendar,
  X,
  Layers,
  Sparkles,
  Users,
  Briefcase,
} from 'lucide-react';
import { useFriends } from '../context/FriendContext';
import { ChannelType, InteractionDepth, Interaction, PersonaCategory } from '../types';
import { InteractionEditModal } from '../components/timeline/InteractionEditModal';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

const CHANNELS: (ChannelType | 'All')[] = ['All', 'In-Person', 'Video', 'Call', 'Text'];
const DEPTHS: (InteractionDepth | 'All')[] = ['All', 'Deep Talk', 'Catch-Up', 'Quick Sync'];
const DATE_RANGES = [
  { label: 'Last 7 Days', value: '7d', days: 7 },
  { label: 'Last 30 Days', value: '30d', days: 30 },
  { label: 'Last 90 Days', value: '90d', days: 90 },
  { label: 'All Time', value: 'all', days: 9999 },
];

export const Timeline: React.FC = () => {
  const { friends, interactions, deleteInteraction, openCommandPalette } = useFriends();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<PersonaCategory | 'All'>('All');
  const [selectedFriendId, setSelectedFriendId] = useState<string | 'All'>('All');
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | 'All'>('All');
  const [selectedDepth, setSelectedDepth] = useState<InteractionDepth | 'All'>('All');
  const [dateRange, setDateRange] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Editing state
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);

  // Quick lookup map for friends
  const friendMap = useMemo(() => {
    const map = new Map<string, (typeof friends)[0]>();
    friends.forEach((f) => map.set(f.id, f));
    return map;
  }, [friends]);

  // Filtered interactions
  const filteredInteractions = useMemo(() => {
    const now = Date.now();
    const rangeLimitDays = DATE_RANGES.find((r) => r.value === dateRange)?.days || 9999;
    const cutoffTime = now - rangeLimitDays * 24 * 60 * 60 * 1000;

    return interactions
      .filter((item) => {
        // Persona category filter
        if (selectedCategory !== 'All') {
          const friend = friendMap.get(item.friendId);
          if (friend && friend.category !== selectedCategory) {
            return false;
          }
        }

        // Friend filter
        if (selectedFriendId !== 'All' && item.friendId !== selectedFriendId) {
          return false;
        }

        // Channel filter
        if (selectedChannel !== 'All' && item.channel !== selectedChannel) {
          return false;
        }

        // Depth filter
        if (selectedDepth !== 'All' && item.depth !== selectedDepth) {
          return false;
        }

        // Date range
        const itemTime = new Date(item.date).getTime();
        if (itemTime < cutoffTime) {
          return false;
        }

        // Full-text search
        if (search.trim()) {
          const q = search.toLowerCase();
          const friend = friendMap.get(item.friendId);
          const friendName = friend ? friend.name.toLowerCase() : '';
          const notes = item.notes.toLowerCase();
          const topics = item.topics?.join(' ').toLowerCase() || '';

          if (!friendName.includes(q) && !notes.includes(q) && !topics.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [interactions, selectedCategory, selectedFriendId, selectedChannel, selectedDepth, dateRange, search, friendMap]);

  // Channel summary counts
  const channelCounts = useMemo(() => {
    const counts = { inPerson: 0, video: 0, call: 0, text: 0, deepTalk: 0 };
    interactions.forEach((i) => {
      if (i.channel === 'In-Person') counts.inPerson++;
      if (i.channel === 'Video') counts.video++;
      if (i.channel === 'Call') counts.call++;
      if (i.channel === 'Text') counts.text++;
      if (i.depth === 'Deep Talk') counts.deepTalk++;
    });
    return counts;
  }, [interactions]);

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

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedFriendId('All');
    setSelectedChannel('All');
    setSelectedDepth('All');
    setDateRange('all');
    setSearch('');
  };

  const isFiltered =
    selectedCategory !== 'All' ||
    selectedFriendId !== 'All' ||
    selectedChannel !== 'All' ||
    selectedDepth !== 'All' ||
    dateRange !== 'all' ||
    search !== '';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Activity Stream & Interaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Searchable log of all touchpoints, deep conversations, and commitments across circles
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCommandPalette()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Interaction</span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded bg-indigo-700 text-white font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Top 4 KPI Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <SpotlightCard className="p-4" spotlightColor="rgba(99, 102, 241, 0.12)">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Logged
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={interactions.length} />
            </span>
            <span className="text-xs text-slate-400">touchpoints</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(16, 185, 129, 0.12)">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            In-Person Sessions
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter value={channelCounts.inPerson} />
            </span>
            <span className="text-xs text-slate-400">1.25x boost</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(20, 184, 166, 0.12)">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Deep Conversations
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
              <AnimatedCounter value={channelCounts.deepTalk} />
            </span>
            <span className="text-xs text-slate-400">substantive</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(59, 130, 246, 0.12)">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Calls & Video
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              <AnimatedCounter value={channelCounts.call + channelCounts.video} />
            </span>
            <span className="text-xs text-slate-400">voice / visual</span>
          </div>
        </SpotlightCard>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Persona Segment Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Circle Persona:</span>
          </span>
          {(['All', 'personal', 'career'] as (PersonaCategory | 'All')[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-transparent font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {cat === 'All' ? 'All Circles' : cat === 'career' ? 'Career & Mentors' : 'Personal Circle'}
            </button>
          ))}
        </div>

        {/* Search & Contact Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search interaction notes, topics, or relationship names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <select
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="All">All Relationships ({friends.length})</option>
              {friends.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.circleTier})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Channels, Depth & Date Range Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Channel:
            </span>
            {CHANNELS.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setSelectedChannel(ch)}
                className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all ${
                  selectedChannel === ch
                    ? 'bg-emerald-600 text-white border-transparent font-semibold shadow-2xs'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {ch}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Depth:
            </span>
            {DEPTHS.map((dp) => (
              <button
                key={dp}
                type="button"
                onClick={() => setSelectedDepth(dp)}
                className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all ${
                  selectedDepth === dp
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent font-semibold shadow-2xs'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {dp}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {DATE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="p-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredInteractions.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No interactions match your filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your channel or date range filters to view past touchpoints.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/20 dark:border-emerald-500/10 space-y-6">
          {filteredInteractions.map((item) => {
            const friend = friendMap.get(item.friendId);
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div key={item.id} className="relative group">
                {/* Node icon on timeline spine */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shadow-xs">
                  {getChannelIcon(item.channel)}
                </div>

                {/* Interaction Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    {/* Contact identity */}
                    <div className="flex items-center gap-3">
                      {friend ? (
                        <>
                          <Link to={`/friend/${friend.id}`}>
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          </Link>
                          <div>
                            <Link
                              to={`/friend/${friend.id}`}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                            >
                              {friend.name}
                            </Link>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ml-2 ${
                                friend.category === 'career'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                              }`}
                            >
                              {friend.category === 'career' ? 'Career' : 'Personal'}
                            </span>
                            <span className="text-xs text-slate-400 ml-1.5">
                              · {friend.circleTier}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Contact
                        </span>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {item.channel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                        {item.depth}
                      </span>
                      <span className="text-slate-400 text-xs ml-2 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>

                      {/* Edit / Delete Buttons */}
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          type="button"
                          onClick={() => setEditingInteraction(item)}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit interaction note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteInteraction(item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes Body */}
                  <div className="pt-3">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.notes}
                    </p>

                    {/* Topics Tags */}
                    {item.topics && item.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <InteractionEditModal
        interaction={editingInteraction}
        onClose={() => setEditingInteraction(null)}
      />
    </div>
  );
};

export default Timeline;
