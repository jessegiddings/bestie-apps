import { deviceStorage, evaluate, FREE, type Entitlement } from "@bestie/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cardsFor, type AnyCard } from "@/content/decks";
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
  type SessionMode,
} from "@/game/night";

export interface PartyState {
  players: Player[];
  housePrompts: string[];
  addHousePrompt: (text: string) => boolean;
  removeHousePrompt: (text: string) => void;
  launch: (names: string[], game?: GameId, mode?: SessionMode) => void;
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
  quickStart: (count: number, single?: GameId) => void;
  openNight: () => void;
  beginRound: () => void;
  deal: () => AnyCard;
  finishTurn: (awards: Scores) => void;
  afterScoreboard: (choice?: "continue" | "again" | "finish") => void;
  breakTie: (winnerId: string) => void;
  endNight: () => void;
  setEntitlement: (e: Entitlement) => void;
  isVip: () => boolean;
}

export const useParty = create<PartyState>()(
  persist(
    (set, get) => ({
      players: [],
      housePrompts: [],
      addHousePrompt: (raw) => {
        const text = raw.replace(/\s+/g, " ").trim().slice(0, 140);
        if (
          !text ||
          get().housePrompts.length >= 40 ||
          get().housePrompts.some((x) => x.toLowerCase() === text.toLowerCase())
        )
          return false;
        set((s) => ({ housePrompts: [...s.housePrompts, text] }));
        return true;
      },
      removeHousePrompt: (text) =>
        set((s) => ({
          housePrompts: s.housePrompts.filter((x) => x !== text),
        })),
      launch: (names, game, mode) =>
        set((s) => {
          const players = names.map((name, i) => ({
            id: s.players[i]?.id ?? newPlayerId(),
            name: cleanName(name) || `Player ${i + 1}`,
          }));
          const deck = s.isVip() ? s.deck : "family";
          const night = startNight(players, deck, game, mode);
          return { players, deck, night: { ...night, phase: "round-intro" } };
        }),
      deck: "family",
      night: null,
      seen: {},
      entitlement: FREE,

      addPlayer: (raw) => {
        const name = cleanName(raw);
        const { players } = get();
        if (!name || players.length >= MAX_PLAYERS) return false;
        if (players.some((p) => p.name.toLowerCase() === name.toLowerCase()))
          return false;
        set({ players: [...players, { id: newPlayerId(), name }] });
        return true;
      },
      removePlayer: (id) =>
        set((s) => ({ players: s.players.filter((p) => p.id !== id) })),
      renamePlayer: (id, raw) => {
        const name = cleanName(raw);
        if (name)
          set((s) => ({
            players: s.players.map((p) => (p.id === id ? { ...p, name } : p)),
          }));
      },
      setDeck: (deck) => set({ deck }),
      quickStart: (count, single) =>
        set((s) => {
          const total = Math.max(3, Math.min(MAX_PLAYERS, Math.floor(count)));
          const players = Array.from(
            { length: total },
            (_, i) =>
              s.players[i] ?? { id: newPlayerId(), name: `Player ${i + 1}` },
          );
          const deck = s.isVip() ? s.deck : "family";
          const night = startNight(players, deck, single);
          return { players, deck, night: { ...night, phase: "round-intro" } };
        }),
      start: (single) =>
        set((s) => ({ night: startNight(s.players, s.deck, single) })),
      openNight: () =>
        set((s) => (s.night ? { night: openNight(s.night) } : s)),
      beginRound: () =>
        set((s) => (s.night ? { night: beginRound(s.night) } : s)),
      deal: () => {
        const { night, seen } = get();
        if (!night) throw new Error("No night in progress");
        const game = currentGame(night);
        const key = `${game}:${night.deck}`;
        const custom =
          game === "who-wrote-that"
            ? get().housePrompts.map((text, i) => ({
                id: `house-${i}-${text}`,
                text,
              }))
            : [];
        const freshCustom = custom.filter(
          (c) => !(seen[key] ?? []).includes(c.id),
        );
        const { card, reshuffled } = drawCard(
          freshCustom.length
            ? freshCustom
            : [...cardsFor(game, night.deck), ...custom],
          seen[key] ?? [],
        );
        const base = reshuffled ? [] : (seen[key] ?? []);
        set({ seen: { ...seen, [key]: [...base, card.id] } });
        return card;
      },
      finishTurn: (awards) =>
        set((s) => (s.night ? { night: finishTurn(s.night, awards) } : s)),
      afterScoreboard: (choice) =>
        set((s) => (s.night ? { night: afterScoreboard(s.night, choice) } : s)),
      breakTie: (winnerId) =>
        set((s) => (s.night ? { night: breakTie(s.night, winnerId) } : s)),
      endNight: () => set({ night: null }),
      setEntitlement: (entitlement) => set({ entitlement }),
      isVip: () => evaluate(get().entitlement, new Date().toISOString()).active,
    }),
    {
      name: "party-game-v1",
      version: 2,
      storage: deviceStorage,
      migrate: (state: any) => ({
        ...state,
        night: null,
        housePrompts: state.housePrompts ?? [],
      }),
    },
  ),
);
