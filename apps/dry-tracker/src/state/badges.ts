import type { LocalDate } from '@bestie/core';
import { PATCH_DAYS, PATCH_NAMES } from '@/content/brand';
import type { DayEntry } from './stats';

export type Tier = 'bronze' | 'silver' | 'gold' | 'holo';
export type BadgeIcon = 'sprout' | 'flame' | 'moon' | 'star' | 'crown' | 'mountain' | 'wave' | 'shield' | 'heart' | 'calendar' | 'compass' | 'headphones' | 'pen' | 'sunrise';

export interface Badge {
  id: string;
  name: string;
  /** How you earn it, shown on locked badges too. */
  how: string;
  tier: Tier;
  icon: BadgeIcon;
  kind: 'milestone' | 'moment';
  /** For milestones: the dry-day count printed on the badge. */
  days?: number;
}

const MILESTONE_LOOK: Record<(typeof PATCH_DAYS)[number], { tier: Tier; icon: BadgeIcon }> = {
  1: { tier: 'bronze', icon: 'sprout' },
  3: { tier: 'bronze', icon: 'flame' },
  7: { tier: 'silver', icon: 'moon' },
  14: { tier: 'silver', icon: 'star' },
  21: { tier: 'gold', icon: 'shield' },
  31: { tier: 'gold', icon: 'crown' },
  60: { tier: 'holo', icon: 'mountain' },
  90: { tier: 'holo', icon: 'sunrise' },
};

export const MILESTONES: Badge[] = PATCH_DAYS.map((d) => ({
  id: `day-${d}`,
  name: PATCH_NAMES[d],
  how: `${d} total dry ${d === 1 ? 'day' : 'days'}`,
  kind: 'milestone',
  days: d,
  ...MILESTONE_LOOK[d],
}));

export const MOMENTS: Badge[] = [
  { id: 'craving-crusher', name: 'Craving Crusher', how: 'Ride out a craving with the button', tier: 'bronze', icon: 'wave', kind: 'moment' },
  { id: 'wave-rider', name: 'Wave Rider', how: 'Ride out 10 cravings', tier: 'gold', icon: 'wave', kind: 'moment' },
  { id: 'planner', name: 'The Planner', how: 'Plan a pause day ahead', tier: 'bronze', icon: 'calendar', kind: 'moment' },
  { id: 'weekend-warrior', name: 'Weekend Warrior', how: 'Stay dry on a Friday and the Saturday after', tier: 'silver', icon: 'flame', kind: 'moment' },
  { id: 'comeback', name: 'Comeback Kid', how: 'Have a dry day right after a slip', tier: 'silver', icon: 'heart', kind: 'moment' },
  { id: 'better-together', name: 'Better Together', how: 'Pair up with a buddy', tier: 'silver', icon: 'heart', kind: 'moment' },
  { id: 'good-listener', name: 'Good Listener', how: 'Hear 7 evening check-ins', tier: 'silver', icon: 'headphones', kind: 'moment' },
  { id: 'first-quest', name: 'Side Quester', how: 'Finish a side quest', tier: 'bronze', icon: 'compass', kind: 'moment' },
  { id: 'quest-master', name: 'Quest Master', how: 'Finish 10 side quests', tier: 'gold', icon: 'compass', kind: 'moment' },
  { id: 'journaler', name: 'Dear Diary', how: 'Write a note on 5 different days', tier: 'silver', icon: 'pen', kind: 'moment' },
];

export const ALL_BADGES: Badge[] = [...MILESTONES, ...MOMENTS];

export function badgeById(id: string): Badge | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}

export interface BadgeInputs {
  dryDays: number;
  days: Record<LocalDate, DayEntry>;
  cravingsBeaten: number;
  questsDone: number;
  heard: string[];
  paired: boolean;
}

/** 0 = Sunday. Local dates are plain calendar days, so UTC math is exact. */
export function weekday(d: LocalDate): number {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).getUTCDay();
}

function nextDay(d: LocalDate): LocalDate {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day + 1)).toISOString().slice(0, 10);
}

/** Every badge earned so far, as ids. Badges are never taken away. */
export function earnedBadges(i: BadgeInputs): string[] {
  const out = MILESTONES.filter((b) => i.dryDays >= (b.days ?? Infinity)).map((b) => b.id);
  const entries = Object.values(i.days);
  const kept = (d: LocalDate) => i.days[d]?.mark === 'kept';
  const add = (id: string, ok: boolean) => ok && out.push(id);

  add('craving-crusher', i.cravingsBeaten >= 1);
  add('wave-rider', i.cravingsBeaten >= 10);
  add('planner', entries.some((e) => e.mark === 'paused'));
  add('weekend-warrior', entries.some((e) => e.mark === 'kept' && weekday(e.date) === 5 && kept(nextDay(e.date))));
  add('comeback', entries.some((e) => e.mark === 'missed' && kept(nextDay(e.date))));
  add('better-together', i.paired);
  add('good-listener', i.heard.filter((h) => h.startsWith('checkin-') && h !== 'checkin-before').length >= 7);
  add('first-quest', i.questsDone >= 1);
  add('quest-master', i.questsDone >= 10);
  add('journaler', entries.filter((e) => (e.note ?? '').trim().length > 0).length >= 5);
  return out;
}
