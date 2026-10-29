/**
 * The game night as plain data and pure functions, so the rules are tested without screens.
 * A night is five rounds (one per game); the last round counts double. A single-game session is
 * the same machine with one game repeated until the group taps "Finish".
 */
export type GameId = 'point-blank' | 'odd-one-out' | 'bestie-test' | 'real-or-made-up' | 'last-word';
export type DeckId = 'family' | 'friends';

export const NIGHT_ORDER: readonly GameId[] = ['point-blank', 'bestie-test', 'odd-one-out', 'real-or-made-up', 'last-word'];

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

export interface Player {
  id: string;
  name: string;
}

export type Scores = Record<string, number>;
export type Rng = () => number;

export type Phase = 'opening' | 'round-intro' | 'turn' | 'scoreboard' | 'tiebreak' | 'crowned';

export interface Night {
  kind: 'night' | 'single';
  deck: DeckId;
  players: Player[];
  /** Rounds still to play are `rounds.slice(roundIndex)`. */
  rounds: GameId[];
  roundIndex: number;
  turnIndex: number;
  scores: Scores;
  /** Scores when the current round began, for the scoreboard's "+N this round". */
  roundStartScores: Scores;
  phase: Phase;
  winnerId: string | null;
}

/** Turns per round: enough for everyone to feel in it, short enough for an 8 minute round. */
export function turnsFor(game: GameId, playerCount: number): number {
  switch (game) {
    case 'point-blank':
      return 4;
    case 'odd-one-out':
      return 2;
    case 'last-word':
      return 3;
    default:
      return Math.min(playerCount, 4);
  }
}

export function currentGame(n: Night): GameId {
  return n.rounds[n.roundIndex];
}

/** The final round of a full night is worth double. */
export function multiplier(n: Night): number {
  return n.kind === 'night' && n.roundIndex === n.rounds.length - 1 ? 2 : 1;
}

/** Whose turn it is. Each round starts one seat later so the same person never always goes first. */
export function turnPlayer(n: Night): Player {
  const i = (n.roundIndex + n.turnIndex) % n.players.length;
  return n.players[i];
}

export function startNight(players: Player[], deck: DeckId, single?: GameId): Night {
  if (players.length < MIN_PLAYERS) throw new Error(`Need at least ${MIN_PLAYERS} players`);
  const scores = Object.fromEntries(players.map((p) => [p.id, 0]));
  return {
    kind: single ? 'single' : 'night',
    deck,
    players,
    rounds: single ? [single] : [...NIGHT_ORDER],
    roundIndex: 0,
    turnIndex: 0,
    scores,
    roundStartScores: { ...scores },
    phase: single ? 'round-intro' : 'opening',
    winnerId: null,
  };
}

/** From the host's opener to the first game's intro. */
export function openNight(n: Night): Night {
  return n.phase === 'opening' ? { ...n, phase: 'round-intro' } : n;
}

export function beginRound(n: Night): Night {
  return { ...n, phase: 'turn', turnIndex: 0, roundStartScores: { ...n.scores } };
}

/** Awards are base points per player id; the round multiplier is applied here. */
export function finishTurn(n: Night, awards: Scores): Night {
  const mult = multiplier(n);
  const scores = { ...n.scores };
  for (const [id, pts] of Object.entries(awards)) {
    if (id in scores) scores[id] += pts * mult;
  }
  const turnIndex = n.turnIndex + 1;
  if (turnIndex >= turnsFor(currentGame(n), n.players.length)) return { ...n, scores, turnIndex, phase: 'scoreboard' };
  return { ...n, scores, turnIndex };
}

/** From the scoreboard: next round, another round of the same game (single mode), or the crown. */
export function afterScoreboard(n: Night, choice: 'continue' | 'again' | 'finish' = 'continue'): Night {
  if (n.kind === 'single' && choice === 'again') return { ...n, rounds: [...n.rounds, currentGame(n)], roundIndex: n.roundIndex + 1, turnIndex: 0, phase: 'round-intro' };
  const last = n.roundIndex >= n.rounds.length - 1;
  if (!last && choice !== 'finish') return { ...n, roundIndex: n.roundIndex + 1, turnIndex: 0, phase: 'round-intro' };
  const leaders = leaderIds(n.scores);
  if (leaders.length > 1) return { ...n, phase: 'tiebreak' };
  return { ...n, phase: 'crowned', winnerId: leaders[0] ?? null };
}

