import { cardsFor, DECKS, toYou } from '@/content/decks';
import { allHostLines, GAME_INTROS } from '@/content/host';
import {
  afterScoreboard,
  beginRound,
  breakTie,
  drawCard,
  finishTurn,
  fuseSeconds,
  leaderIds,
  multiplier,
  NIGHT_ORDER,
  openNight,
  scoreBestieTest,
  scoreLastWord,
  scoreMood,
  scoreOddOneOut,
  scorePointBlank,
  scoreRealOrMadeUp,
  standings,
  startNight,
  turnPlayer,
  turnsFor,
  type Night,
  type Player,
} from './night';

const players: Player[] = ['Ana', 'Ben', 'Cleo', 'Dev'].map((name, i) => ({ id: `p${i}`, name }));

/** Plays every turn of the current round with the same awards. */
function playRound(n: Night, awards: Record<string, number> = {}): Night {
  let s = beginRound(n);
  while (s.phase === 'turn') s = finishTurn(s, awards);
  return s;
}

describe('a full night', () => {
  it('runs five rounds in order and crowns a single winner', () => {
    let n = openNight(startNight(players, 'family'));
    expect(n.phase).toBe('round-intro');
    const played: string[] = [];
    for (let r = 0; r < NIGHT_ORDER.length; r++) {
      played.push(n.rounds[n.roundIndex]);
      n = playRound(n, { p2: 1 });
      expect(n.phase).toBe('scoreboard');
      n = afterScoreboard(n);
    }
    expect(played).toEqual([...NIGHT_ORDER]);
    expect(n.phase).toBe('crowned');
    expect(n.winnerId).toBe('p2');
  });

  it('doubles points in the final round only', () => {
    let n = openNight(startNight(players, 'family'));
    expect(multiplier(n)).toBe(1);
    for (let r = 0; r < 4; r++) n = afterScoreboard(playRound(n));
    expect(multiplier(n)).toBe(2);
    n = finishTurn(beginRound(n), { p0: 1 });
    expect(n.scores.p0).toBe(2);
  });

  it('needs at least three players', () => {
    expect(() => startNight(players.slice(0, 2), 'family')).toThrow();
  });

  it('goes to sudden death on a tie and only crowns a tied player', () => {
    let n = openNight(startNight(players, 'family'));
    for (let r = 0; r < 5; r++) n = afterScoreboard(playRound(n, r === 0 ? { p0: 1, p1: 1 } : {}));
    expect(n.phase).toBe('tiebreak');
    expect(() => breakTie(n, 'p3')).toThrow();
    n = breakTie(n, 'p1');
    expect(n.phase).toBe('crowned');
    expect(n.winnerId).toBe('p1');
  });

  it('rotates who goes first each round', () => {
    const n = beginRound(openNight(startNight(players, 'family')));
    expect(turnPlayer(n).id).toBe('p0');
    expect(turnPlayer({ ...n, roundIndex: 1 }).id).toBe('p1');
    expect(turnPlayer({ ...n, roundIndex: 3, turnIndex: 2 }).id).toBe('p1');
  });

  it('ignores awards for unknown players', () => {
    const n = finishTurn(beginRound(openNight(startNight(players, 'family'))), { ghost: 5, p1: 1 });
    expect(n.scores).toEqual({ p0: 0, p1: 1, p2: 0, p3: 0 });
  });
});

describe('a single game', () => {
  it('repeats the same game until the group finishes', () => {
    let n = startNight(players, 'family', 'last-word');
    expect(n.phase).toBe('round-intro');
    n = afterScoreboard(playRound(n, { p3: 1 }), 'again');
    expect(n.rounds).toEqual(['last-word', 'last-word']);
    expect(n.phase).toBe('round-intro');
    expect(multiplier(n)).toBe(1);
    n = afterScoreboard(playRound(n), 'finish');
    expect(n.phase).toBe('crowned');
    expect(n.winnerId).toBe('p3');
  });
});

describe('turns per round', () => {
  it('keeps rounds short with big groups', () => {
    expect(turnsFor('bestie-test', 10)).toBe(4);
    expect(turnsFor('bestie-test', 3)).toBe(3);
    expect(turnsFor('odd-one-out', 10)).toBe(2);
  });
});

