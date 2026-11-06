import { addDays, daysBetween, type LocalDate } from '../streaks/dates';
import type { Clip } from '../voice/player';

/**
 * Her voice notes as a library every app draws from. A note is a recorded clip plus where it can
 * play: a moment tag ("morning", "craving", "big-day"…) and whether free users get it. The dry
 * tracker's check-ins and craving talks, the pep-talk app's morning notes and its "I need you"
 * moments are all the same shape, so one recording day can feed every app.
 */
export interface VoiceNote extends Clip {
  /** Where it can play, e.g. "morning", "craving", "big-day". */
  moments: readonly string[];
  free: boolean;
  /** Short title shown in lists. */
  title?: string;
}

export function notesFor(library: readonly VoiceNote[], moment: string, premium = true): VoiceNote[] {
  return library.filter((n) => n.moments.includes(moment) && (premium || n.free));
}

/**
 * The note for the user's day N (1-based) of a journey: notes play in order, so everyone hears
 * the welcome first. Past the end it keeps cycling from `loopFrom` (1-based) so the onboarding
 * notes do not repeat.
 */
export function journeyNote<T>(ordered: readonly T[], day: number, loopFrom = 1): T | null {
  if (ordered.length === 0 || day < 1) return null;
  if (day <= ordered.length) return ordered[day - 1];
  const start = Math.min(Math.max(loopFrom, 1), ordered.length) - 1;
  const span = ordered.length - start;
  return ordered[start + ((day - ordered.length - 1) % span)];
}

/** 1-based journey day for `today` when the journey began on `start`. */
export function journeyDay(start: LocalDate, today: LocalDate): number {
  return daysBetween(start, today) + 1;
}

/**
 * On-demand talks (the craving button, "I need you" moments): never the same one twice in a row,
 * and unheard ones before repeats. Pass the ids already heard, newest last.
 */
export function rotate<T extends { id: string }>(pool: readonly T[], heard: readonly string[]): T | null {
  if (pool.length === 0) return null;
  const unheard = pool.find((n) => !heard.includes(n.id));
  if (unheard) return unheard;
  // Everything heard: pick the one heard longest ago, which is never the last one.
  const lastSeen = (id: string) => heard.lastIndexOf(id);
  return [...pool].sort((a, b) => lastSeen(a.id) - lastSeen(b.id))[0];
}

/** A stable pick for a calendar day, the same on every device: the widget's line of the day. */
export function lineForDate<T>(lines: readonly T[], date: LocalDate, epoch: LocalDate = '2027-01-01'): T | null {
  if (lines.length === 0) return null;
  const n = daysBetween(epoch, date);
  return lines[((n % lines.length) + lines.length) % lines.length];
}

/** Listened days in a row ending today (or yesterday, since today is not over yet). */
export function listenRun(listened: readonly LocalDate[], today: LocalDate): number {
  const set = new Set(listened);
  let day = set.has(today) ? today : addDays(today, -1);
  let run = 0;
  while (set.has(day)) {
    run += 1;
    day = addDays(day, -1);
  }
  return run;
}
