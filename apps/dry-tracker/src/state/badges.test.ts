import { earnedBadges, weekday, type BadgeInputs } from './badges';
import type { DayEntry } from './stats';

const day = (date: string, mark: DayEntry['mark'], note?: string): [string, DayEntry] => [date, { date, mark, note, at: `${date}T20:00:00Z` }];
const base: BadgeInputs = { dryDays: 0, days: {}, cravingsBeaten: 0, questsDone: 0, heard: [], paired: false };

describe('badges', () => {
  it('knows the weekday of a calendar date', () => {
    expect(weekday('2027-01-01')).toBe(5); // a Friday
  });

  it('earns milestones by total dry days', () => {
    expect(earnedBadges({ ...base, dryDays: 7 })).toEqual(['day-1', 'day-3', 'day-7']);
  });

  it('earns moment badges from what you did', () => {
    const days = Object.fromEntries([
      day('2027-01-01', 'kept'),
      day('2027-01-02', 'kept'),
      day('2027-01-03', 'missed'),
      day('2027-01-04', 'kept'),
      day('2027-01-05', 'paused'),
    ]);
    const got = earnedBadges({ ...base, days, cravingsBeaten: 1, questsDone: 1, paired: true });
    expect(got).toEqual(expect.arrayContaining(['craving-crusher', 'planner', 'weekend-warrior', 'comeback', 'better-together', 'first-quest']));
    expect(got).not.toContain('wave-rider');
    expect(got).not.toContain('journaler');
  });

  it('needs a Friday and the Saturday after for Weekend Warrior', () => {
    const days = Object.fromEntries([day('2027-01-02', 'kept'), day('2027-01-03', 'kept')]);
    expect(earnedBadges({ ...base, days })).not.toContain('weekend-warrior');
  });

  it('counts check-ins heard, not other clips', () => {
    const heard = ['checkin-before', 'craving-1', ...Array.from({ length: 6 }, (_, i) => `checkin-${i + 1}`)];
    expect(earnedBadges({ ...base, heard })).not.toContain('good-listener');
    expect(earnedBadges({ ...base, heard: [...heard, 'checkin-7'] })).toContain('good-listener');
  });
});
