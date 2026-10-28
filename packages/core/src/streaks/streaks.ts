import { addDays, type LocalDate } from './dates';

/**
 * Day-by-day habit records shared by every app. A day is kept (the habit happened), missed, or
 * paused (planned ahead, like a wedding), and a day nobody logged is simply unknown. Totals never
 * go down: a missed day ends the current run but never takes away a kept day, and a paused day
 * neither counts nor breaks the run, so there is nothing to lose by being honest.
 */
export type DayMark = 'kept' | 'missed' | 'paused';

export interface DayRecord {
  date: LocalDate;
  mark: DayMark;
}

export type DayBook = Record<LocalDate, DayRecord>;

export function keptDays(book: DayBook, from?: LocalDate, to?: LocalDate): number {
  return Object.values(book).filter((r) => r.mark === 'kept' && (!from || r.date >= from) && (!to || r.date <= to)).length;
}

/**
 * Consecutive kept days ending today. Today counts once it is logged; an unlogged today does not
 * break a run that reaches yesterday, because the day is not over yet.
 */
export function currentRun(book: DayBook, today: LocalDate): number {
  const mark = book[today]?.mark;
  if (mark === 'missed') return 0;
  let day: LocalDate = mark === 'kept' ? today : addDays(today, -1);
  let run = 0;
  for (;;) {
    const m = book[day]?.mark;
    if (m === 'kept') run += 1;
    else if (m !== 'paused') break;
    day = addDays(day, -1);
  }
  return run;
}

export function longestRun(book: DayBook): number {
  const days = Object.values(book)
    .filter((r) => r.mark !== 'missed')
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  let best = 0;
  let run = 0;
  let prev: LocalDate | null = null;
  for (const r of days) {
    if (!prev || addDays(prev, 1) !== r.date) run = 0;
    if (r.mark === 'kept') run += 1;
    best = Math.max(best, run);
    prev = r.date;
  }
  return best;
}

/** Days with no record between `from` and `to`, oldest first: the ones a catch-up can fill. */
export function unloggedDays(book: DayBook, from: LocalDate, to: LocalDate): LocalDate[] {
  const out: LocalDate[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) if (!book[d]) out.push(d);
  return out;
}

/** Milestones are counts of kept days, never of a streak, so a slip cannot take one away. */
export function milestonesReached(count: number, thresholds: readonly number[]): number[] {
  return thresholds.filter((t) => count >= t);
}

export function nextMilestone(count: number, thresholds: readonly number[]): number | null {
  return thresholds.find((t) => t > count) ?? null;
}

/** Thresholds crossed by going from `before` to `after` kept days, for the "you earned a patch" moment. */
export function milestonesCrossed(before: number, after: number, thresholds: readonly number[]): number[] {
  return thresholds.filter((t) => t > before && t <= after);
}