/** The tie-break is one sudden-death question; the group picks the winner among those tied. */
export function breakTie(n: Night, winnerId: string): Night {
  if (!leaderIds(n.scores).includes(winnerId)) throw new Error('Winner must be one of the tied players');
  return { ...n, phase: 'crowned', winnerId };
}

export function leaderIds(scores: Scores): string[] {
  const vals = Object.values(scores);
  if (vals.length === 0) return [];
  const top = Math.max(...vals);
  return Object.keys(scores).filter((id) => scores[id] === top);
}

export interface Standing {
  player: Player;
  score: number;
  /** 1-based; tied players share a place. */
  place: number;
  gained: number;
}

export function standings(n: Night): Standing[] {
  const rows = n.players
    .map((player) => ({ player, score: n.scores[player.id] ?? 0, gained: (n.scores[player.id] ?? 0) - (n.roundStartScores[player.id] ?? 0), place: 0 }))
    .sort((a, b) => b.score - a.score);
  rows.forEach((r, i) => {
    r.place = i > 0 && rows[i - 1].score === r.score ? rows[i - 1].place : i + 1;
  });
  return rows;
}

/** Which kind of host reaction fits this scoreboard. */
export function scoreMood(n: Night): 'tie' | 'comeback' | 'leader' {
  const now = leaderIds(n.scores);
  if (now.length > 1) return 'tie';
  const before = leaderIds(n.roundStartScores);
  if (before.length === 1 && before[0] === now[0]) return 'leader';
  return 'comeback';
}

// ---------- Scoring for each game (base points, before the multiplier) ----------

function everyoneBut(players: Player[], ...ids: string[]): Scores {
  return Object.fromEntries(players.filter((p) => !ids.includes(p.id)).map((p) => [p.id, 1]));
}

/** Point Blank: the most-pointed player scores 1 for telling the story; passing scores nothing. */
export function scorePointBlank(pointedId: string | null, told: boolean): Scores {
  return pointedId && told ? { [pointedId]: 1 } : {};
}

/** Odd One Out: caught means everyone else +1; escaping is +2, plus 1 for guessing the word. */
export function scoreOddOneOut(players: Player[], oddId: string, caught: boolean, guessedWord: boolean): Scores {
  if (caught) return everyoneBut(players, oddId);
  return { [oddId]: 2 + (guessedWord ? 1 : 0) };
}

/** Bestie Test: if the group guessed the hot seat's answer, the hot seat and every guesser score 1. */
export function scoreBestieTest(players: Player[], match: boolean): Scores {
  return match ? Object.fromEntries(players.map((p) => [p.id, 1])) : {};
}

/** Real or Made Up: fooling the group is worth 2; getting caught gives everyone else 1. */
export function scoreRealOrMadeUp(players: Player[], tellerId: string, fooled: boolean): Scores {
  return fooled ? { [tellerId]: 2 } : everyoneBut(players, tellerId);
}

/** Last Word: everyone except whoever held the phone when time ran out scores 1. */
export function scoreLastWord(players: Player[], holderId: string): Scores {
  return everyoneBut(players, holderId);
}

// ---------- Randomness helpers (injected rng for tests) ----------

export function pick<T>(list: readonly T[], rng: Rng = Math.random): T {
  return list[Math.floor(rng() * list.length) % list.length];
}

/** Draw a card id the group hasn't seen; once a deck is used up it reshuffles. */
export function drawCard<T extends { id: string }>(cards: readonly T[], seen: readonly string[], rng: Rng = Math.random): { card: T; reshuffled: boolean } {
  if (cards.length === 0) throw new Error('Empty deck');
  const fresh = cards.filter((c) => !seen.includes(c.id));
  if (fresh.length === 0) return { card: pick(cards, rng), reshuffled: true };
  return { card: pick(fresh, rng), reshuffled: false };
}

/** Last Word's hidden fuse: 10 to 25 seconds, so nobody can count it. */
export function fuseSeconds(rng: Rng = Math.random): number {
  return 10 + Math.floor(rng() * 16);
}

export function secretFor(rng: Rng = Math.random): 'truth' | 'made-up' {
  return rng() < 0.5 ? 'truth' : 'made-up';
}

export function newPlayerId(rng: Rng = Math.random): string {
  return `p${Math.floor(rng() * 36 ** 6).toString(36)}`;
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, 16);
}
