import type { Mood } from '@/state/stats';

export const MOODS: { mood: Mood; emoji: string; label: string }[] = [
  { mood: 'great', emoji: '😄', label: 'Great' },
  { mood: 'good', emoji: '🙂', label: 'Good' },
  { mood: 'meh', emoji: '😐', label: 'Meh' },
  { mood: 'rough', emoji: '😣', label: 'Rough' },
];

/** What the money saved could buy instead, for a smile on the Journey screen. */
export const TREATS = [
  { one: 'fancy coffee', many: 'fancy coffees', usd: 6 },
  { one: 'movie ticket', many: 'movie tickets', usd: 15 },
  { one: 'nice dinner out', many: 'nice dinners out', usd: 60 },
  { one: 'weekend away', many: 'weekends away', usd: 400 },
] as const;
