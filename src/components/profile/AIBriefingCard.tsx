import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  FileText,
  Lightbulb,
  CheckSquare,
} from 'lucide-react';
import { Friend, Interaction, AICopilotBriefing, AICopilotIcebreakers } from '../../types';
import {
  generateAIBriefing,
  generateAIIcebreakers,
} from '../../lib/aiCopilot';

interface AIBriefingCardProps {
  friend: Friend;
  interactions: Interaction[];
}

export const AIBriefingCard: React.FC<AIBriefingCardProps> = ({ friend, interactions }) => {
  const [briefing, setBriefing] = useState<AICopilotBriefing | null>(null);
  const [icebreakers, setIcebreakers] = useState<AICopilotIcebreakers | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'casual' | 'reconnect' | 'milestone'>('casual');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    try {
      const [b, i] = await Promise.all([
        generateAIBriefing(friend, interactions),
        generateAIIcebreakers(friend, interactions),
      ]);
      setBriefing(b);
      setIcebreakers(i);
    } catch (e) {
      console.error('Error generating AI relationship intelligence', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, [friend.id, friend.lastContactDate, friend.healthScore]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/10 via-slate-900 to-slate-950 text-white border border-emerald-800/40 shadow-lg space-y-6">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">AI Relationship Copilot</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {briefing?.source === 'gemini' ? 'Google Gemini 1.5 Flash' : 'Synthesizer Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pre-call executive briefing and context-aware outreach icebreakers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchAIAnalysis}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Regenerate Copilot Intelligence"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !briefing ? (
        <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Sparkles className="w-6 h-6 animate-pulse text-emerald-400" />
          <span>Synthesizing relationship history and notes...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Pre-Call Catch-Up Briefing */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Pre-Call Executive Briefing
            </h4>

            {/* Conversation Summary Bullets */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Recent Context & Momentum
              </span>
              <ul className="space-y-2 text-xs text-slate-200">
                {briefing?.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-emerald-400 shrink-0 font-bold">•</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Conversation Topics */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Suggested Topics to Bring Up
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {briefing?.suggestedTopics.map((topic, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-emerald-200"
                  >
                    → {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Contextual Outreach Icebreakers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Tailored Outreach Drafts
              </h4>
            </div>

            {/* Tabs for Icebreaker tone */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('casual')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'casual'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Casual Check-In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reconnect')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'reconnect'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Warm Reconnect
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('milestone')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'milestone'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Follow-Up / Topic
              </button>
            </div>

            {/* Active Icebreaker Content Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 relative group flex flex-col justify-between min-h-[140px]">
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{activeTab === 'casual'
                  ? icebreakers?.casual
                  : activeTab === 'reconnect'
                  ? icebreakers?.warmReconnect
                  : icebreakers?.milestoneFollowUp}"
              </p>

              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Copy & paste directly to Signal / iMessage / Email</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      activeTab === 'casual'
                        ? icebreakers?.casual || ''
                        : activeTab === 'reconnect'
                        ? icebreakers?.warmReconnect || ''
                        : icebreakers?.milestoneFollowUp || '',
                      activeTab
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copiedKey === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Open Commitments Alert */}
            {briefing?.openCommitments && briefing.openCommitments.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
                <span className="font-bold text-purple-300 block mb-1 flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5" /> Open Promises / Commitments
                </span>
                <ul className="space-y-1 text-slate-300">
                  {briefing.openCommitments.map((c, idx) => (
                    <li key={idx}>• {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
