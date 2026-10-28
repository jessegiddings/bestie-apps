import { journeyDay, journeyNote, lineForDate, listenRun, notesFor, rotate, type VoiceNote } from './library';

const n = (id: string, moments: string[], free = false): VoiceNote => ({ id, text: id, moments, free, asset: null });

describe('voice-note library', () => {
  const lib = [n('m1', ['morning'], true), n('m2', ['morning']), n('c1', ['craving', 'big-day'], true), n('c2', ['craving'])];

  it('filters by moment and by plan', () => {
    expect(notesFor(lib, 'craving').map((x) => x.id)).toEqual(['c1', 'c2']);
    expect(notesFor(lib, 'craving', false).map((x) => x.id)).toEqual(['c1']);
    expect(notesFor(lib, 'big-day').map((x) => x.id)).toEqual(['c1']);
  });

  it('plays the journey in order, then loops without the welcome', () => {
    const list = ['welcome', 'a', 'b', 'c'];
    expect([1, 2, 3, 4].map((d) => journeyNote(list, d))).toEqual(['welcome', 'a', 'b', 'c']);
    expect([5, 6, 7, 8].map((d) => journeyNote(list, d, 2))).toEqual(['a', 'b', 'c', 'a']);
    expect(journeyNote(list, 0)).toBeNull();
    expect(journeyNote([], 3)).toBeNull();
  });

  it('counts journey days from the start date', () => {
    expect(journeyDay('2027-02-08', '2027-02-08')).toBe(1);
    expect(journeyDay('2027-02-08', '2027-03-01')).toBe(22);
  });

  it('rotates unheard first and never repeats the last one', () => {
    const pool = lib.filter((x) => x.moments.includes('craving'));
    expect(rotate(pool, [])?.id).toBe('c1');
    expect(rotate(pool, ['c1'])?.id).toBe('c2');
    expect(rotate(pool, ['c1', 'c2'])?.id).toBe('c1');
    expect(rotate(pool, ['c2', 'c1'])?.id).toBe('c2');
    expect(rotate([], [])).toBeNull();
  });

  it('gives every device the same line for a date, before and after the epoch', () => {
    const lines = ['x', 'y', 'z'];
    expect(lineForDate(lines, '2027-01-01')).toBe('x');
    expect(lineForDate(lines, '2027-01-05')).toBe('y');
    expect(lineForDate(lines, '2026-12-31')).toBe('z');
  });

  it('counts a listening run that may not include today yet', () => {
    expect(listenRun(['2027-02-08', '2027-02-09', '2027-02-10'], '2027-02-10')).toBe(3);
    expect(listenRun(['2027-02-08', '2027-02-09'], '2027-02-10')).toBe(2);
    expect(listenRun(['2027-02-07', '2027-02-09'], '2027-02-10')).toBe(1);
    expect(listenRun([], '2027-02-10')).toBe(0);
  });
});
