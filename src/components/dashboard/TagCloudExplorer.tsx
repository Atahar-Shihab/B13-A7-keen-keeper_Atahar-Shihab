import React, { useState, useMemo } from 'react';
import { Tag, Hash, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Friend } from '../../types';

interface TagCloudExplorerProps {
  friends: Friend[];
  selectedTag: string | 'All';
  onTagSelect: (tag: string | 'All') => void;
}

export const TagCloudExplorer: React.FC<TagCloudExplorerProps> = ({
  friends,
  selectedTag,
  onTagSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute tag frequencies sorted by count descending
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    friends.forEach((f) => {
      f.tags?.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [friends]);

  if (tagCounts.length === 0) return null;

  const visibleTags = isExpanded ? tagCounts : tagCounts.slice(0, 10);
  const hiddenCount = tagCounts.length - 10;

  return (
    <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Network Tag Explorer
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
            {tagCounts.length} tags
          </span>
        </div>

        {selectedTag !== 'All' && (
          <button
            type="button"
            onClick={() => onTagSelect('All')}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Reset tag filter</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {visibleTags.map(([tag, count]) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagSelect(isSelected ? 'All' : tag)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white font-bold shadow-xs scale-105'
                  : 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Hash className="w-3 h-3 opacity-60" />
              <span>{tag}</span>
              <span
                className={`text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : `+${hiddenCount} more`}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
