import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Command,
  Sparkles,
  Zap,
  Filter,
  Compass,
} from 'lucide-react';
import { useFriends } from '../context/FriendContext';
import { CircleTier, HealthStatus, SortField } from '../types';
import {
  calculateNetworkKPIs,
  rankNeedsAttentionQueue,
  getDaysElapsed,
} from '../lib/relationshipEngine';
import { KPISummary } from '../components/dashboard/KPISummary';
import { NeedsAttentionQueue } from '../components/dashboard/NeedsAttentionQueue';
import { FilterSortBar } from '../components/dashboard/FilterSortBar';
import { FriendCard } from '../components/dashboard/FriendCard';
import { PersonaSwitcher } from '../components/dashboard/PersonaSwitcher';
import { ViewSwitcher, DashboardViewMode } from '../components/dashboard/ViewSwitcher';
import { OrbitalRadar } from '../components/dashboard/OrbitalRadar';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';

const Home: React.FC = () => {
  const {
    friends,
    interactions,
    openCommandPalette,
    openAddFriendModal,
    openGuideModal,
    openSprintModal,
    activePersona,
    setActivePersona,
  } = useFriends();

  // View Mode: 'grid' | 'radar' | 'pipeline'
  const [viewMode, setViewMode] = useState<DashboardViewMode>('grid');

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<CircleTier | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<HealthStatus | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortField>('healthAsc');

  // Compute Network KPIs
  const kpis = useMemo(() => {
    return calculateNetworkKPIs(friends, interactions);
  }, [friends, interactions]);

  // Priority Attention Queue
  const attentionQueue = useMemo(() => {
    return rankNeedsAttentionQueue(friends);
  }, [friends]);

  // Persona counts
  const personaCounts = useMemo(() => {
    return {
      all: friends.length,
      personal: friends.filter((f) => f.category === 'personal').length,
      career: friends.filter((f) => f.category === 'career').length,
    };
  }, [friends]);

  // Unique tags across all friends
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    friends.forEach((f) => f.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [friends]);

  // Filtered & Sorted Friends
  const filteredFriends = useMemo(() => {
    return friends
      .filter((friend) => {
        // Persona filter
        if (activePersona !== 'all' && friend.category !== activePersona) {
          return false;
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matches =
            friend.name.toLowerCase().includes(q) ||
            friend.circleTier.toLowerCase().includes(q) ||
            friend.tags.some((t) => t.toLowerCase().includes(q)) ||
            (friend.company && friend.company.toLowerCase().includes(q)) ||
            (friend.companyOrOrg && friend.companyOrOrg.toLowerCase().includes(q)) ||
            (friend.roleOrContext && friend.roleOrContext.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Tier filter
        if (tierFilter !== 'All' && friend.circleTier !== tierFilter) {
          return false;
        }

        // Health Status filter
        if (statusFilter !== 'All' && friend.status !== statusFilter) {
          return false;
        }

        // Tag filter
        if (selectedTag !== 'All' && !friend.tags.includes(selectedTag)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'healthAsc':
            return a.healthScore - b.healthScore;
          case 'healthDesc':
            return b.healthScore - a.healthScore;
          case 'lastContact': {
            const daysA = getDaysElapsed(a.lastContactDate);
            const daysB = getDaysElapsed(b.lastContactDate);
            return daysB - daysA; // longest ago first
          }
          case 'name':
            return a.name.localeCompare(b.name);
          case 'tier':
            return a.circleTier.localeCompare(b.circleTier);
          default:
            return 0;
        }
      });
  }, [friends, activePersona, search, tierFilter, statusFilter, selectedTag, sortBy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Executive Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Relationship Health Intelligence OS v2.0</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Nurture authentic connections with mathematical precision.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            KeenKeeper models relationship entropy using exponential half-life decay.
            Prioritize who to call, capture deep context notes, schedule meetings in 1-click, and accelerate catch-ups with the 5-Minute Sprint.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openCommandPalette()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <Command className="w-4 h-4" />
              <span>Quick Check-In</span>
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={openSprintModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-450 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current text-amber-200" />
              <span>5-Min Sprint</span>
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-black/25 text-white font-mono text-[10px]">
                ⌘J
              </kbd>
            </button>

            <button
              type="button"
              onClick={openAddFriendModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 backdrop-blur-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Contact</span>
            </button>

            <button
              type="button"
              onClick={openGuideModal}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2 border border-white/10 backdrop-blur-sm transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>How It Works (Guide)</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-60 h-60 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
      </section>

      {/* 5-Column Executive KPI Summary */}
      <KPISummary kpis={kpis} />

      {/* Priority Needs Attention Queue */}
      <NeedsAttentionQueue attentionQueue={attentionQueue} />

      {/* Filterable Contact Directory Header & Switchers */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Relationship Intelligence Center
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredFriends.length} of {friends.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch perspectives between Bento Grid, Solar Orbital Radar, and Pipeline Board
            </p>
          </div>

          {/* Switchers Row */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
            <PersonaSwitcher
              value={activePersona}
              onChange={setActivePersona}
              counts={personaCounts}
            />

            <ViewSwitcher
              value={viewMode}
              onChange={setViewMode}
            />
          </div>
        </div>

        {/* Render View Mode */}
        {viewMode === 'radar' ? (
          <OrbitalRadar friends={friends} activePersona={activePersona} />
        ) : viewMode === 'pipeline' ? (
          <KanbanBoard friends={friends} activePersona={activePersona} />
        ) : (
          /* Bento Grid with Filters */
          <div className="space-y-4">
            <FilterSortBar
              search={search}
              onSearchChange={setSearch}
              tierFilter={tierFilter}
              onTierChange={setTierFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              availableTags={availableTags}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalFiltered={filteredFriends.length}
            />

            {filteredFriends.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  No contacts match your filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your circle tier, health status, or search query to view relationships.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
