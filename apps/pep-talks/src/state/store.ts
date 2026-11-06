import { deviceStorage, evaluate, FREE, localDate, type Entitlement, type LocalDate } from '@bestie/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FocusId } from '@/content/brand';

export interface Profile {
  /** The day she starts the morning notes for this person: their day 1. */
  startDate: LocalDate;
  focus: FocusId[];
  morningHour: number;
}

export interface PepState {
  profile: Profile | null;
  /** Days the morning note was played. Totals never go down. */
  listened: LocalDate[];
  /** Note ids heard, newest last; used to rotate moment talks. */
  heard: string[];
  saved: string[];
  /** Charm thresholds already celebrated. */
  celebrated: number[];
  entitlement: Entitlement;

  setProfile: (p: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  markListened: (date: LocalDate) => void;
  markHeard: (id: string) => void;
  toggleSaved: (id: string) => void;
  markCelebrated: (days: number[]) => void;
  setEntitlement: (e: Entitlement) => void;
  isPremium: () => boolean;
  reset: () => void;
}

const initial = {
  profile: null,
  listened: [],
  heard: [],
  saved: [],
  celebrated: [],
  entitlement: FREE,
};

/** Keep the heard list short; rotation only needs the recent past. */
const HEARD_MAX = 200;

export const usePep = create<PepState>()(
  persist(
    (set, get) => ({
      ...initial,
      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) => set((s) => (s.profile ? { profile: { ...s.profile, ...patch } } : s)),
      markListened: (date) => set((s) => (s.listened.includes(date) ? s : { listened: [...s.listened, date].sort() })),
      markHeard: (id) => set((s) => ({ heard: [...s.heard.filter((h) => h !== id), id].slice(-HEARD_MAX) })),
      toggleSaved: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
      markCelebrated: (d) => set((s) => ({ celebrated: [...new Set([...s.celebrated, ...d])] })),
      setEntitlement: (entitlement) => set({ entitlement }),
      isPremium: () => evaluate(get().entitlement, new Date().toISOString()).active,
      reset: () => set({ ...initial }),
    }),
    { name: 'pep-talks-v1', version: 1, storage: deviceStorage },
  ),
);

export function today(): LocalDate {
  return localDate(new Date());
}
