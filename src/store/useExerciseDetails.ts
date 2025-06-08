import { create } from "zustand";

export interface ExerciseDetails {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  description?: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface ExerciseDetailsState {
  selectedExercise: ExerciseDetails | null;
  setSelectedExercise: (exercise: ExerciseDetails) => void;
  clearSelectedExercise: () => void;
}

export const useExerciseDetails = create<ExerciseDetailsState>((set) => ({
  selectedExercise: null,

  setSelectedExercise: (exercise: ExerciseDetails) => {
    set({ selectedExercise: exercise });
  },

  clearSelectedExercise: () => {
    set({ selectedExercise: null });
  },
}));
