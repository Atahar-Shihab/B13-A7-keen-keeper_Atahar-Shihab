import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, Check } from 'lucide-react';
import { Friend, ActionItem } from '../../types';
import { useFriends } from '../../context/FriendContext';

interface ActionItemsChecklistProps {
  friend: Friend;
}

export const ActionItemsChecklist: React.FC<ActionItemsChecklistProps> = ({ friend }) => {
  const { addActionItem, toggleActionItem, deleteActionItem } = useFriends();
  const [newTitle, setNewTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addActionItem(friend.id, {
      title: newTitle.trim(),
      completed: false,
      dueDate: dueDate || undefined,
    });

    setNewTitle('');
    setDueDate('');
    setIsAdding(false);
  };

  const pendingItems = friend.actionItems.filter((a) => !a.completed);
  const completedItems = friend.actionItems.filter((a) => a.completed);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Follow-Up Promises & Action Items
              {pendingItems.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300">
                  {pendingItems.length} open
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Never drop a promise or forget a commitment made during conversations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'New Promise'}</span>
        </button>
      </div>

      {/* Inline Add Task Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 animate-in fade-in duration-150"
        >
          <input
            type="text"
            required
            placeholder="What did you promise to send or follow up on?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0 shadow-xs"
          >
            Add Task
          </button>
        </form>
      )}

      {/* Task List */}
      {friend.actionItems.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs">
          No open promises or follow-up tasks. Add one when you promise to share an article, make an intro, or send a gift!
        </div>
      ) : (
        <div className="space-y-2">
          {friend.actionItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors group ${
                item.completed
                  ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleActionItem(friend.id, item.id)}
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    item.completed
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-teal-500'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="min-w-0">
                  <span
                    className={`text-xs font-medium block truncate ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.dueDate && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> Due:{' '}
                      {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteActionItem(friend.id, item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
