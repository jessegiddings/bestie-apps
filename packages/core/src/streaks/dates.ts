/**
 * Calendar days as plain `YYYY-MM-DD` strings in the user's own time zone. Every app counts
 * "days" this way so a check-in at 11 pm and one at 1 am land on the days the user expects.
 */
export type LocalDate = string;

export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** The calendar date of `instant` in `tz`. */
export function localDate(instant: Date, tz: string = deviceTimeZone()): LocalDate {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function toUtc(d: LocalDate): number {
  const [y, m, day] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, day);
}

export function addDays(d: LocalDate, n: number): LocalDate {
  return new Date(toUtc(d) + n * 86_400_000).toISOString().slice(0, 10);
}

/** Whole days from `a` to `b` (positive when `b` is later). */
export function daysBetween(a: LocalDate, b: LocalDate): number {
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

export function isValidDate(d: string): d is LocalDate {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(toUtc(d)) && new Date(toUtc(d)).toISOString().slice(0, 10) === d;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Jan 1" style label, no time zone surprises. */
export function shortLabel(d: LocalDate): string {
  const [, m, day] = d.split('-').map(Number);
  return `${MONTHS[m - 1]} ${day}`;
}