describe('scoring', () => {
  it('Point Blank: the story earns the point, a pass earns nothing', () => {
    expect(scorePointBlank('p1', true)).toEqual({ p1: 1 });
    expect(scorePointBlank('p1', false)).toEqual({});
    expect(scorePointBlank(null, true)).toEqual({});
  });
  it('Odd One Out: caught pays the table, escaping pays the Odd One', () => {
    expect(scoreOddOneOut(players, 'p2', true, true)).toEqual({ p0: 1, p1: 1, p3: 1 });
    expect(scoreOddOneOut(players, 'p2', false, false)).toEqual({ p2: 2 });
    expect(scoreOddOneOut(players, 'p2', false, true)).toEqual({ p2: 3 });
  });
  it('Bestie Test: a match pays everyone', () => {
    expect(scoreBestieTest(players, true)).toEqual({ p0: 1, p1: 1, p2: 1, p3: 1 });
    expect(scoreBestieTest(players, false)).toEqual({});
  });
  it('Real or Made Up: fooling pays 2, getting caught pays the table', () => {
    expect(scoreRealOrMadeUp(players, 'p0', true)).toEqual({ p0: 2 });
    expect(scoreRealOrMadeUp(players, 'p0', false)).toEqual({ p1: 1, p2: 1, p3: 1 });
  });
  it('Last Word: everyone but the holder scores', () => {
    expect(scoreLastWord(players, 'p3')).toEqual({ p0: 1, p1: 1, p2: 1 });
  });
});

describe('scoreboard', () => {
  it('shares places on ties and shows points gained this round', () => {
    let n = beginRound(openNight(startNight(players, 'family')));
    n = finishTurn(n, { p0: 2, p1: 2, p2: 1 });
    const rows = standings(n);
    expect(rows.map((r) => [r.player.name, r.place, r.gained])).toEqual([
      ['Ana', 1, 2],
      ['Ben', 1, 2],
      ['Cleo', 3, 1],
      ['Dev', 4, 0],
    ]);
    expect(leaderIds(n.scores)).toEqual(['p0', 'p1']);
    expect(scoreMood(n)).toBe('tie');
  });
  it('spots a new leader as a comeback', () => {
    const base = startNight(players, 'family');
    const n: Night = { ...base, roundStartScores: { p0: 3, p1: 0, p2: 0, p3: 0 }, scores: { p0: 3, p1: 4, p2: 0, p3: 0 } };
    expect(scoreMood(n)).toBe('comeback');
    expect(scoreMood({ ...n, roundStartScores: { p0: 0, p1: 2, p2: 0, p3: 0 } })).toBe('leader');
  });
});

describe('cards', () => {
  it('draws unseen cards first and reshuffles when a deck runs out', () => {
    const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(drawCard(cards, ['a', 'b']).card.id).toBe('c');
    expect(drawCard(cards, ['a', 'b', 'c']).reshuffled).toBe(true);
  });
  it('has enough unique cards in every game and deck', () => {
    for (const d of DECKS) {
      for (const g of NIGHT_ORDER) {
        const cards = cardsFor(g, d.id);
        expect(cards.length).toBeGreaterThanOrEqual(10);
        expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
      }
    }
  });
  it('turns a Bestie Test question to the hot seat', () => {
    expect(toYou('What do they do when they’re upset?')).toBe('What do you do when you’re upset?');
    expect(toYou('Their perfect Sunday?')).toBe('Your perfect Sunday?');
    expect(toYou('At a party they are…')).toBe('At a party you are…');
  });
  it('keeps the hidden fuse between 10 and 25 seconds', () => {
    expect(fuseSeconds(() => 0)).toBe(10);
    expect(fuseSeconds(() => 0.9999)).toBe(25);
  });
});

describe('host lines', () => {
  it('has unique ids, two intros per game, and nothing from the show', () => {
    const lines = allHostLines();
    expect(new Set(lines.map((l) => l.id)).size).toBe(lines.length);
    for (const g of NIGHT_ORDER) expect(GAME_INTROS[g]).toHaveLength(2);
    const banned = /new girl|true american|\bloft\b|\bjess\b|schmidt|\bnick\b|winston|\bcece\b|douchebag jar/i;
    for (const l of lines) expect(l.text).not.toMatch(banned);
  });
});
