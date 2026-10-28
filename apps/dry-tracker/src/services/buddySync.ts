import { useEffect } from 'react';
import { AppState } from 'react-native';
import { create } from 'zustand';
import { useDry } from '@/state/store';
import { buddyConfigured, syncDays } from './buddy';
export const useSyncStatus = create<{ status: 'idle' | 'syncing' | 'saved' | 'error' }>(() => ({ status: 'idle' }));
export function useBuddySync(ready: boolean) {
  const code = useDry(s => s.pact?.code);
  const days = useDry(s => s.days);
  useEffect(() => {
    if (!ready || !code || !buddyConfigured) { useSyncStatus.setState({ status: 'idle' }); return; }
    let alive = true;
    let running = false;
    const sync = async () => {
      if (running || !alive) return;
      running = true;
      useSyncStatus.setState({ status: 'syncing' });
      try { await syncDays(code, days); if (alive) useSyncStatus.setState({ status: 'saved' }); }
      catch { if (alive) useSyncStatus.setState({ status: 'error' }); }
      finally { running = false; }
    };
    void sync();
    const timer = setInterval(() => { if (useSyncStatus.getState().status === 'error') void sync(); }, 30000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') void sync(); });
    return () => { alive = false; clearInterval(timer); sub.remove(); };
  }, [ready, code, days]);
}
