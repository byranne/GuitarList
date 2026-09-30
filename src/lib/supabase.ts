import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

import type { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env and fill them in.',
  );
}

// SecureStore warns above ~2KB per value and a Supabase session can exceed that,
// so values are split across numbered keys with a chunk count stored under the base key.
const CHUNK_SIZE = 1800;

const chunkedSecureStore: SupportedStorage = {
  async getItem(key) {
    const count = await SecureStore.getItemAsync(key);
    if (count === null) return null;
    const n = Number(count);
    if (!Number.isInteger(n)) return null;
    const parts = await Promise.all(
      Array.from({ length: n }, (_, i) => SecureStore.getItemAsync(`${key}.${i}`)),
    );
    if (parts.some((p) => p === null)) return null;
    return parts.join('');
  },
  async setItem(key, value) {
    await chunkedSecureStore.removeItem(key);
    const chunks = value.match(new RegExp(`[\\s\\S]{1,${CHUNK_SIZE}}`, 'g')) ?? [''];
    await Promise.all(chunks.map((c, i) => SecureStore.setItemAsync(`${key}.${i}`, c)));
    await SecureStore.setItemAsync(key, String(chunks.length));
  },
  async removeItem(key) {
    const count = Number(await SecureStore.getItemAsync(key));
    if (Number.isInteger(count) && count > 0) {
      await Promise.all(
        Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(`${key}.${i}`)),
      );
    }
    await SecureStore.deleteItemAsync(key);
  },
};

// Web: supabase-js falls back to localStorage when storage is undefined (and to
// in-memory during static rendering, where window doesn't exist).
const storage = Platform.OS === 'web' ? undefined : chunkedSecureStore;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Native apps don't get tab-visibility events, so pause token refresh while backgrounded.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
