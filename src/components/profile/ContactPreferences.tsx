import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
  MessageCircle,
  Sun,
  Moon,
  Save,
  Check,
  Edit3,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Friend, PreferredChannel, BestReachTime, ContactPreferences as IContactPreferences } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { toast } from 'sonner';

interface ContactPreferencesProps {
  friend: Friend;
}

const COMMON_TIMEZONES = [
  { label: 'Pacific Time (PT) - SF, LA, Seattle', value: 'America/Los_Angeles' },
  { label: 'Mountain Time (MT) - Denver, Salt Lake', value: 'America/Denver' },
  { label: 'Central Time (CT) - Chicago, Austin', value: 'America/Chicago' },
  { label: 'Eastern Time (ET) - New York, Boston', value: 'America/New_York' },
  { label: 'Greenwich Mean Time (GMT/BST) - London', value: 'Europe/London' },
  { label: 'Central European (CET) - Berlin, Paris', value: 'Europe/Berlin' },
  { label: 'India Standard Time (IST) - Mumbai, Bengaluru', value: 'Asia/Kolkata' },
  { label: 'Singapore / Hong Kong (SGT/HKT)', value: 'Asia/Singapore' },
  { label: 'Japan / Korea (JST/KST) - Tokyo, Seoul', value: 'Asia/Tokyo' },
  { label: 'Australian Eastern (AEST) - Sydney', value: 'Australia/Sydney' },
];

const CHANNELS: PreferredChannel[] = [
  'Text',
  'Call',
  'Video',
  'In-Person',
  'Email',
  'Async Voice',
];

const REACH_TIMES: BestReachTime[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Weekends',
  'Anytime',
];

export const ContactPreferences: React.FC<ContactPreferencesProps> = ({ friend }) => {
  const { updateFriend } = useFriends();

  const [isEditing, setIsEditing] = useState(false);
  const [preferredChannel, setPreferredChannel] = useState<PreferredChannel>(
    friend.preferences?.preferredChannel || 'Text'
  );
  const [bestTimeToReach, setBestTimeToReach] = useState<BestReachTime>(
    friend.preferences?.bestTimeToReach || 'Afternoon'
  );
  const [timezone, setTimezone] = useState<string>(
    friend.preferences?.timezone || 'America/Los_Angeles'
  );
  const [pronouns, setPronouns] = useState<string>(
    friend.preferences?.pronouns || ''
  );
  const [quickNotes, setQuickNotes] = useState<string>(friend.quickNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  // Live time in contact's timezone
  const [contactLocalTime, setContactLocalTime] = useState<string>('');
  const [isContactSleeping, setIsContactSleeping] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const hourFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          hour12: false,
        });
        const currentHour = parseInt(hourFormatter.format(now), 10);
        setIsContactSleeping(currentHour >= 22 || currentHour < 7);
        setContactLocalTime(formatter.format(now));
      } catch {
        setContactLocalTime('');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handleSavePreferences = () => {
    const updatedPreferences: IContactPreferences = {
      preferredChannel,
      bestTimeToReach,
      timezone,
      pronouns: pronouns.trim() || undefined,
    };

    updateFriend(friend.id, {
      preferences: updatedPreferences,
      quickNotes,
    });

    setIsSaved(true);
    setIsEditing(false);
    toast.success('Contact preferences & notes saved');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              Preferences & Context Scratchpad
              {isSaved && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Communication habits, live local time, and quick scratch notes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleSavePreferences();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Done Editing</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </>
          )}
        </button>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Live Local Time Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Their Time
            </span>
            {isContactSleeping ? (
              <span className="text-[10px] text-indigo-500 flex items-center gap-1 font-medium">
                <Moon className="w-3 h-3" /> Sleep
              </span>
            ) : (
              <span className="text-[10px] text-amber-500 flex items-center gap-1 font-medium">
                <Sun className="w-3 h-3" /> Awake
              </span>
            )}
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {contactLocalTime || 'Local Time'}
          </div>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            {timezone.split('/')[1]?.replace('_', ' ') || timezone}
          </p>
        </div>

        {/* Preferred Channel */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Preferred Outreach
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>{preferredChannel}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Best response rate</p>
        </div>

        {/* Best Time */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Best Reach Time
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{bestTimeToReach}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Lowest friction window</p>
        </div>

        {/* Pronouns */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Pronouns
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {pronouns || 'Not specified'}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Identity & respect</p>
        </div>
      </div>

      {/* Inline Editing Drawer */}
      {isEditing && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/60 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Edit Contact Preferences</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Preferred Channel Select */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Channel
              </label>
              <select
                value={preferredChannel}
                onChange={(e) => setPreferredChannel(e.target.value as PreferredChannel)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Best Time to Reach */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Best Window
              </label>
              <select
                value={bestTimeToReach}
                onChange={(e) => setBestTimeToReach(e.target.value as BestReachTime)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                {REACH_TIMES.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pronouns */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pronouns
              </label>
              <input
                type="text"
                placeholder="e.g. she/her, they/them"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Scratchpad / Fleet Notes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Quick Context Scratchpad</span>
          </label>
          <span className="text-[10px] text-slate-400">
            Auto-synced to your local CRM
          </span>
        </div>
        <textarea
          rows={3}
          placeholder="Jot down quick thoughts, favorite drinks, current trip dates, upcoming talks, or things to follow up on..."
          value={quickNotes}
          onChange={(e) => setQuickNotes(e.target.value)}
          onBlur={handleSavePreferences}
          className="w-full p-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition-all"
        />
      </div>
    </div>
  );
};
