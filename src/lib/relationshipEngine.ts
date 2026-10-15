import {
  Friend,
  Interaction,
  CircleTier,
  HealthStatus,
  ChannelType,
  HealthCalculationResult,
  NetworkKPIs,
  WeeklyMomentumPoint,
  ChannelMixPoint,
  TierHealthPoint,
} from '../types';

export const CADENCE_MAP: Record<CircleTier, number> = {
  'Inner Circle': 7,
  'Close Friends': 14,
  'Key Network': 30,
  'Acquaintances': 90,
};

export const CHANNEL_WEIGHTS: Record<ChannelType, number> = {
  'In-Person': 1.25,
  'Video': 1.15,
  'Call': 1.08,
  'Text': 1.0,
};

export const TIER_PRIORITY_WEIGHTS: Record<CircleTier, number> = {
  'Inner Circle': 4,
  'Close Friends': 3,
  'Key Network': 2,
  'Acquaintances': 1,
};

/**
 * Returns the target cadence in days for a friend (considers customCadenceDays override)
 */
export const getTargetCadence = (friend: Pick<Friend, 'circleTier' | 'customCadenceDays'>): number => {
  if (friend.customCadenceDays && friend.customCadenceDays > 0) {
    return friend.customCadenceDays;
  }
  return CADENCE_MAP[friend.circleTier] || 14;
};

/**
 * Calculates days elapsed from an ISO timestamp to now
 */
