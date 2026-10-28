import { addDays, currentRun, daysBetween, keptDays, longestRun, milestonesReached, nextMilestone, unloggedDays, type DayBook, type DayMark, type LocalDate } from '@bestie/core';
import { PATCH_DAYS } from '@/content/brand';

export type Mood = 'great' | 'good' | 'meh' | 'rough';

export interface DayEntry {
  date: LocalDate;
  /** `kept` = a dry day; `paused` = a pause day planned ahead with a pass. */
  mark: DayMark;
  drinks?: number;
  mood?: Mood;
  note?: string;
  at: string;
}

/** Challenge lengths. Finishing one rolls straight into the next with the same days. */
export const CHALLENGES = [
  { days: 14, name: 'Warm-up', passes: 1 },
  { days: 31, name: 'Dry Month', passes: 2 },
  { days: 90, name: 'Ninety', passes: 4 },
] as const;

export type ChallengeDays = (typeof CHALLENGES)[number]['days'];

export interface Plan {
  startDate: LocalDate;
  challengeDays: ChallengeDays;
  /** What a usual week looked like before, used for money and drinks saved. */
  drinksPerWeek: number;
  costPerDrink: number;
  /** Local hour (0-23) for the evening check-in reminder. */
  checkInHour: number;
  why: string;
}

export interface Stats {
  started: boolean;
  daysUntilStart: number;
  /** 1 on the start date; 0 before it. */
  dayNumber: number;
  dryDays: number;
  run: number;
  longest: number;
  drinksSkipped: number;
  moneySaved: number;
  patches: number[];
  nextPatch: number | null;
  todayLogged: boolean;
  /** The challenge in progress, after any that are finished. */
  challenge: (typeof CHALLENGES)[number];
  /** Days left on the current challenge; each pause day moves the finish line one day out. */
  finishDate: LocalDate;
  daysLeft: number;
  finished: ChallengeDays[];
  passesUsed: number;
  passesLeft: number;
  /** Past days in the challenge nobody logged yet. */
  unlogged: LocalDate[];
}

/** Only days from the start date onward count; a day logged early or by mistake is ignored. */
function inRange(book: Record<LocalDate, DayEntry>, from: LocalDate, to: LocalDate): DayBook {
  const out: DayBook = {};
  for (const e of Object.values(book)) if (e.date >= from && e.date <= to) out[e.date] = { date: e.date, mark: e.mark };
  return out;
}

function challengeFor(plan: Plan, dryDays: number) {
  const startIdx = Math.max(0, CHALLENGES.findIndex((c) => c.days === plan.challengeDays));
  const finished: ChallengeDays[] = [];
  for (let i = startIdx; i < CHALLENGES.length; i++) {
    if (dryDays >= CHALLENGES[i].days && i < CHALLENGES.length - 1) finished.push(CHALLENGES[i].days);
    else return { challenge: CHALLENGES[i], finished };
  }
  return { challenge: CHALLENGES[CHALLENGES.length - 1], finished };
}

export function computeStats(plan: Plan, book: Record<LocalDate, DayEntry>, today: LocalDate): Stats {
  const offset = daysBetween(plan.startDate, today);
  const started = offset >= 0;
  const days = inRange(book, plan.startDate, today);
  const allDays = inRange(book, plan.startDate, '9999-12-31');
  const dryDays = keptDays(days);
  const perDay = Math.max(0, plan.drinksPerWeek) / 7;
  const passesUsed = Object.values(allDays).filter((d) => d.mark === 'paused').length;
  const { challenge, finished } = challengeFor(plan, dryDays);
  const finishDate = addDays(plan.startDate, challenge.days - 1 + passesUsed);
  return {
    started,
    daysUntilStart: started ? 0 : -offset,
    dayNumber: started ? offset + 1 : 0,
    dryDays,
    run: started ? currentRun(days, today) : 0,
    longest: longestRun(days),
    drinksSkipped: Math.round(dryDays * perDay),
    moneySaved: Math.round(dryDays * perDay * Math.max(0, plan.costPerDrink)),
    patches: milestonesReached(dryDays, PATCH_DAYS),
    nextPatch: nextMilestone(dryDays, PATCH_DAYS),
    todayLogged: Boolean(book[today]),
    challenge,
    finishDate,
    daysLeft: Math.max(0, daysBetween(today, finishDate) + (started ? 0 : 1)),
    finished,
    passesUsed,
    passesLeft: Math.max(0, challenge.passes - passesUsed),
    unlogged: started ? unloggedDays(days, plan.startDate, addDays(today, -1)) : [],
  };
}
