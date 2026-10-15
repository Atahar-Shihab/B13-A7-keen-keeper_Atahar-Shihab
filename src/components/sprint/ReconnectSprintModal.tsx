import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Zap,
  X,
  Phone,
  Mail,
  Send,
  Copy,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  RefreshCw,
  Moon,
} from 'lucide-react';
import { Friend } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { getReconnectSprintCandidates, getDaysElapsed } from '../../lib/relationshipEngine';
import { launchOutreach } from '../../lib/outreachLauncher';
import { HealthRing } from '../ui/HealthRing';
import { toast } from 'sonner';

type MessageTone = 'casual' | 'warm' | 'professional';

export const ReconnectSprintModal: React.FC = () => {
  const {
    friends,
    isSprintModalOpen,
    closeSprintModal,
    addInteraction,
    snoozeFriend,
  } = useFriends();

  const candidates = useMemo(() => {
    return getReconnectSprintCandidates(friends, 5);
  }, [friends]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<MessageTone>('casual');
  const [draftMessage, setDraftMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reconnectedCount, setReconnectedCount] = useState(0);

  const currentFriend: Friend | undefined = candidates[currentIndex];

  // Generate contextual AI draft messages based on contact metadata
  const generateDraft = (friend: Friend, tone: MessageTone): string => {
    const firstName = friend.name.split(' ')[0];
    const topVault = friend.vault[0]?.title || '';
    const daysAgo = getDaysElapsed(friend.lastContactDate);
    const company = friend.companyOrOrg || friend.company;

    if (tone === 'casual') {
      if (friend.category === 'personal') {
        return `Hey ${firstName}! It's been about ${daysAgo} days—was just thinking of you! How have you been? Would love to catch up soon.`;
      }
      return `Hey ${firstName}! Hope things are going great with ${company || 'your work'}. It's been a while, would love to do a quick coffee or call soon!`;
    }

    if (tone === 'warm') {
      if (topVault) {
        return `Hi ${firstName}, was just remembering our chat about ${topVault}! How is everything coming along? Hope you're doing well, let's catch up soon.`;
      }
      return `Hi ${firstName}, wanted to check in and see how life has been treating you lately. Miss our chats! Let's schedule a catch-up soon.`;
    }

    // Professional
    if (company) {
      return `Hi ${firstName}, hope you're having a productive quarter at ${company}. Would love to catch up on recent industry developments and hear what you're working on. Let me know if you have 15 minutes for a quick sync next week!`;
    }
    return `Hi ${firstName}, hope you're doing well. Wanted to reach out and reconnect. Would love to hear what you're currently focused on—let me know if you'd be open for a brief catch-up call.`;
  };

  // Sync draft message whenever friend or tone changes
  useEffect(() => {
    if (currentFriend) {
      // Default to professional for career persona, casual for personal
      const defaultTone: MessageTone =
        currentFriend.category === 'career' ? 'professional' : 'casual';
      setSelectedTone(defaultTone);
      setDraftMessage(generateDraft(currentFriend, defaultTone));
      setCopied(false);
    }
  }, [currentIndex, currentFriend]);

  const handleToneChange = (tone: MessageTone) => {
    setSelectedTone(tone);
    if (currentFriend) {
      setDraftMessage(generateDraft(currentFriend, tone));
    }
  };

  // Trigger confetti burst on completion
  const triggerVictoryConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {}
  };

  const advanceCard = () => {
    if (currentIndex + 1 < candidates.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      triggerVictoryConfetti();
    }
  };

  const handleLogAndNext = () => {
    if (!currentFriend) return;

    addInteraction({
      friendId: currentFriend.id,
      channel: currentFriend.category === 'career' ? 'Call' : 'Text',
      depth: 'Quick Sync',
      notes: `Weekly Reconnect Sprint: sent outreach (${selectedTone} tone). "${draftMessage.slice(0, 100)}..."`,
    });

    setReconnectedCount((prev) => prev + 1);
    toast.success(`Touchpoint logged for ${currentFriend.name}!`);
    advanceCard();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftMessage);
    setCopied(true);
    toast.success('Draft copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOutreach = (channel: 'whatsapp' | 'email' | 'linkedin') => {
    if (!currentFriend) return;

    const res = launchOutreach(channel, {
      name: currentFriend.name,
      phone: currentFriend.phone,
      email: currentFriend.email,
      linkedinUrl: currentFriend.linkedinUrl,
      messageText: draftMessage,
      subject: `Catch-up with ${currentFriend.name}`,
    });

    if (res.success) {
      // Auto-log touchpoint when launching outreach
      addInteraction({
        friendId: currentFriend.id,
        channel: channel === 'whatsapp' ? 'Text' : channel === 'email' ? 'Text' : 'Call',
        depth: 'Quick Sync',
        notes: `Weekly Reconnect Sprint: launched ${channel} outreach with draft: "${draftMessage.slice(0, 80)}..."`,
      });
      setReconnectedCount((prev) => prev + 1);
      toast.success(`Launched ${channel} & logged touchpoint!`);
      advanceCard();
    } else {
      toast.error(res.error || 'Failed to launch channel');
    }
  };

  const handleSnooze = () => {
    if (!currentFriend) return;
    snoozeFriend(currentFriend.id, 7);
    advanceCard();
  };

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    if (!isSprintModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSprintModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSprintModalOpen, closeSprintModal]);

  if (!isSprintModalOpen) return null;

  const total = candidates.length;
  const progressPercent = total > 0 ? ((currentIndex) / total) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sprint-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 id="sprint-title" className="text-sm font-bold tracking-tight">
                5-Minute Reconnect Sprint
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Fast-track touchpoints for drifting relationships
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted && total > 0 && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {currentIndex + 1} of {total}
              </span>
            )}
            <button
              onClick={closeSprintModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Sprint"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linear progress bar */}
        {!isCompleted && (
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Body Container */}
        <div className="p-6">
          {isCompleted ? (
            /* Victory Screen */
            <div className="flex flex-col items-center text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                  <Award className="w-8 h-8" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                Sprint Completed! 🚀
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mb-6">
                You took proactive action to keep your relationships alive.
                {reconnectedCount > 0
                  ? ` Logged ${reconnectedCount} touchpoint${reconnectedCount > 1 ? 's' : ''} today!`
                  : ' All selected candidates reviewed.'}
              </p>

              <button
                onClick={closeSprintModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : !currentFriend ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400 text-xs">
              No contacts currently require reconnection! Your network is thriving.
            </div>
          ) : (
            /* Current Candidate Card */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFriend.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Contact Banner */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentFriend.avatar}
                      alt={currentFriend.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {currentFriend.name}
                        </h4>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${
                            currentFriend.category === 'career'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                        >
                          {currentFriend.category === 'career' ? 'Career' : 'Personal'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentFriend.roleOrContext || currentFriend.companyOrOrg || currentFriend.circleTier}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-600 dark:text-slate-400">
                        Last Touch
                      </div>
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {getDaysElapsed(currentFriend.lastContactDate)}d ago
                      </div>
                    </div>
                    <HealthRing
                      score={currentFriend.healthScore}
                      size={38}
                      strokeWidth={4}
                      showScore={false}
                    />
                  </div>
                </div>

                {/* Tone Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>AI Draft Reconnect Message</span>
                    </label>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Select tone</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    {(['casual', 'warm', 'professional'] as MessageTone[]).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleToneChange(tone)}
                        className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                          selectedTone === tone
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Draft Message Textarea */}
                <div className="relative">
                  <textarea
                    rows={4}
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
                    placeholder="Type or edit message..."
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 text-[10px] text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* 1-Click Launch Channels */}
                <div>
                  <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase mb-2">
                    1-Click Outreach & Auto-Log
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleOutreach('whatsapp')}
                      disabled={!currentFriend.phone}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleOutreach('email')}
                      disabled={!currentFriend.email}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>

                    <button
                      onClick={() => handleOutreach('linkedin')}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-medium transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </button>
                  </div>
                </div>

                {/* Footer Controls: Snooze, Skip, Log & Next */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSnooze}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Snooze 7d</span>
                    </button>

                    <button
                      onClick={advanceCard}
                      className="text-xs text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Skip
                    </button>
                  </div>

                  <button
                    onClick={handleLogAndNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
                  >
                    <span>Log & Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
