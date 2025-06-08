import { anonKey, supUrl } from "@/constants/supabase";

import { createClient, processLock } from "@supabase/supabase-js";
import * as SecureStorage from "expo-secure-store";
import { AppState } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = supUrl;
const supabaseAnonKey = anonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
