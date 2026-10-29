import { journeyDay, journeyNote, listenRun, milestonesReached, nextMilestone, notesFor, rotate, type LocalDate, type VoiceNote } from '@bestie/core';
import { CHARM_DAYS } from '@/content/brand';
import { MORNING_NOTES } from '@/content/mornings';
import { MOMENT_NOTES } from '@/content/moments';

/** Everything Today shows, computed from saved state so it can be tested without screens. */
export interface TodayView {
  day: number;
  morning: VoiceNote;
  morningLocked: boolean;
  listenedToday: boolean;
  totalMornings: number;
  run: number;
  charms: number[];
  nextCharm: number | null;
}

export function todayView(input: { startDate: LocalDate; listened: readonly LocalDate[]; premium: boolean; today: LocalDate }): TodayView {
  const day = Math.max(1, journeyDay(input.startDate, input.today));
  // Loop from day 2 so the welcome note only plays once.
  const morning = journeyNote(MORNING_NOTES, day, 2)!;
  const total = input.listened.length;
  return {
    day,
    morning,
    morningLocked: !morning.free && !input.premium,
    listenedToday: input.listened.includes(input.today),
    totalMornings: total,
    run: listenRun(input.listened, input.today),
    charms: milestonesReached(total, CHARM_DAYS),
    nextCharm: nextMilestone(total, CHARM_DAYS),
  };
}

/** The talk to play for a moment: unheard first, never the same twice in a row. */
export function talkFor(momentId: string, heard: readonly string[], premium: boolean): VoiceNote | null {
  return rotate(notesFor(MOMENT_NOTES, momentId, premium), heard);
}
