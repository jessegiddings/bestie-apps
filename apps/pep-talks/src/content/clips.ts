import { registerClips, type VoiceNote } from '@bestie/core';
import { CHARM_NOTES } from './charms';
import { MOMENT_NOTES } from './moments';
import { MORNING_NOTES } from './mornings';

/**
 * Every note she records, in one list. To add a recording, drop the file in `assets/voice/` and
 * set `asset: require('../../assets/voice/<id>.m4a')` on the matching entry; no screen changes.
 */
export const ALL_NOTES: VoiceNote[] = [...MORNING_NOTES, ...MOMENT_NOTES, ...CHARM_NOTES];

export function noteById(id: string): VoiceNote | undefined {
  return ALL_NOTES.find((n) => n.id === id);
}

export function registerAllClips(): void {
  registerClips(ALL_NOTES);
}
