import { addDays, lineForDate, type LocalDate } from '@bestie/core';
import { HOST_NAME } from '@/content/brand';
import { LINES } from '@/content/lines';

/**
 * What the home screen widget shows: her line of the day. The widget itself is a native iOS
 * extension added in the first development build (see apps/pep-talks/README.md); it reads a
 * week of these entries from the shared app group so it stays right even if the app isn't opened.
 */
export interface WidgetEntry {
  date: LocalDate;
  line: string;
  from: string;
}

export function widgetEntries(today: LocalDate, days = 7): WidgetEntry[] {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(today, i);
    return { date, line: lineForDate(LINES, date) ?? '', from: HOST_NAME };
  });
}

export function lineOfTheDay(today: LocalDate): string {
  return lineForDate(LINES, today) ?? LINES[0];
}
