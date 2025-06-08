import { create } from "zustand";

export interface SelectedExercise {
  id: string;
  name: string;
  category: string;
  image?: string;
}

interface SelectedExerciseState {
  selectedExercise: SelectedExercise | null;
  setSelectedExercise: (exercise: SelectedExercise) => void;
  clearSelectedExercise: () => void;
}

export const useSelectedExercise = create<SelectedExerciseState>((set) => ({
  selectedExercise: null,

  setSelectedExercise: (exercise: SelectedExercise) => {
    set({ selectedExercise: exercise });
  },

  clearSelectedExercise: () => {
    set({ selectedExercise: null });
  },
}));
