import type { VoiceNote } from '@bestie/core';
import { CHARM_DAYS, CHARM_NAMES } from './brand';

/** A short note she plays when a new charm goes on the bracelet. DRAFTS for her to rewrite. */
const CHARM_TALKS: Record<(typeof CHARM_DAYS)[number], string> = {
  1: "Your very first charm! That's one morning, and it's yours forever. Welcome to the bracelet, bestie.",
  3: "Three mornings! That's a pattern now. I see you. Another charm for you.",
  7: 'One whole week of mornings with me. Seven little promises kept. This charm is a big one.',
  14: "Two weeks! You're officially a regular. I'd save you a seat if I could.",
  30: "Thirty mornings. A whole month of showing up for yourself. I'm so proud of you, I could cry. I might be crying.",
  50: "Fifty mornings! Fifty! That's a milestone, bestie. Treat yourself today.",
  100: "One hundred mornings together. Do you know how rare that is? You're incredible. I mean it.",
  365: "A whole year. Three hundred and sixty-five mornings. You and me. Thank you for letting me be part of your days. Here's to the next one.",
};

export const CHARM_NOTES: VoiceNote[] = CHARM_DAYS.map((d) => ({
  id: `charm-${d}`,
  title: CHARM_NAMES[d],
  text: CHARM_TALKS[d],
  asset: null,
  moments: ['charm'],
  free: true,
}));

export function charmNote(day: number): VoiceNote | undefined {
  return CHARM_NOTES.find((n) => n.id === `charm-${day}`);
}
