import { deviceStorage, evaluate, FREE, type Entitlement } from '@bestie/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cardsFor, type AnyCard } from '@/content/decks';
import {
  afterScoreboard,
  beginRound,
  openNight,
  breakTie,
  cleanName,
  currentGame,
  drawCard,
  finishTurn,
  MAX_PLAYERS,
  newPlayerId,
  startNight,
  type DeckId,
  type GameId,
  type Night,
  type Player,
  type Scores,
} from '@/game/night';

export interface PartyState {
  players: Player[];
  deck: DeckId;
  night: Night | null;
  /** Card ids already played, per game and deck, so a group doesn't see repeats until a deck runs out. */
  seen: Record<string, string[]>;
  entitlement: Entitlement;

  addPlayer: (name: string) => boolean;
  removePlayer: (id: string) => void;
  renamePlayer: (id: string, name: string) => void;
  setDeck: (deck: DeckId) => void;
  start: (single?: GameId) => void;
  openNight: () => void;
  beginRound: () => void;
  deal: () => AnyCard;
  finishTurn: (awards: Scores) => void;
  afterScoreboard: (choice?: 'continue' | 'again' | 'finish') => void;
  breakTie: (winnerId: string) => void;
  endNight: () => void;
  setEntitlement: (e: Entitlement) => void;
  isVip: () => boolean;
}

export const useParty = create<PartyState>()(
  persist(
    (set, get) => ({
      players: [],
      deck: 'family',
      night: null,
      seen: {},
      entitlement: FREE,

      addPlayer: (raw) => {
        const name = cleanName(raw);
        const { players } = get();
        if (!name || players.length >= MAX_PLAYERS) return false;
        if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return false;
        set({ players: [...players, { id: newPlayerId(), name }] });
        return true;
      },
      removePlayer: (id) => set((s) => ({ players: s.players.filter((p) => p.id !== id) })),
      renamePlayer: (id, raw) => {
        const name = cleanName(raw);
        if (name) set((s) => ({ players: s.players.map((p) => (p.id === id ? { ...p, name } : p)) }));
      },
      setDeck: (deck) => set({ deck }),
      start: (single) => set((s) => ({ night: startNight(s.players, s.deck, single) })),
      openNight: () => set((s) => (s.night ? { night: openNight(s.night) } : s)),
      beginRound: () => set((s) => (s.night ? { night: beginRound(s.night) } : s)),
      deal: () => {
        const { night, seen } = get();
        if (!night) throw new Error('No night in progress');
        const game = currentGame(night);
        const key = `${game}:${night.deck}`;
        const { card, reshuffled } = drawCard(cardsFor(game, night.deck), seen[key] ?? []);
        const base = reshuffled ? [] : seen[key] ?? [];
        set({ seen: { ...seen, [key]: [...base, card.id] } });
        return card;
      },
      finishTurn: (awards) => set((s) => (s.night ? { night: finishTurn(s.night, awards) } : s)),
      afterScoreboard: (choice) => set((s) => (s.night ? { night: afterScoreboard(s.night, choice) } : s)),
      breakTie: (winnerId) => set((s) => (s.night ? { night: breakTie(s.night, winnerId) } : s)),
      endNight: () => set({ night: null }),
      setEntitlement: (entitlement) => set({ entitlement }),
      isVip: () => evaluate(get().entitlement, new Date().toISOString()).active,
    }),
    { name: 'party-game-v1', version: 1, storage: deviceStorage },
  ),
);
