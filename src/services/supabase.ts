import { createClient, processLock } from "@supabase/supabase-js";
import * as SecureStorage from "expo-secure-store";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStorage.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStorage.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStorage.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

export * from "@/types/database.types";
