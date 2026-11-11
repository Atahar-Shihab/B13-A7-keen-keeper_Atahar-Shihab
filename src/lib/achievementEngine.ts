import { Friend, Interaction } from '../types';
import { calculateWeeklyStreak } from './relationshipEngine';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'depth' | 'cadence' | 'vault';
  unlocked: boolean;
  progress: number; // 0-100
  progressLabel: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface NetworkMastery {
  level: number;
  levelTitle: string;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
  achievements: Achievement[];
}

const LEVEL_TIERS = [
  { level: 1, title: 'Apprentice Connector', minXP: 0, maxXP: 300 },
  { level: 2, title: 'Consistent Ally', minXP: 300, maxXP: 800 },
  { level: 3, title: 'Community Pillar', minXP: 800, maxXP: 1600 },
  { level: 4, title: 'Kinship Architect', minXP: 1600, maxXP: 3000 },
  { level: 5, title: 'Master of Resonance', minXP: 3000, maxXP: 99999 },
];

/**
 * Computes network mastery XP, level, and all unlocked/locked achievements.
 */
export const calculateNetworkMastery = (
  friends: Friend[],
  interactions: Interaction[]
): NetworkMastery => {
  const streak = calculateWeeklyStreak(interactions);
  const deepTalks = interactions.filter((i) => i.depth === 'Deep Talk').length;
  const inPerson = interactions.filter((i) => i.channel === 'In-Person').length;
  const totalVaultItems = friends.reduce((sum, f) => sum + (f.vault?.length || 0), 0);
  const celebrationNoted = friends.filter((f) => f.birthday || f.anniversary).length;
  const innerCircle = friends.filter((f) => f.circleTier === 'Inner Circle');
  const innerCircleOverdue = innerCircle.filter((f) => f.status === 'Overdue').length;

  // XP calculation:
  // - 20 XP per interaction
  // - 15 bonus XP per Deep Talk
  // - 10 bonus XP per In-Person
  // - 25 XP per weekly streak week
  // - 10 XP per vault item
  // - 30 XP per thriving Inner Circle friend
  const totalXP =
    interactions.length * 20 +
    deepTalks * 15 +
    inPerson * 10 +
    streak * 25 +
    totalVaultItems * 10 +
    innerCircle.filter((f) => f.status === 'Thriving').length * 30;

  // Determine Level
  const currentTier =
    LEVEL_TIERS.find((t) => totalXP >= t.minXP && totalXP < t.maxXP) ||
    LEVEL_TIERS[LEVEL_TIERS.length - 1];

  const rangeXP = Math.max(1, currentTier.maxXP - currentTier.minXP);
  const earnedInTier = Math.max(0, totalXP - currentTier.minXP);
  const progressPercent = Math.min(100, Math.round((earnedInTier / rangeXP) * 100));

  // Define All Achievements
  const achievements: Achievement[] = [
    {
      id: 'first-step',
      title: 'First Step',
      description: 'Log your first interaction with any contact in your circle.',
      icon: '🌱',
      category: 'cadence',
      tier: 'bronze',
      unlocked: interactions.length >= 1,
      progress: Math.min(100, (interactions.length / 1) * 100),
      progressLabel: `${Math.min(1, interactions.length)} / 1 log`,
    },
    {
      id: 'deep-diver',
      title: 'Deep Diver',
      description: 'Conduct and log 10 substantive "Deep Talk" conversations.',
      icon: '🌊',
      category: 'depth',
      tier: 'silver',
      unlocked: deepTalks >= 10,
      progress: Math.min(100, Math.round((deepTalks / 10) * 100)),
      progressLabel: `${deepTalks} / 10 deep talks`,
    },
    {
      id: 'consistency-king',
      title: 'Cadence Sentinel',
      description: 'Maintain an unbroken weekly outreach streak of 4+ weeks.',
      icon: '🔥',
      category: 'streak',
      tier: 'gold',
      unlocked: streak >= 4,
      progress: Math.min(100, Math.round((streak / 4) * 100)),
      progressLabel: `${streak} / 4 weeks`,
    },
    {
      id: 'in-person-master',
      title: 'Face-to-Face Champ',
      description: 'Meet in-person for coffee, meals, or walks 5 times.',
      icon: '☕',
      category: 'depth',
      tier: 'silver',
      unlocked: inPerson >= 5,
      progress: Math.min(100, Math.round((inPerson / 5) * 100)),
      progressLabel: `${inPerson} / 5 sessions`,
    },
    {
      id: 'vault-archivist',
      title: 'Vault Archivist',
      description: 'Record 10+ context vault items (milestones, gift ideas, notes).',
      icon: '📚',
      category: 'vault',
      tier: 'silver',
      unlocked: totalVaultItems >= 10,
      progress: Math.min(100, Math.round((totalVaultItems / 10) * 100)),
      progressLabel: `${totalVaultItems} / 10 items`,
    },
    {
      id: 'zero-inner-drift',
      title: 'Inner Circle Shield',
      description: 'Have zero overdue contacts in your VIP Inner Circle.',
      icon: '🛡️',
      category: 'cadence',
      tier: 'gold',
      unlocked: innerCircle.length > 0 && innerCircleOverdue === 0,
      progress: innerCircle.length > 0 && innerCircleOverdue === 0 ? 100 : 50,
      progressLabel:
        innerCircleOverdue === 0 ? '100% On-Track' : `${innerCircleOverdue} overdue`,
    },
    {
      id: 'celebration-sentinel',
      title: 'Celebration Sentinel',
      description: 'Track birthdays or anniversaries for 5+ relationships.',
      icon: '🎂',
      category: 'vault',
      tier: 'bronze',
      unlocked: celebrationNoted >= 5,
      progress: Math.min(100, Math.round((celebrationNoted / 5) * 100)),
      progressLabel: `${celebrationNoted} / 5 noted`,
    },
    {
      id: 'century-club',
      title: 'Century Touchpoint',
      description: 'Log 50 or more lifetime interactions across all channels.',
      icon: '🏆',
      category: 'cadence',
      tier: 'platinum',
      unlocked: interactions.length >= 50,
      progress: Math.min(100, Math.round((interactions.length / 50) * 100)),
      progressLabel: `${interactions.length} / 50 touchpoints`,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return {
    level: currentTier.level,
    levelTitle: currentTier.title,
    totalXP,
    currentLevelXP: earnedInTier,
    nextLevelXP: rangeXP,
    progressPercent,
    unlockedAchievementsCount: unlockedCount,
    totalAchievementsCount: achievements.length,
    achievements,
  };
};
