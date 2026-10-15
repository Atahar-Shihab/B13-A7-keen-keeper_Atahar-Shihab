import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Activity,
  Zap,
  Bot,
  BarChart3,
  CheckCircle2,
  Users,
  Compass,
  RotateCcw,
  Coffee,
  Heart,
  Command,
} from 'lucide-react';
import { useFriends } from '../../context/FriendContext';

export const PlatformGuideModal: React.FC = () => {
  const { isGuideModalOpen, closeGuideModal, openCommandPalette } = useFriends();
  const [activeStep, setActiveStep] = useState(0);

  if (!isGuideModalOpen) return null;

  const steps = [
    {
      id: 'intro',
      badge: 'Welcome to KeenKeeper v2.0',
      title: 'Nurture relationships with mathematical intelligence',
      subtitle: 'Turn Dunbar’s Number into an unfair advantage',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            Human memory fades over time, and busy schedules cause valued friendships, mentors, and collaborators to quietly drift away.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Algorithmic Half-Life Decay
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculates live relationship health scores (0–100%) that decay smoothly based on cadence targets.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="font-bold text-blue-800 dark:text-blue-300 block mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> &lt;5s Quick Check-In (⌘K)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A keyboard-first command palette logs calls, meetings, notes, and promises in seconds.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="font-bold text-purple-800 dark:text-purple-300 block mb-1 flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> AI Relationship Copilot
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-call executive briefings and tailored icebreaker outreach drafts powered by Gemini & offline synthesis.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" /> Recharts Executive Suite
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                12-week velocity momentum, channel mix donut, and drifting contact watchlist.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'decay-engine',
      badge: 'Core Technology',
      title: 'How the Exponential Health Decay Engine Works',
      subtitle: 'Relationship entropy modeled with mathematical rigor',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900 text-white font-mono text-[11px] text-center border border-slate-700">
            Health = clamp(round(100 × w_channel × e^(-0.693 × (Δt / C))), 0, 100)
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              1. Circle Tiers & Cadence Targets (C):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                <span className="font-bold block text-emerald-600">Inner Circle</span>
                <span className="text-[11px] text-slate-400">Target: Every 7 days</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                <span className="font-bold block text-blue-600">Close Friends</span>
                <span className="text-[11px] text-slate-400">Target: Every 14 days</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                <span className="font-bold block text-teal-600">Key Network</span>
                <span className="text-[11px] text-slate-400">Target: Every 30 days</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                <span className="font-bold block text-indigo-600">Acquaintances</span>
                <span className="text-[11px] text-slate-400">Target: Every 90 days</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              2. Channel Weight Multipliers (w_channel):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span>In-Person</span>
                <span className="font-bold text-emerald-600">1.25x</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span>Video Call</span>
                <span className="font-bold text-blue-600">1.15x</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span>Phone Call</span>
                <span className="font-bold text-indigo-600">1.08x</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span>Message</span>
                <span className="font-bold text-teal-600">1.00x</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Contacts below 50% health automatically enter the <strong>Needs Attention Today</strong> queue, sorted by tier importance.
          </p>
        </div>
      ),
    },
    {
      id: 'quick-action',
      badge: 'Rapid Workflow',
      title: 'Keyboard-First Command Palette (⌘K)',
      subtitle: 'Log meaningful check-ins in under 5 seconds',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            KeenKeeper is designed for zero-friction daily usage. You never have to click through complex CRM forms.
          </p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <kbd className="px-2 py-1 text-xs font-mono font-bold rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                ⌘K / Ctrl+K
              </kbd>
              <div>
                <strong className="text-slate-900 dark:text-white block">Open From Anywhere</strong>
                <span className="text-xs text-slate-500">
                  Press Cmd+K on Mac or Ctrl+K on Windows from any route to open the modal instantly.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <kbd className="px-2 py-1 text-xs font-mono font-bold rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                ↑ ↓ ↵
              </kbd>
              <div>
                <strong className="text-slate-900 dark:text-white block">Keyboard Navigation</strong>
                <span className="text-xs text-slate-500">
                  Type any name, company, or tag, arrow down, and hit Enter to select and log.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <Coffee className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">Capture Depth & Context Takeaways</strong>
                <span className="text-xs text-slate-500">
                  Select conversation depth (Deep Talk, Catch-Up, Quick Sync) and record key highlights or future promises.
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'copilot-vault',
      badge: 'Intelligence & Memory',
      title: 'AI Relationship Copilot & Context Vault',
      subtitle: 'Never show up unprepared to a conversation',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            Every friend profile is an intelligent dossier equipped with:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Pre-Call Executive Briefing
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analyzes previous interaction notes, open tasks, and days elapsed to give you a 3-bullet summary of topics to bring up before dialing.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-1">
              <span className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Contextual Outreach Icebreakers
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generates 3 copyable message templates tailored to the contact: Casual Check-In, Warm Reconnect, and Milestone Follow-Up.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-1">
              <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4" /> Context Vault & Follow-Up Checklist
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stores birthdays, gift preferences, partner/children names, and interactive promise checklists with due dates.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sandbox',
      badge: 'Recruiter Sandbox & Portability',
      title: 'Explore the 6-Month CRM Benchmark',
      subtitle: 'Complete sandbox controls & data sovereignty',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            KeenKeeper v2.0 comes preloaded with a realistic 12-contact, 63-interaction dataset distributed over the past 180 days so you can evaluate the platform immediately.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
            <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> One-Click Sandbox Reset
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Feel free to add contacts, edit notes, log check-ins, or delete items. You can click the <strong>Reset Demo Data</strong> button in the navigation bar anytime to restore the pristine benchmark state.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Export JSON & CSV Reports
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              In the <strong>Analytics</strong> tab, download timestamped JSON backups or spreadsheet-ready CSV reports for complete data ownership.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[activeStep];
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      closeGuideModal();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeGuideModal}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                KeenKeeper Platform Guide
              </span>
              <span className="text-[11px] text-slate-400">
                Step {activeStep + 1} of {steps.length}
              </span>
            </div>
          </div>

          <button
            onClick={closeGuideModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
              {current.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
              {current.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {current.subtitle}
            </p>
          </div>

          <div className="pt-2">{current.content}</div>
        </div>

        {/* Stepper Dots & Navigation Footer */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeStep
                    ? 'w-6 bg-emerald-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {isLast ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeGuideModal();
                    openCommandPalette();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                >
                  <Command className="w-3.5 h-3.5" />
                  <span>Try ⌘K Now</span>
                </button>
                <button
                  type="button"
                  onClick={closeGuideModal}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Start Exploring</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
