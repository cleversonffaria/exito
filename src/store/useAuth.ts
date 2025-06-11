import { authService } from "@/services/auth.service";
import type { User } from "@/types/database.types";
import { secureStorage } from "@/utils/secure-store.utils";
import { supabase } from "@/services/supabase";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isAuth: boolean;
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: "student" | "teacher"
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  validateSupabaseSession: () => Promise<boolean>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuth: false,
      user: null,
      loading: false,

      signIn: async (email: string, password: string) => {
        set({ loading: true });

        const result = await authService.signIn(email, password);

        if (result.success && result.user) {
          set({ isAuth: true, user: result.user, loading: false });
        } else {
          set({ loading: false });
        }

        return result;
      },

      signUp: async (
        email: string,
        password: string,
        name: string,
        role = "student"
      ) => {
        set({ loading: true });

        const result = await authService.signUp({
          email,
          password,
          name,
          role,
        });

        set({ loading: false });
        return result;
      },

      signOut: async () => {
        set({ loading: true });

        const result = await authService.signOut();

        if (result.success) {
          set({
            isAuth: false,
            user: null,
            loading: false,
          });
        } else {
          set({ loading: false });
        }
      },

      checkSession: async () => {
        set({ loading: true });

        const result = await authService.getCurrentSession();

        if (result.success && result.user) {
          set({
            isAuth: true,
            user: result.user,
            loading: false,
          });
        } else {
          set({
            isAuth: false,
            user: null,
            loading: false,
          });
        }
      },

      validateSupabaseSession: async () => {
        try {
          const { data: sessionData, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Erro na validação de sessão:", error);
            return false;
          }

          const { isAuth, user } = get();

          if (
            isAuth &&
            user &&
            (!sessionData.session || !sessionData.session.user)
          ) {
            await get().signOut();
            return false;
          }

          return (
            sessionData.session !== null && sessionData.session.user !== null
          );
        } catch (error) {
          console.error("Erro na validação de sessão:", error);
          return true; // Em caso de erro, assumir que está válido para não quebrar o fluxo
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ isAuth: state.isAuth, user: state.user }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState;
      },
    }
  )
);
