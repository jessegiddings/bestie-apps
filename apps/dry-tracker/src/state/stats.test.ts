import { computeStats, type DayEntry, type Plan } from './stats';

const plan: Plan = { startDate: '2027-01-01', challengeDays: 31, drinksPerWeek: 14, costPerDrink: 9, checkInHour: 18, why: '' };
const entry = (date: string, mark: DayEntry['mark']): [string, DayEntry] => [date, { date, mark, at: `${date}T20:00:00Z` }];

describe('dry tracker stats', () => {
  it('counts down before the start date', () => {
    const s = computeStats(plan, {}, '2026-12-29');
    expect(s.started).toBe(false);
    expect(s.daysUntilStart).toBe(3);
    expect(s.dayNumber).toBe(0);
    expect(s.finishDate).toBe('2027-01-31');
  });

  it('adds up dry days, money and drinks skipped', () => {
    const book = Object.fromEntries([entry('2027-01-01', 'kept'), entry('2027-01-02', 'kept'), entry('2027-01-03', 'missed'), entry('2027-01-04', 'kept')]);
    const s = computeStats(plan, book, '2027-01-04');
    expect(s.dayNumber).toBe(4);
    expect(s.dryDays).toBe(3);
    expect(s.run).toBe(1);
    expect(s.longest).toBe(2);
    expect(s.drinksSkipped).toBe(6);
    expect(s.moneySaved).toBe(54);
    expect(s.patches).toEqual([1, 3]);
    expect(s.nextPatch).toBe(7);
    expect(s.todayLogged).toBe(true);
    expect(s.unlogged).toEqual([]);
  });

  it('moves the finish line out one day per pause and keeps the run', () => {
    const book = Object.fromEntries([entry('2027-01-01', 'kept'), entry('2027-01-02', 'paused'), entry('2027-01-03', 'kept')]);
    const s = computeStats(plan, book, '2027-01-03');
    expect(s.run).toBe(2);
    expect(s.passesUsed).toBe(1);
    expect(s.passesLeft).toBe(1);
    expect(s.finishDate).toBe('2027-02-01');
  });

  it('rolls a finished challenge into the next one', () => {
    const days = Array.from({ length: 14 }, (_, i) => entry(`2027-01-${String(i + 1).padStart(2, '0')}`, 'kept'));
    const s = computeStats({ ...plan, challengeDays: 14 }, Object.fromEntries(days), '2027-01-14');
    expect(s.finished).toEqual([14]);
    expect(s.challenge.days).toBe(31);
  });

  it('lists past days that were never logged', () => {
    const book = Object.fromEntries([entry('2027-01-01', 'kept')]);
    expect(computeStats(plan, book, '2027-01-04').unlogged).toEqual(['2027-01-02', '2027-01-03']);
  });

  it('ignores days logged before the start', () => {
    const book = Object.fromEntries([entry('2026-12-30', 'kept'), entry('2027-01-01', 'kept')]);
    expect(computeStats(plan, book, '2027-01-01').dryDays).toBe(1);
  });
});
