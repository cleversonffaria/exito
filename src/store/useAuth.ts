import { create } from "zustand";

interface AuthState {
  isAuth: boolean;
  setAuth: (isAuthenticated: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuth: false,
  setAuth: (isAuthenticated: boolean) => set({ isAuth: isAuthenticated }),
}));
