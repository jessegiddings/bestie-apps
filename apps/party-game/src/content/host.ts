import { registerClips, type Clip } from '@bestie/core';
import type { GameId, Rng } from '@/game/night';
import { pick } from '@/game/night';

/**
 * Everything she says as host. Drafts for her to rewrite in her own words; the recording sheet is
 * docs/party-game-host-script.md. To add a recording, drop `<id>.m4a` in assets/voice/ and set
 * `asset: require('../../assets/voice/<id>.m4a')` on the entry. Player names are never spoken,
 * so lines say "you" while the screen shows the name.
 */
const line = (id: string, text: string, priority: Clip['priority'] = 2): Clip => ({ id, text, asset: null, priority });

export const OPENERS = [
  line('open-1', 'Okay, phones down. Except this one. I’m your host tonight: five games, one crown, and I am not above playing favourites.'),
  line('open-2', 'Welcome, welcome! Find a comfy seat and somebody you trust a little less than everyone else. Let’s play.'),
  line('open-3', 'Hi, hello, it’s game night and I’m in charge. Five rounds, the last one counts double, and the winner gets crowned by me personally.'),
];

export const GAME_INTROS: Record<GameId, Clip[]> = {
  'point-blank': [
    line('intro-point-blank-1', 'Point Blank! I read it, I count to three, you point. No hesitating, and no pointing at yourself to be polite.'),
    line('intro-point-blank-2', 'Time to find out what your friends really think of you. Fingers ready.'),
  ],
  'odd-one-out': [
    line('intro-odd-one-out-1', 'Odd One Out. Everyone gets the secret word, except one of you. Act natural. Especially you.'),
    line('intro-odd-one-out-2', 'One of you is bluffing this round. Clues short, eyes open, trust nobody.'),
  ],
  'bestie-test': [
    line('intro-bestie-test-1', 'The Bestie Test. One of you is in the hot seat, and the rest of you are about to prove how well you actually know them.'),
    line('intro-bestie-test-2', 'Hot seat time. If you get this wrong, I hope you have a good apology ready.'),
  ],
  'real-or-made-up': [
    line('intro-real-or-made-up-1', 'Real or Made Up. Tell us a story. Maybe it happened, maybe it didn’t. Sell it.'),
    line('intro-real-or-made-up-2', 'Storytime! The best liar in the room is about to get very rich. In points.'),
  ],
  'last-word': [
    line('intro-last-word-1', 'Last Word. Name one thing, pass the phone, fast. When I yell, whoever’s holding me loses.'),
    line('intro-last-word-2', 'Hot potato, but the potato is me. Don’t be the one holding me when time’s up.'),
  ],
};

export const COUNTDOWN = line('countdown', 'Three… two… one… point!', 3);

export const TIME_UP = [
  line('time-1', 'Ooh, time! Whoever’s holding me: I’m sorry, I love you, you lose.', 3),
  line('time-2', 'Stop! Hands up, phone down. We have a loser.', 3),
  line('time-3', 'And that’s time! Don’t look at me like that.', 3),
];

export const SCORE_LINES: Record<'leader' | 'comeback' | 'tie', Clip[]> = {
  leader: [
    line('score-leader-1', 'Still on top. Somebody, anybody, please catch up.'),
    line('score-leader-2', 'Our leader is getting comfortable. I don’t love that for them.'),
    line('score-leader-3', 'Same name at the top. Impressive. A little annoying, but impressive.'),
  ],
  comeback: [
    line('score-comeback-1', 'Look who’s sneaking up the board. I see you.'),
    line('score-comeback-2', 'New leader! The drama! This is why we play.'),
    line('score-comeback-3', 'Plot twist at the top. Nobody get too comfortable.'),
  ],
  tie: [
    line('score-tie-1', 'It’s a tie at the top. Oh, this is getting good.'),
    line('score-tie-2', 'Dead even. I could not have written this better.'),
    line('score-tie-3', 'Tied! Somebody’s friendship is about to be tested.'),
  ],
};

export const FINAL_ROUND = [
  line('final-1', 'Last round, and it’s worth double. If you’re losing, this is your redemption arc.'),
  line('final-2', 'Final game, double points. Everything can still change. Everything.'),
];

export const TIEBREAK = [
  line('tiebreak-1', 'A tie? Absolutely not. One question, sudden death.'),
  line('tiebreak-2', 'We need one winner, so everyone else decides. Point at who deserves my crown.'),
];

export const CROWNS = [
  line('crown-1', 'Tonight’s Bestie of the Night is… you! Stand up, take a bow. You’re insufferable now, and that’s fine.', 3),
  line('crown-2', 'We have a winner! Put the crown on, do a little wave. You earned it.', 3),
  line('crown-3', 'And the crown goes to… you! I always knew. I didn’t, but I’m saying I did.', 3),
];

export const CLOSERS = [
  line('close-1', 'That’s the night! Same time next week? I’ll bring snacks. I won’t.'),
  line('close-2', 'Thank you for having me. Be nice to the loser. Okay, a little nice.'),
];

export function registerHostClips(): void {
  registerClips([
    ...OPENERS,
    ...Object.values(GAME_INTROS).flat(),
    COUNTDOWN,
    ...TIME_UP,
    ...Object.values(SCORE_LINES).flat(),
    ...FINAL_ROUND,
    ...TIEBREAK,
    ...CROWNS,
    ...CLOSERS,
  ]);
}

export function choose(list: readonly Clip[], rng?: Rng): Clip {
  return pick(list, rng);
}

export function allHostLines(): Clip[] {
  return [...OPENERS, ...Object.values(GAME_INTROS).flat(), COUNTDOWN, ...TIME_UP, ...Object.values(SCORE_LINES).flat(), ...FINAL_ROUND, ...TIEBREAK, ...CROWNS, ...CLOSERS];
}
