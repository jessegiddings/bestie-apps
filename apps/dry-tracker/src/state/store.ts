import { deviceStorage, evaluate, FREE, localDate, type Entitlement, type LocalDate } from '@bestie/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayEntry, Mood, Plan } from './stats';

export interface Pact {
  code: string;
  myName: string;
  buddyName: string | null;
  role: 'owner' | 'partner';
}

export interface DryState {
  plan: Plan | null;
  days: Record<LocalDate, DayEntry>;
  entitlement: Entitlement;
  pact: Pact | null;
  /** Check-in clip ids already heard, so Today can say "new tonight". */
  heard: string[];
  /** Badge ids the user has already seen celebrated. */
  celebrated: string[];
  lastCravingIndex: number | null;
  /** Times the craving button was ridden out ("I'm okay now"). */
  cravingsBeaten: number;
  /** Side quests finished, by day. */
  quests: Record<LocalDate, string>;

  setPlan: (plan: Plan) => void;
  updatePlan: (patch: Partial<Plan>) => void;
  logDay: (date: LocalDate, mark: DayEntry['mark'], extra?: { drinks?: number; mood?: Mood; note?: string }) => void;
  /** Adds mood or a note to a day already logged. */
  noteDay: (date: LocalDate, extra: { mood?: Mood; note?: string }) => void;
  clearDay: (date: LocalDate) => void;
  markHeard: (id: string) => void;
  markCelebrated: (ids: string[]) => void;
  setCravingIndex: (i: number) => void;
  beatCraving: () => void;
  toggleQuest: (date: LocalDate, questId: string) => void;
  setEntitlement: (e: Entitlement) => void;
  setPact: (p: Pact | null) => void;
  isPremium: () => boolean;
  reset: () => void;
}

const initial = {
  plan: null,
  days: {},
  entitlement: FREE,
  pact: null,
  heard: [],
  celebrated: [],
  lastCravingIndex: null,
  cravingsBeaten: 0,
  quests: {},
};

export const useDry = create<DryState>()(
  persist(
    (set, get) => ({
      ...initial,
      setPlan: (plan) => set({ plan }),
      updatePlan: (patch) => set((s) => (s.plan ? { plan: { ...s.plan, ...patch } } : s)),
      logDay: (date, mark, extra = {}) =>
        set((s) => {
          // Re-logging a day keeps the mood and note already written for it.
          const prev = s.days[date];
          const keep = prev ? { mood: prev.mood, note: prev.note } : {};
          return { days: { ...s.days, [date]: { ...keep, date, mark, ...extra, at: new Date().toISOString() } } };
        }),
      noteDay: (date, extra) => set((s) => (s.days[date] ? { days: { ...s.days, [date]: { ...s.days[date], ...extra } } } : s)),
      clearDay: (date) =>
        set((s) => {
          const days = { ...s.days };
          delete days[date];
          return { days };
        }),
      markHeard: (id) => set((s) => (s.heard.includes(id) ? s : { heard: [...s.heard, id] })),
      markCelebrated: (d) => set((s) => ({ celebrated: [...new Set([...s.celebrated, ...d])] })),
      setCravingIndex: (i) => set({ lastCravingIndex: i }),
      beatCraving: () => set((s) => ({ cravingsBeaten: s.cravingsBeaten + 1 })),
      toggleQuest: (date, questId) =>
        set((s) => {
          const quests = { ...s.quests };
          if (quests[date]) delete quests[date];
          else quests[date] = questId;
          return { quests };
        }),
      setEntitlement: (entitlement) => set({ entitlement }),
      setPact: (pact) => set({ pact }),
      isPremium: () => evaluate(get().entitlement, new Date().toISOString()).active,
      reset: () => set({ ...initial }),
    }),
    {
      name: 'dry-tracker-v1',
      version: 2,
      storage: deviceStorage,
      // v1 celebrated patch day counts as numbers; v2 uses badge ids and adds cravings and quests.
      migrate: (old, version) => {
        const s = (old ?? {}) as Partial<DryState> & { celebrated?: (number | string)[] };
        if (version < 2) {
          return { ...s, celebrated: (s.celebrated ?? []).map((c) => (typeof c === 'number' ? `day-${c}` : c)), cravingsBeaten: 0, quests: {} } as DryState;
        }
        return s as DryState;
      },
    },
  ),
);

export function today(): LocalDate {
  return localDate(new Date());
}
