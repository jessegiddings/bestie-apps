import { useDry, today } from './store';
beforeEach(() => useDry.getState().reset());
it('keeps earned badges after a day is corrected or cleared', () => {
  const date = today();
  useDry.getState().setPlan({ startDate: date, challengeDays: 31, drinksPerWeek: 7, costPerDrink: 8, checkInHour: 18, why: '' });
  useDry.getState().logDay(date, 'kept');
  expect(useDry.getState().earned).toContain('day-1');
  useDry.getState().logDay(date, 'missed');
  useDry.getState().clearDay(date);
  expect(useDry.getState().earned).toContain('day-1');
  useDry.getState().reset();
  expect(useDry.getState().earned).toEqual([]);
});
