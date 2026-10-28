/**
 * Names in one place. "Dry & Mighty" is the pick for now (her vote may change it), and the host
 * name is a placeholder until she picks how she wants to appear (first name, full name or a nickname).
 */
export const APP_NAME = 'Dry & Mighty';
export const HOST_NAME = 'Hannah';

/** SAMHSA's National Helpline: free, confidential, 24/7, in English and Spanish (US). */
export const HELPLINE = { name: 'SAMHSA National Helpline', phone: '1-800-662-4357', note: 'Free, confidential, 24 hours a day, 7 days a week.' } as const;

export const SAFETY_NOTE =
  'This app is for people taking a break from drinking. It is not medical treatment. If you drink heavily every day, stopping suddenly can be dangerous, so talk to a doctor before you start.';

/** Milestone patches, earned by total dry days. A slip never takes one away. */
export const PATCH_DAYS = [1, 3, 7, 14, 21, 31, 60, 90] as const;

export const PATCH_NAMES: Record<(typeof PATCH_DAYS)[number], string> = {
  1: 'Day One',
  3: 'Three Down',
  7: 'One Whole Week',
  14: 'Two Weeks Clear',
  21: 'Habit Breaker',
  31: 'Dry Month',
  60: 'Double Month',
  90: 'Ninety Strong',
};
