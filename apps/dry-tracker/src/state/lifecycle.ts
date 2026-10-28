import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { today, useDry } from './store';

/** Re-evaluate after midnight, timezone changes, and a return from the background. */
export function useToday() {
  const [date, setDate] = useState(today);
  useEffect(() => {
    const refresh = () => setDate(today());
    const timer = setInterval(refresh, 1000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    refresh();
    return () => { clearInterval(timer); sub.remove(); };
  }, []);
  return date;
}
export function useHydrated() {
  const [ready, setReady] = useState(useDry.persist.hasHydrated());
  useEffect(() => {
    const off = useDry.persist.onFinishHydration(() => setReady(true));
    setReady(useDry.persist.hasHydrated());
    return off;
  }, []);
  return ready;
}
