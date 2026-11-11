import { Friend } from '../types';

export interface UpcomingCelebration {
  friendId: string;
  friendName: string;
  friendAvatar: string;
  type: 'birthday' | 'anniversary';
  date: string; // YYYY-MM-DD (original)
  nextOccurrence: Date;
  daysUntil: number;
  turnsAge?: number; // only for birthdays
  label: string;
}

/**
 * Parse a YYYY-MM-DD string into year, month, day.
 */
const parseDateParts = (dateStr: string): { year: number; month: number; day: number } | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1] - 1, day: parts[2] }; // month is 0-indexed
};

/**
 * Get the next occurrence of a recurring annual date (birthday/anniversary).
 * If the date already passed this year, returns next year's date.
 */
const getNextOccurrence = (
  month: number,
  day: number,
  referenceDate: Date = new Date()
): Date => {
  const thisYear = referenceDate.getFullYear();
  const thisYearDate = new Date(thisYear, month, day);

  // If today IS the date, return today
  if (
    thisYearDate.getMonth() === referenceDate.getMonth() &&
    thisYearDate.getDate() === referenceDate.getDate() &&
    thisYearDate.getFullYear() === referenceDate.getFullYear()
  ) {
    return thisYearDate;
  }

  // If this year's date has already passed, use next year
  if (thisYearDate.getTime() < referenceDate.getTime()) {
    return new Date(thisYear + 1, month, day);
  }

  return thisYearDate;
};

/**
 * Calculate days between two dates (ignoring time).
 */
const daysBetween = (a: Date, b: Date): number => {
  const msPerDay = 86400000;
  const aDay = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bDay = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round(Math.abs(bDay - aDay) / msPerDay);
};

/**
 * Get all upcoming celebrations (birthdays + anniversaries) within `withinDays` days.
 * Sorted by soonest first.
 */
export const getUpcomingCelebrations = (
  friends: Friend[],
  withinDays: number = 30
): UpcomingCelebration[] => {
  const now = new Date();
  const celebrations: UpcomingCelebration[] = [];

  friends.forEach((friend) => {
    // Birthday
    if (friend.birthday) {
      const parts = parseDateParts(friend.birthday);
      if (parts) {
        const next = getNextOccurrence(parts.month, parts.day, now);
        const daysUntil = daysBetween(now, next);

        if (daysUntil <= withinDays) {
          const turnsAge = next.getFullYear() - parts.year;
          celebrations.push({
            friendId: friend.id,
            friendName: friend.name,
            friendAvatar: friend.avatar,
            type: 'birthday',
            date: friend.birthday,
            nextOccurrence: next,
            daysUntil,
            turnsAge: turnsAge > 0 ? turnsAge : undefined,
            label:
              daysUntil === 0
                ? `🎂 Today is ${friend.name}'s birthday!`
                : daysUntil === 1
                ? `🎂 ${friend.name}'s birthday is tomorrow!`
                : `🎂 ${friend.name}'s birthday in ${daysUntil} days`,
          });
        }
      }
    }

    // Anniversary
    if (friend.anniversary) {
      const parts = parseDateParts(friend.anniversary);
      if (parts) {
        const next = getNextOccurrence(parts.month, parts.day, now);
        const daysUntil = daysBetween(now, next);

        if (daysUntil <= withinDays) {
          const years = next.getFullYear() - parts.year;
          celebrations.push({
            friendId: friend.id,
            friendName: friend.name,
            friendAvatar: friend.avatar,
            type: 'anniversary',
            date: friend.anniversary,
            nextOccurrence: next,
            daysUntil,
            label:
              daysUntil === 0
                ? `🎉 Today is your ${years}-year anniversary with ${friend.name}!`
                : daysUntil === 1
                ? `🎉 ${years}-year anniversary with ${friend.name} is tomorrow!`
                : `🎉 ${years}-year anniversary with ${friend.name} in ${daysUntil} days`,
          });
        }
      }
    }
  });

  return celebrations.sort((a, b) => a.daysUntil - b.daysUntil);
};

/**
 * Formats a birthday/anniversary countdown as a compact badge label.
 */
export const formatCountdownBadge = (daysUntil: number, type: 'birthday' | 'anniversary'): string => {
  const icon = type === 'birthday' ? '🎂' : '🎉';
  if (daysUntil === 0) return `${icon} Today!`;
  if (daysUntil === 1) return `${icon} Tomorrow`;
  if (daysUntil <= 7) return `${icon} ${daysUntil}d`;
  return `${icon} ${daysUntil}d`;
};

/**
 * Check if a friend has any celebration coming within `withinDays`.
 */
export const getFriendCelebration = (
  friend: Friend,
  withinDays: number = 14
): UpcomingCelebration | null => {
  const results = getUpcomingCelebrations([friend], withinDays);
  return results.length > 0 ? results[0] : null;
};
