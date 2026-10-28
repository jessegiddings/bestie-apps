/**
 * Names in one place. "Morning Bestie" is the working name (morningbestie.com and .app are open), and the host
 * name is a placeholder until she picks how she wants to appear (first name, full name or a nickname).
 */
export const APP_NAME = 'Morning Bestie';
export const HOST_NAME = 'Bestie';

/** What people want her help with; picked in onboarding and used to order the "I need you" moments. */
export const FOCUS_AREAS = [
  { id: 'confidence', label: 'Confidence' },
  { id: 'calm', label: 'Feeling calmer' },
  { id: 'motivation', label: 'Getting going' },
  { id: 'self-love', label: 'Being kinder to me' },
  { id: 'heartbreak', label: 'Getting over someone' },
  { id: 'dry', label: 'Drinking less' },
] as const;

export type FocusId = (typeof FOCUS_AREAS)[number]['id'];

/** Charms on her friendship bracelet, earned by total mornings listened. Never taken away. */
export const CHARM_DAYS = [1, 3, 7, 14, 30, 50, 100, 365] as const;
export type CharmDay = (typeof CHARM_DAYS)[number];

export const CHARM_NAMES: Record<CharmDay, string> = {
  1: 'First Hello',
  3: 'Three Mornings',
  7: 'One Whole Week',
  14: 'Two Weeks Strong',
  30: 'Month of Mornings',
  50: 'Fifty and Fabulous',
  100: 'One Hundred Mornings',
  365: 'A Year of Us',
};

/** Free plan: the first week of mornings, one talk per moment, and the line of the day forever. */
export const FREE_MORNINGS = 7;

/** Shown on the heavier moments and in Settings. US only for now; add local lines per store country. */
export const CRISIS_LINE = { name: '988 Suicide & Crisis Lifeline', phone: '988', note: 'Call or text 988, any time, free and confidential (US).' } as const;
export const SUPPORT_NOTE = 'These notes are encouragement from a friend, not therapy or medical advice. If you are struggling, please reach out to someone you trust or a professional.';
