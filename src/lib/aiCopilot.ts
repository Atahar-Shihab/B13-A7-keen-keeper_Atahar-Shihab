import {
  Friend,
  Interaction,
  AICopilotBriefing,
  AICopilotIcebreakers,
} from '../types';
import { getDaysElapsed, getTargetCadence } from './relationshipEngine';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Deterministic fallback synthesizer for Pre-Call Briefing.
 * Generates an executive summary based on actual contact data, notes, and tasks.
 */
export const synthesizeDeterministicBriefing = (
  friend: Friend,
  interactions: Interaction[]
): AICopilotBriefing => {
  const daysElapsed = getDaysElapsed(friend.lastContactDate);
  const cadence = getTargetCadence(friend);
  const recentLogs = [...interactions]
    .filter((i) => i.friendId === friend.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const openTasks = friend.actionItems.filter((a) => !a.completed);
  const milestones = friend.vault.filter((v) => v.category === 'Milestone');
  const notesVault = friend.vault.filter((v) => v.category === 'Note');

  // 1. Executive Summary Bullets
  const summary: string[] = [];

  if (recentLogs.length > 0) {
    const latest = recentLogs[0];
    summary.push(
      `Last contacted ${daysElapsed} day${daysElapsed === 1 ? '' : 's'} ago via ${latest.channel} (${latest.depth}): "${latest.notes.slice(0, 110)}${latest.notes.length > 110 ? '...' : ''}"`
    );
  } else {
    summary.push(
      `No recent interactions logged. Target cadence for ${friend.circleTier} is every ${cadence} days.`
    );
  }

  if (recentLogs.length > 1) {
    const prev = recentLogs[1];
    summary.push(
      `Prior connection (${prev.channel}): Discussed ${prev.topics?.join(', ') || prev.notes.slice(0, 60)}.`
    );
  } else if (friend.company || friend.role) {
    summary.push(
      `Professional context: ${friend.role || 'Professional'} ${friend.company ? `@ ${friend.company}` : ''}. ${friend.bio.slice(0, 80)}...`
    );
  }

  // 2. Open Commitments
  const openCommitments: string[] = [];
  if (openTasks.length > 0) {
    openTasks.forEach((t) => openCommitments.push(t.title));
  } else {
    openCommitments.push(`No pending promises or action items currently logged.`);
  }

  // 3. Suggested Topics to Bring Up
  const suggestedTopics: string[] = [];
  if (milestones.length > 0) {
    suggestedTopics.push(`Milestone follow-up: ${milestones[0].title} (${milestones[0].description})`);
  }
  if (notesVault.length > 0) {
    suggestedTopics.push(`Personal note check-in: ${notesVault[0].title} — ${notesVault[0].description}`);
  }
  if (recentLogs[0]?.topics && recentLogs[0].topics.length > 0) {
    suggestedTopics.push(`Ask for an update on recent discussions regarding ${recentLogs[0].topics.join(' and ')}.`);
  } else {
    suggestedTopics.push(`Ask about current priorities at ${friend.company || 'work'} and upcoming weekend plans.`);
  }

  return {
    summary,
    openCommitments,
    suggestedTopics,
    generatedAt: new Date().toISOString(),
    source: 'synthesizer',
  };
};

/**
 * Deterministic fallback synthesizer for Contextual Icebreakers.
 * Tailors 3 copyable message templates based on actual friend history.
 */
export const synthesizeDeterministicIcebreakers = (
  friend: Friend,
  interactions: Interaction[]
): AICopilotIcebreakers => {
  const daysElapsed = getDaysElapsed(friend.lastContactDate);
  const firstName = friend.name.split(' ')[0] || friend.name;
  const recentLogs = [...interactions]
    .filter((i) => i.friendId === friend.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestLog = recentLogs[0];
  const milestone = friend.vault.find((v) => v.category === 'Milestone');
  const openTask = friend.actionItems.find((a) => !a.completed);

  // Casual Check-In
  const casual =
    daysElapsed <= 7
      ? `Hey ${firstName}! Great catching up recently. Was just thinking about what you mentioned regarding ${latestLog?.topics?.[0] || 'our last chat'}—hope the rest of your week is going smoothly!`
      : `Hey ${firstName}! Hope you're having an awesome week. Been thinking about you—let's grab a coffee or jump on a quick call sometime soon to catch up!`;

  // Warm Reconnect
  const warmReconnect =
    daysElapsed > 14
      ? `Hi ${firstName}, it's been about ${daysElapsed} days since we last connected and you crossed my mind today. How have things been going with ${friend.company || 'work'}? Would love to hear what you've been working on lately.`
      : `Hey ${firstName}, hope you're taking some time to recharge. Wanted to send a quick note of appreciation for our connection—let me know whenever you're free for a quick chat!`;

  // Topic / Milestone / Task Follow-Up
  let milestoneFollowUp = '';
  if (openTask) {
    milestoneFollowUp = `Hey ${firstName}, quick follow-up on what I promised: "${openTask.title}". Wanted to share this and see how things are progressing on your end!`;
  } else if (milestone) {
    milestoneFollowUp = `Hey ${firstName}, remembered your milestone coming up (${milestone.title})! Wanted to send my warmest wishes and check how everything is shaping up.`;
  } else if (latestLog?.topics?.[0]) {
    milestoneFollowUp = `Hey ${firstName}, I came across an interesting article related to our discussion on ${latestLog.topics[0]} and immediately thought of you. Hope you find it useful!`;
  } else {
    milestoneFollowUp = `Hey ${firstName}, hope everything is thriving at ${friend.company || 'your team'}. Let me know if there is anything I can support you with this quarter!`;
  }

  return {
    casual,
    warmReconnect,
    milestoneFollowUp,
    generatedAt: new Date().toISOString(),
    source: 'synthesizer',
  };
};

/**
 * Generates an executive Pre-Call Catch-Up Briefing using Gemini API,
 * falling back to deterministic synthesizer if key is missing or call fails.
 */
export const generateAIBriefing = async (
  friend: Friend,
  interactions: Interaction[]
): Promise<AICopilotBriefing> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return synthesizeDeterministicBriefing(friend, interactions);
  }

  try {
    const friendLogs = interactions
      .filter((i) => i.friendId === friend.id)
      .slice(0, 5)
      .map((i) => `Date: ${i.date}, Channel: ${i.channel}, Depth: ${i.depth}, Notes: ${i.notes}, Topics: ${i.topics?.join(', ')}`)
      .join('\n');

    const prompt = `You are KeenKeeper's Relationship Intelligence Copilot.
Analyze this contact and generate a 3-bullet pre-call executive briefing.

Contact:
Name: ${friend.name}
Role: ${friend.role} @ ${friend.company}
Circle Tier: ${friend.circleTier}
Bio: ${friend.bio}
Days Since Contact: ${getDaysElapsed(friend.lastContactDate)}
Vault Items: ${JSON.stringify(friend.vault)}
Open Action Items: ${JSON.stringify(friend.actionItems.filter((a) => !a.completed))}

Recent Interactions:
${friendLogs}

Respond ONLY with valid JSON in this exact structure:
{
  "summary": ["bullet 1 about last conversation", "bullet 2 about general relationship context"],
  "openCommitments": ["open promise or task 1"],
  "suggestedTopics": ["topic 1 to bring up", "topic 2 to discuss"]
}`;

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      console.warn('Gemini API call failed, using intelligent fallback');
      return synthesizeDeterministicBriefing(friend, interactions);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return synthesizeDeterministicBriefing(friend, interactions);
    }

    // Clean JSON formatting if enclosed in markdown fences
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || [],
      openCommitments: parsed.openCommitments || [],
      suggestedTopics: parsed.suggestedTopics || [],
      generatedAt: new Date().toISOString(),
      source: 'gemini',
    };
  } catch (error) {
    console.warn('Error invoking Gemini briefing, falling back', error);
    return synthesizeDeterministicBriefing(friend, interactions);
  }
};

