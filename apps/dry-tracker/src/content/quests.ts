import { daysBetween, type LocalDate } from '@bestie/core';

/** One small side quest a day: something to do with the evening instead of a drink. Free for everyone. */
export const QUESTS: string[] = [
  'Make a mocktail with a garnish you would be proud to photograph.',
  'Go for a 15-minute walk after dinner, no phone.',
  'Text someone you haven\'t talked to in a month.',
  'Cook something new, even if it\'s just fancy toast.',
  'Take a long shower or bath with music on.',
  'Write down three things that went right today.',
  'Put on a playlist and tidy one drawer.',
  'Stretch for ten minutes before bed.',
  'Try a non-alcoholic beer or wine you\'ve never had.',
  'Watch the sunset, or at least look out the window for five minutes.',
  'Call a friend instead of texting.',
  'Read 10 pages of a book.',
  'Plan something fun for this weekend that isn\'t at a bar.',
  'Make a cup of tea and drink it slowly, no screens.',
  'Do a puzzle, a crossword or a sudoku.',
  'Write a note to future you about how this feels.',
  'Go to bed 30 minutes earlier than usual.',
  'Bake something, even from a box.',
  'Dance to one song in the kitchen.',
  'Clear out your camera roll and keep the best five.',
  'Do something kind for someone without telling them.',
  'Try a new podcast episode on a walk.',
  'Rearrange one corner of a room.',
  'Write the names of five people who make you laugh.',
  'Treat yourself to one small thing with the money you saved.',
  'Learn one new recipe for a fizzy drink.',
  'Have a phone-free dinner.',
  'Plant something, or water the plants you have.',
  'Watch a movie you loved as a kid.',
  'Sit outside for ten minutes and just breathe.',
];

/** Same quest all day, a new one tomorrow, cycling through the list from the start date. */
export function questForDay(startDate: LocalDate, date: LocalDate): { id: string; text: string } {
  const n = Math.max(0, daysBetween(startDate, date));
  const i = n % QUESTS.length;
  return { id: `quest-${i + 1}`, text: QUESTS[i] };
}
