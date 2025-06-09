import { create } from "zustand";

interface ActivationState {
  email: string;
  code: string;
  studentName: string;

  setEmail: (email: string) => void;
  setCode: (code: string) => void;
  setStudentName: (name: string) => void;
  reset: () => void;
}

export const useActivationStore = create<ActivationState>((set) => ({
  email: "",
  code: "",
  studentName: "",

  setEmail: (email) => set({ email }),
  setCode: (code) => set({ code }),
  setStudentName: (name) => set({ studentName: name }),
  reset: () => set({ email: "", code: "", studentName: "" }),
}));
