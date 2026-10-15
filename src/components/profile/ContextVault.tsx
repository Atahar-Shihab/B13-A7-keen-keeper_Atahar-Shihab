import React, { useState } from 'react';
import {
  Archive,
  Plus,
  Trash2,
  Calendar,
  Gift,
  StickyNote,
  X,
  Check,
} from 'lucide-react';
import { Friend, VaultItem, VaultCategory } from '../../types';
import { useFriends } from '../../context/FriendContext';

interface ContextVaultProps {
  friend: Friend;
}

export const ContextVault: React.FC<ContextVaultProps> = ({ friend }) => {
  const { addVaultItem, deleteVaultItem } = useFriends();
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState<VaultCategory>('Milestone');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addVaultItem(friend.id, {
      category,
      title: title.trim(),
      description: description.trim(),
      date: date || undefined,
    });

    // Reset
    setTitle('');
    setDescription('');
    setDate('');
    setIsAdding(false);
  };

  const getCategoryIcon = (cat: VaultCategory) => {
    switch (cat) {
      case 'Milestone':
        return <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Gift Idea':
        return <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Note':
        return <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
            <Archive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Relationship Context Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Milestones, gift preferences, and pinned relationship memories
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Add Item'}</span>
        </button>
      </div>

      {/* Add Item Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleAddItem}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Vault Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VaultCategory)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Milestone">Milestone / Important Date</option>
                <option value="Gift Idea">Gift Idea / Preferences</option>
                <option value="Note">Pinned Context Note</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Title / Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 30th Birthday / Coffee preference / Kid's name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Description / Details *
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. November 14 — Loves light roast Ethiopian pour-overs and mechanical keyboards."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />

            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
            >
              Save to Vault
            </button>
          </div>
        </form>
      )}

      {/* Vault Items Grid */}
      {friend.vault.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          No context items saved in the vault yet. Click "+ Add Item" to store birthdays, gift ideas, or notes.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {friend.vault.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(item.category)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteVaultItem(friend.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.date && (
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
