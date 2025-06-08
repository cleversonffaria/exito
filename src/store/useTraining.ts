import { create } from "zustand";

export interface Training {
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

interface TrainingState {
  selectedTraining: Training | null;
  setSelectedTraining: (training: Training) => void;
  updateCurrentRepetition: (repetition: number) => void;
  completeRepetition: () => void;
  clearSelectedTraining: () => void;
}

export const useTraining = create<TrainingState>((set, get) => ({
  selectedTraining: null,

  setSelectedTraining: (exercise: Training) => {
    set({ selectedTraining: exercise });
  },

  updateCurrentRepetition: (repetition: number) => {
    const { selectedTraining } = get();
    if (selectedTraining) {
      set({
        selectedTraining: {
          ...selectedTraining,
          currentRepetition: repetition,
        },
      });
    }
  },

  completeRepetition: () => {
    const { selectedTraining } = get();
    if (
      selectedTraining &&
      selectedTraining.currentRepetition < selectedTraining.series
    ) {
      set({
        selectedTraining: {
          ...selectedTraining,
          currentRepetition: selectedTraining.currentRepetition + 1,
        },
      });
    }
  },

  clearSelectedTraining: () => {
    set({ selectedTraining: null });
  },
}));
