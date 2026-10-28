import { addDays, daysBetween, isValidDate, localDate, shortLabel } from './dates';
import { currentRun, keptDays, longestRun, milestonesCrossed, milestonesReached, nextMilestone, unloggedDays, type DayBook, type DayMark } from './streaks';

const book = (entries: [string, DayMark][]): DayBook =>
  Object.fromEntries(entries.map(([date, mark]) => [date, { date, mark }]));

describe('dates', () => {
  it('adds days across month and year ends', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-03-01', -1)).toBe('2027-02-28');
    expect(daysBetween('2026-12-25', '2027-01-01')).toBe(7);
  });
  it('reads the calendar date in the given zone', () => {
    const instant = new Date('2027-01-01T04:30:00Z');
    expect(localDate(instant, 'America/Los_Angeles')).toBe('2026-12-31');
    expect(localDate(instant, 'Europe/London')).toBe('2027-01-01');
  });
  it('validates and labels dates', () => {
    expect(isValidDate('2027-02-30')).toBe(false);
    expect(isValidDate('2027-01-01')).toBe(true);
    expect(shortLabel('2027-01-01')).toBe('Jan 1');
  });
});

describe('streaks', () => {
  const b = book([
    ['2027-01-01', 'kept'],
    ['2027-01-02', 'kept'],
    ['2027-01-03', 'missed'],
    ['2027-01-04', 'kept'],
    ['2027-01-05', 'kept'],
    ['2027-01-06', 'kept'],
  ]);
  it('counts kept days, and a miss never removes them', () => {
    expect(keptDays(b)).toBe(5);
    expect(keptDays(b, '2027-01-04')).toBe(3);
  });
  it('keeps a run alive while today is still unlogged', () => {
    expect(currentRun(b, '2027-01-06')).toBe(3);
    expect(currentRun(b, '2027-01-07')).toBe(3);
    expect(currentRun(b, '2027-01-08')).toBe(0);
  });
  it('ends the run on a logged miss today', () => {
    expect(currentRun({ ...b, '2027-01-07': { date: '2027-01-07', mark: 'missed' } }, '2027-01-07')).toBe(0);
  });
  it('finds the longest run', () => {
    expect(longestRun(b)).toBe(3);
  });
  it('reports milestones by total kept days', () => {
    const t = [1, 3, 7] as const;
    expect(milestonesReached(5, t)).toEqual([1, 3]);
    expect(nextMilestone(5, t)).toBe(7);
    expect(nextMilestone(7, t)).toBeNull();
    expect(milestonesCrossed(2, 7, t)).toEqual([3, 7]);
  });
  it('lets a paused day bridge a run without counting', () => {
    const p = book([
      ['2027-01-01', 'kept'],
      ['2027-01-02', 'paused'],
      ['2027-01-03', 'kept'],
    ]);
    expect(currentRun(p, '2027-01-03')).toBe(2);
    expect(longestRun(p)).toBe(2);
    expect(keptDays(p)).toBe(2);
  });
  it('lists the unlogged days for a catch-up', () => {
    expect(unloggedDays(b, '2027-01-05', '2027-01-08')).toEqual(['2027-01-07', '2027-01-08']);
  });
});
