import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { addDays, type LocalDate } from '@bestie/core';

/**
 * Buddy pairing: two people share a pact code and see each other's dry days. Each phone signs in
 * anonymously, so no email or password is needed. Without Supabase keys the app says pairing
 * isn't set up yet rather than pretending to pair. Schema: `supabase/schema.sql`.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const buddyConfigured = Boolean(url && anon);

let client: SupabaseClient | null = null;

async function db(): Promise<SupabaseClient> {
  if (!buddyConfigured) throw new Error('not_configured');
  if (!client) client = createClient(url!, anon!, { auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
  const { data } = await client.auth.getSession();
  if (!data.session) {
    const { error } = await client.auth.signInAnonymously();
    if (error) throw error;
  }
  return client;
}

/** Six letters and digits, skipping ones that are easy to misread (0/O, 1/I). */
export function makeCode(random: () => number = Math.random): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => alphabet[Math.floor(random() * alphabet.length)]).join('');
}

export async function createPact(myName: string): Promise<string> {
  const supa = await db();
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = makeCode();
    const { error } = await supa.from('pacts').insert({ code, owner_name: myName });
    if (!error) return code;
    if (!String(error.message).includes('duplicate')) throw error;
  }
  throw new Error('Could not make a code, try again');
}

export async function joinPact(code: string, myName: string): Promise<string> {
  const supa = await db();
  const { data, error } = await supa.rpc('join_pact', { p_code: code.trim().toUpperCase(), p_name: myName });
  if (error) throw new Error(error.message.includes('pact_not_available') ? 'That code is not available. Check it with your buddy.' : error.message);
  return String(data);
}

export async function shareDay(code: string, date: LocalDate, mark: 'kept' | 'missed'): Promise<void> {
  const supa = await db();
  const { data } = await supa.auth.getUser();
  const { error } = await supa.from('pact_days').upsert({ pact_code: code, user_id: data.user?.id, date, mark, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export interface BuddyStatus {
  name: string | null;
  dryDays: number;
  today: 'kept' | 'missed' | null;
  lastFourteen: { date: LocalDate; mark: 'kept' | 'missed' | null }[];
}

export async function buddyStatus(code: string, today: LocalDate): Promise<BuddyStatus> {
  const supa = await db();
  const me = (await supa.auth.getUser()).data.user?.id;
  const { data: pact, error: pactErr } = await supa.from('pacts').select('owner, owner_name, partner, partner_name').eq('code', code).single();
  if (pactErr) throw pactErr;
  const partnerId = pact.owner === me ? pact.partner : pact.owner;
  const name = pact.owner === me ? pact.partner_name : pact.owner_name;
  if (!partnerId) return { name: null, dryDays: 0, today: null, lastFourteen: [] };
  const { data: rows, error } = await supa.from('pact_days').select('date, mark').eq('pact_code', code).eq('user_id', partnerId);
  if (error) throw error;
  const byDate = new Map((rows ?? []).map((r) => [String(r.date), r.mark as 'kept' | 'missed']));
  const lastFourteen = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i - 13);
    return { date, mark: byDate.get(date) ?? null };
  });
  return { name, dryDays: [...byDate.values()].filter((m) => m === 'kept').length, today: byDate.get(today) ?? null, lastFourteen };
}