export const getDaysElapsed = (dateIso: string): number => {
  if (!dateIso) return 999;
  const target = new Date(dateIso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - target);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Classifies a numerical health score (0-100) into a tier
 */
export const classifyStatus = (score: number): HealthStatus => {
  if (score >= 80) return 'Thriving';
  if (score >= 50) return 'Steady';
  if (score >= 25) return 'Drifting';
  return 'Overdue';
};

/**
 * Computes relationship health score using the exponential decay formula:
 * score = clamp(round(100 * w_channel * e^(-0.693 * (delta_t / C))), 0, 100)
 */
export const calculateHealthScore = (
  lastContactIso: string,
  targetCadence: number,
  channel: ChannelType = 'Text'
): HealthCalculationResult => {
  const daysSinceContact = getDaysElapsed(lastContactIso);
  const channelWeight = CHANNEL_WEIGHTS[channel] ?? 1.0;
  const cadence = Math.max(1, targetCadence);

  // Exponential half-life decay where score reaches ~50% at delta_t = C with base weight 1.0
  const decayExponent = -0.693 * (daysSinceContact / cadence);
  const rawScore = 100 * channelWeight * Math.exp(decayExponent);
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const status = classifyStatus(score);

  // Next recommended check-in date
  const lastContactMs = new Date(lastContactIso).getTime() || Date.now();
  const nextRecommendedDate = new Date(lastContactMs + cadence * 86400000).toISOString();

  // Attention needed when score falls below 50 (Drifting or Overdue)
  const isAttentionNeeded = score < 50;

  return {
    score,
    status,
    daysSinceContact,
    targetCadence: cadence,
    channelWeight,
    nextRecommendedDate,
    isAttentionNeeded,
  };
};

/**
 * Computes up-to-date health metrics for a friend model given their most recent interaction
 */
export const computeFriendHealth = (
  friend: Friend,
  latestInteraction?: Interaction
): HealthCalculationResult => {
  const cadence = getTargetCadence(friend);
  const channel = latestInteraction?.channel ?? 'Text';
  const effectiveDate = latestInteraction?.date || friend.lastContactDate || friend.createdAt;

  return calculateHealthScore(effectiveDate, cadence, channel);
};

/**
 * Filters and ranks contacts needing attention today (score < 50),
 * weighted by circle tier importance:
 * urgency = (100 - healthScore) * tierPriorityWeight
 */
export const rankNeedsAttentionQueue = (friends: Friend[]): Friend[] => {
  return friends
    .filter((f) => f.healthScore < 50)
    .sort((a, b) => {
      const priorityA = (100 - a.healthScore) * (TIER_PRIORITY_WEIGHTS[a.circleTier] || 1);
      const priorityB = (100 - b.healthScore) * (TIER_PRIORITY_WEIGHTS[b.circleTier] || 1);
      return priorityB - priorityA;
    });
};

/**
 * Calculates weekly interaction streak (consecutive weeks back from current week with at least 1 interaction)
 */
export const calculateWeeklyStreak = (interactions: Interaction[]): number => {
  if (!interactions || interactions.length === 0) return 0;

  const now = new Date();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  // Group interaction dates into week buckets relative to now
  const weeksWithActivity = new Set<number>();
  interactions.forEach((int) => {
    const intTime = new Date(int.date).getTime();
    const diffMs = now.getTime() - intTime;
    if (diffMs >= 0) {
      const weekIndex = Math.floor(diffMs / oneWeekMs);
      weeksWithActivity.add(weekIndex);
    }
  });

  let streak = 0;
  // If current week has activity, start from 0; if not, check if previous week did
  let currentCheck = weeksWithActivity.has(0) ? 0 : (weeksWithActivity.has(1) ? 1 : -1);

  if (currentCheck === -1) return 0;

  while (weeksWithActivity.has(currentCheck)) {
    streak++;
    currentCheck++;
  }

  return streak;
};

/**
 * Computes high-level CRM KPIs across all contacts and interactions
 */
export const calculateNetworkKPIs = (
  friends: Friend[],
  interactions: Interaction[]
): NetworkKPIs => {
  const totalFriends = friends.length;
  if (totalFriends === 0) {
    return {
      totalFriends: 0,
      averageHealth: 0,
      thrivingCount: 0,
      steadyCount: 0,
      driftingCount: 0,
      overdueCount: 0,
      needsAttentionCount: 0,
      weeklyStreak: 0,
      totalInteractions: interactions.length,
      monthlyInteractions: 0,
    };
  }

  const sumHealth = friends.reduce((acc, f) => acc + f.healthScore, 0);
  const averageHealth = Math.round(sumHealth / totalFriends);

  let thrivingCount = 0;
  let steadyCount = 0;
  let driftingCount = 0;
  let overdueCount = 0;
  let needsAttentionCount = 0;

  friends.forEach((f) => {
    if (f.healthScore >= 80) thrivingCount++;
    else if (f.healthScore >= 50) steadyCount++;
    else if (f.healthScore >= 25) {
      driftingCount++;
      needsAttentionCount++;
    } else {
      overdueCount++;
      needsAttentionCount++;
    }
  });

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const monthlyInteractions = interactions.filter(
    (i) => new Date(i.date).getTime() >= thirtyDaysAgo
  ).length;

  const weeklyStreak = calculateWeeklyStreak(interactions);

  return {
    totalFriends,
    averageHealth,
    thrivingCount,
    steadyCount,
    driftingCount,
    overdueCount,
    needsAttentionCount,
    weeklyStreak,
    totalInteractions: interactions.length,
    monthlyInteractions,
  };
};

/**
 * Calculates 12-week interaction volume and momentum
 */
export const calculate12WeekMomentum = (interactions: Interaction[]): WeeklyMomentumPoint[] => {
  const points: WeeklyMomentumPoint[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const weekStartMs = now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000;
    const weekEndMs = now.getTime() - i * 7 * 24 * 60 * 60 * 1000;

    const startDate = new Date(weekStartMs);
    const label = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    const weekInteractions = interactions.filter((int) => {
      const time = new Date(int.date).getTime();
      return time >= weekStartMs && time < weekEndMs;
    });

    const deepTalks = weekInteractions.filter((int) => int.depth === 'Deep Talk').length;
    const quickSyncs = weekInteractions.filter((int) => int.depth === 'Quick Sync').length;

    points.push({
      week: label,
      interactions: weekInteractions.length,
      deepTalks,
      quickSyncs,
    });
  }

  return points;
};

/**
 * Computes communication channel distribution
 */
export const calculateChannelMix = (interactions: Interaction[]): ChannelMixPoint[] => {
  const totals: Record<ChannelType, number> = {
    'In-Person': 0,
    Video: 0,
    Call: 0,
    Text: 0,
  };

  interactions.forEach((int) => {
    if (totals[int.channel] !== undefined) {
      totals[int.channel]++;
    }
  });

  const total = Math.max(1, interactions.length);

  return (Object.keys(totals) as ChannelType[]).map((channel) => ({
    channel,
    count: totals[channel],
    percentage: Math.round((totals[channel] / total) * 100),
  }));
};

/**
 * Compares average health by circle tier against ideal benchmarks
 */
export const calculateTierHealthBreakdown = (friends: Friend[]): TierHealthPoint[] => {
  const tiers: CircleTier[] = ['Inner Circle', 'Close Friends', 'Key Network', 'Acquaintances'];
  const benchmarks: Record<CircleTier, number> = {
    'Inner Circle': 85,
    'Close Friends': 75,
    'Key Network': 65,
    Acquaintances: 55,
  };

  return tiers.map((tier) => {
    const tierFriends = friends.filter((f) => f.circleTier === tier);
    const count = tierFriends.length;
    const avgScore =
      count > 0 ? Math.round(tierFriends.reduce((acc, f) => acc + f.healthScore, 0) / count) : 0;

    return {
      tier,
      avgScore,
      benchmark: benchmarks[tier],
      contactCount: count,
    };
  });
};

/**
 * Status color utilities for UI
 */
export const getStatusColor = (status: HealthStatus): {
  bg: string;
  text: string;
  border: string;
  ring: string;
  badge: string;
} => {
  switch (status) {
    case 'Thriving':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        ring: '#10b981',
        badge: 'badge-success text-white',
      };
    case 'Steady':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        ring: '#3b82f6',
        badge: 'badge-info text-white',
      };
    case 'Drifting':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        ring: '#f59e0b',
        badge: 'badge-warning text-slate-900',
      };
    case 'Overdue':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        ring: '#ef4444',
        badge: 'badge-error text-white',
      };
  }
};
