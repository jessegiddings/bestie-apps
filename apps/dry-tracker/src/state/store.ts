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
  /** Patch thresholds the user has already seen celebrated. */
  celebrated: number[];
  lastCravingIndex: number | null;

  setPlan: (plan: Plan) => void;
  updatePlan: (patch: Partial<Plan>) => void;
  logDay: (date: LocalDate, mark: DayEntry['mark'], extra?: { drinks?: number; mood?: Mood; note?: string }) => void;
  clearDay: (date: LocalDate) => void;
  markHeard: (id: string) => void;
  markCelebrated: (days: number[]) => void;
  setCravingIndex: (i: number) => void;
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
};

export const useDry = create<DryState>()(
  persist(
    (set, get) => ({
      ...initial,
      setPlan: (plan) => set({ plan }),
      updatePlan: (patch) => set((s) => (s.plan ? { plan: { ...s.plan, ...patch } } : s)),
      logDay: (date, mark, extra = {}) =>
        set((s) => ({ days: { ...s.days, [date]: { date, mark, ...extra, at: new Date().toISOString() } } })),
      clearDay: (date) =>
        set((s) => {
          const days = { ...s.days };
          delete days[date];
          return { days };
        }),
      markHeard: (id) => set((s) => (s.heard.includes(id) ? s : { heard: [...s.heard, id] })),
      markCelebrated: (d) => set((s) => ({ celebrated: [...new Set([...s.celebrated, ...d])] })),
      setCravingIndex: (i) => set({ lastCravingIndex: i }),
      setEntitlement: (entitlement) => set({ entitlement }),
      setPact: (pact) => set({ pact }),
      isPremium: () => evaluate(get().entitlement, new Date().toISOString()).active,
      reset: () => set({ ...initial }),
    }),
    { name: 'dry-tracker-v1', version: 1, storage: deviceStorage },
  ),
);

export function today(): LocalDate {
  return localDate(new Date());
}
