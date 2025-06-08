import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const secureStorage = {
  getItem: async (name: string) => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value || null;
    } catch (error) {
      console.error("Erro ao carregar dados do SecureStore:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("Erro ao salvar dados no SecureStore:", error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("Erro ao remover dados do SecureStore:", error);
    }
  },
};

interface AuthState {
  isAuth: boolean;
  setAuth: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      setAuth: (isAuthenticated: boolean) => set({ isAuth: isAuthenticated }),
      logout: () => set({ isAuth: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ isAuth: state.isAuth }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState;
      },
    }
  )
);