/**
 * Generates 3 Contextual Outreach Icebreakers using Gemini API,
 * falling back to deterministic synthesizer if key is missing or call fails.
 */
export const generateAIIcebreakers = async (
  friend: Friend,
  interactions: Interaction[]
): Promise<AICopilotIcebreakers> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return synthesizeDeterministicIcebreakers(friend, interactions);
  }

  try {
    const prompt = `You are KeenKeeper's Outreach Copilot.
Create 3 distinct copyable outreach messages for ${friend.name} (${friend.circleTier}):
1. Casual Check-In (friendly, light, low pressure)
2. Warm Reconnect (thoughtful, acknowledging time elapsed)
3. Topic / Milestone Follow-Up (referencing context from notes, tasks, or milestones)

Context:
Name: ${friend.name}
Role: ${friend.role} @ ${friend.company}
Bio: ${friend.bio}
Days Elapsed: ${getDaysElapsed(friend.lastContactDate)}
Milestones: ${JSON.stringify(friend.vault)}
Open Tasks: ${JSON.stringify(friend.actionItems.filter((a) => !a.completed))}

Respond ONLY with valid JSON in this exact structure:
{
  "casual": "...",
  "warmReconnect": "...",
  "milestoneFollowUp": "..."
}`;

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      return synthesizeDeterministicIcebreakers(friend, interactions);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return synthesizeDeterministicIcebreakers(friend, interactions);
    }

    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      casual: parsed.casual || '',
      warmReconnect: parsed.warmReconnect || '',
      milestoneFollowUp: parsed.milestoneFollowUp || '',
      generatedAt: new Date().toISOString(),
      source: 'gemini',
    };
  } catch (error) {
    console.warn('Error invoking Gemini icebreakers, falling back', error);
    return synthesizeDeterministicIcebreakers(friend, interactions);
  }
};
