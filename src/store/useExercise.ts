import { create } from "zustand";

export interface Exercise {
  id: string;
  name: string;
  series: number;
  repetitions: number;
  weight: number;
  restTime: number;
  muscleGroups: string[];
  description: string;
  observations: string;
  videoUrl?: string;
  imageUrl?: string;
  currentRepetition: number;
}

interface ExerciseState {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise) => void;
  updateCurrentRepetition: (repetition: number) => void;
  completeRepetition: () => void;
  clearSelectedExercise: () => void;
}

export const useExercise = create<ExerciseState>((set, get) => ({
  selectedExercise: null,

  setSelectedExercise: (exercise: Exercise) => {
    set({ selectedExercise: exercise });
  },

  updateCurrentRepetition: (repetition: number) => {
    const { selectedExercise } = get();
    if (selectedExercise) {
      set({
        selectedExercise: {
          ...selectedExercise,
          currentRepetition: repetition,
        },
      });
    }
  },

  completeRepetition: () => {
    const { selectedExercise } = get();
    if (
      selectedExercise &&
      selectedExercise.currentRepetition < selectedExercise.series
    ) {
      set({
        selectedExercise: {
          ...selectedExercise,
          currentRepetition: selectedExercise.currentRepetition + 1,
        },
      });
    }
  },

  clearSelectedExercise: () => {
    set({ selectedExercise: null });
  },
}));
