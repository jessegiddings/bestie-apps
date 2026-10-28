import { registerClips } from '@bestie/core';
import { BEFORE_START, CHECKINS } from './checkins';
import { CRAVING_TALKS } from './cravings';

/**
 * Every clip she records, in one list. To add a recording, drop the file in `assets/voice/` and set
 * `asset: require('../../assets/voice/<id>.m4a')` on the matching entry; no screen changes.
 */
export const PAUSE_NOTE = {
  id: 'pause-note',
  text: "Pause day, planned ahead. That's not a slip, that's a grown-up decision. Enjoy it, drink some water in between, and I'll see you back here tomorrow.",
  asset: null,
};

export function registerAllClips(): void {
  registerClips([...CHECKINS, BEFORE_START, ...CRAVING_TALKS, PAUSE_NOTE]);
}
