import { CHARM_NOTES } from '@/content/charms';
import { MOMENTS, MOMENT_NOTES, momentsFor } from '@/content/moments';
import { MORNING_NOTES } from '@/content/mornings';
import { LINES } from '@/content/lines';
import { widgetEntries } from '@/services/widget';
import { talkFor, todayView } from './today';

describe('today', () => {
  it('starts everyone on the welcome note, free for the first week', () => {
    const v = todayView({ startDate: '2027-02-08', listened: [], premium: false, today: '2027-02-08' });
    expect(v.day).toBe(1);
    expect(v.morning.id).toBe('morning-1');
    expect(v.morningLocked).toBe(false);
    const d8 = todayView({ startDate: '2027-02-08', listened: [], premium: false, today: '2027-02-15' });
    expect(d8.morning.id).toBe('morning-8');
    expect(d8.morningLocked).toBe(true);
    expect(todayView({ startDate: '2027-02-08', listened: [], premium: true, today: '2027-02-15' }).morningLocked).toBe(false);
  });

  it('never replays the welcome after the library runs out', () => {
    const n = MORNING_NOTES.length;
    const v = todayView({ startDate: '2027-02-01', listened: [], premium: true, today: '2027-02-01' });
    expect(v.morning.id).toBe('morning-1');
    const after = todayView({ startDate: '2027-01-01', listened: [], premium: true, today: `2027-01-${String(n + 1).padStart(2, '0')}` });
    expect(after.morning.id).toBe('morning-2');
  });

  it('counts charms by total mornings, so a missed day never takes one away', () => {
    const listened = ['2027-02-01', '2027-02-02', '2027-02-03', '2027-02-05'];
    const v = todayView({ startDate: '2027-02-01', listened, premium: false, today: '2027-02-07' });
    expect(v.run).toBe(0);
    expect(v.totalMornings).toBe(4);
    expect(v.charms).toEqual([1, 3]);
    expect(v.nextCharm).toBe(7);
  });

  it('rotates moment talks and keeps free users on the free one', () => {
    expect(talkFor('big-day', [], false)?.id).toBe('big-day-1');
    expect(talkFor('big-day', ['big-day-1'], false)?.id).toBe('big-day-1');
    expect(talkFor('big-day', ['big-day-1'], true)?.id).toBe('big-day-2');
  });

  it('puts the moments matching your focus first', () => {
    expect(momentsFor(['dry'])[0].id).toBe('out-dry');
    expect(momentsFor([]).map((m) => m.id)).toEqual(MOMENTS.map((m) => m.id));
  });

  it('has unique ids across every note she records', () => {
    const ids = [...MORNING_NOTES, ...MOMENT_NOTES, ...CHARM_NOTES].map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives the widget a week of lines', () => {
    const e = widgetEntries('2027-02-08');
    expect(e).toHaveLength(7);
    expect(e.every((x) => LINES.includes(x.line))).toBe(true);
  });
});
