const mockRpc = jest.fn();
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({
  auth: { getSession: async () => ({ data: { session: { user: { id: 'tester' } } } }) },
  rpc: (...args: unknown[]) => mockRpc(...args),
}) }));
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'public-test-key';
const { syncDays, leavePact } = require('./buddy') as typeof import('./buddy');

beforeEach(() => mockRpc.mockReset());
it('shares only day/date and sends an empty snapshot after clearing history', async () => {
  mockRpc.mockResolvedValue({ error: null });
  await syncDays('ABC234', { '2026-10-28': { date: '2026-10-28', mark: 'paused', note: 'private', mood: 'rough', at: 'now' } });
  expect(mockRpc).toHaveBeenCalledWith('sync_pact_days', { p_code: 'ABC234', p_days: [{ date: '2026-10-28', mark: 'paused' }] });
  await syncDays('ABC234', {});
  expect(mockRpc).toHaveBeenLastCalledWith('sync_pact_days', { p_code: 'ABC234', p_days: [] });
});
it('serializes a leave after pending sync and recovers after failed writes', async () => {
  let release!: (v: unknown) => void;
  mockRpc.mockImplementationOnce(() => new Promise(resolve => { release = resolve; })).mockResolvedValue({ error: null });
  const first = syncDays('ABC234', {});
  const leave = leavePact('ABC234');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(mockRpc).toHaveBeenCalledTimes(1);
  release({ error: new Error('offline') });
  await expect(first).rejects.toThrow('offline');
  await leave;
  expect(mockRpc).toHaveBeenLastCalledWith('leave_pact', { p_code: 'ABC234' });
});
