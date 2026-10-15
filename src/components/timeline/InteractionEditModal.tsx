import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Coffee, Video, Phone, MessageSquare } from 'lucide-react';
import { Interaction, ChannelType, InteractionDepth } from '../../types';
import { useFriends } from '../../context/FriendContext';

interface InteractionEditModalProps {
  interaction: Interaction | null;
  onClose: () => void;
}

const CHANNELS: { type: ChannelType; label: string; icon: React.ReactNode }[] = [
  { type: 'In-Person', label: 'In-Person', icon: <Coffee className="w-4 h-4" /> },
  { type: 'Video', label: 'Video Call', icon: <Video className="w-4 h-4" /> },
  { type: 'Call', label: 'Phone Call', icon: <Phone className="w-4 h-4" /> },
  { type: 'Text', label: 'Message / Text', icon: <MessageSquare className="w-4 h-4" /> },
];

const DEPTHS: InteractionDepth[] = ['Deep Talk', 'Catch-Up', 'Quick Sync'];

export const InteractionEditModal: React.FC<InteractionEditModalProps> = ({
  interaction,
  onClose,
}) => {
  const { updateInteraction, friends } = useFriends();

  const [channel, setChannel] = useState<ChannelType>('In-Person');
  const [depth, setDepth] = useState<InteractionDepth>('Catch-Up');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [topicsInput, setTopicsInput] = useState('');

  useEffect(() => {
    if (interaction) {
      setChannel(interaction.channel);
      setDepth(interaction.depth);
      setDate(interaction.date ? interaction.date.split('T')[0] : '');
      setNotes(interaction.notes);
      setTopicsInput(interaction.topics ? interaction.topics.join(', ') : '');
    }
  }, [interaction]);

  if (!interaction) return null;

  const targetFriend = friends.find((f) => f.id === interaction.friendId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateInteraction(interaction.id, {
      channel,
      depth,
      date: date ? new Date(date).toISOString() : interaction.date,
      notes: notes.trim(),
      topics,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Edit Interaction Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              With {targetFriend ? targetFriend.name : 'Relationship'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Channel */}
          <div>
            <label className="block font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.type}
                  type="button"
                  onClick={() => setChannel(c.type)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all ${
                    channel === c.type
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Depth & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Conversation Depth
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value as InteractionDepth)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {DEPTHS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Interaction Takeaways / Notes *
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none font-medium"
            />
          </div>

          {/* Topics */}
          <div>
            <label className="block font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Topics Discussed (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Architecture, Career, Travel"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
