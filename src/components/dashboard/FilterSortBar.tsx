import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { CircleTier, HealthStatus, SortField } from '../../types';

interface FilterSortBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  tierFilter: CircleTier | 'All';
  onTierChange: (tier: CircleTier | 'All') => void;
  statusFilter: HealthStatus | 'All';
  onStatusChange: (status: HealthStatus | 'All') => void;
  selectedTag: string | 'All';
  onTagChange: (tag: string | 'All') => void;
  availableTags: string[];
  sortBy: SortField;
  onSortChange: (sort: SortField) => void;
  totalFiltered: number;
}

const TIERS: (CircleTier | 'All')[] = [
  'All',
  'Inner Circle',
  'Close Friends',
  'Key Network',
  'Acquaintances',
];

const STATUSES: (HealthStatus | 'All')[] = [
  'All',
  'Thriving',
  'Steady',
  'Drifting',
  'Overdue',
];

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  search,
  onSearchChange,
  tierFilter,
  onTierChange,
  statusFilter,
  onStatusChange,
  selectedTag,
  onTagChange,
  availableTags,
  sortBy,
  onSortChange,
  totalFiltered,
}) => {
  const isAnyFilterActive =
    search || tierFilter !== 'All' || statusFilter !== 'All' || selectedTag !== 'All';

  const clearFilters = () => {
    onSearchChange('');
    onTierChange('All');
    onStatusChange('All');
    onTagChange('All');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search contacts by name, company, role, bio, or tags..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortField)}
              className="pl-8 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 cursor-pointer shadow-2xs"
            >
              <option value="healthAsc">Sort: Lowest Health First (Urgent)</option>
              <option value="healthDesc">Sort: Highest Health First</option>
              <option value="lastContact">Sort: Longest Since Contact</option>
              <option value="name">Sort: Alphabetical (Name)</option>
              <option value="tier">Sort: Circle Tier</option>
            </select>
          </div>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Pill Filters: Circle Tiers & Status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Circle:
        </span>
        {TIERS.map((tier) => {
          const isActive = tierFilter === tier;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onTierChange(tier)}
              className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tier}
            </button>
          );
        })}

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Health:
        </span>
        {STATUSES.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white border-transparent shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Tags Filter (if available) */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-400 dark:text-slate-500 mr-1">Tags:</span>
          {availableTags.slice(0, 8).map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagChange(isTagActive ? 'All' : tag)}
                className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-medium transition-colors ${
                  isTagActive
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
