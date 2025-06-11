import { create } from "zustand";

export interface TrainingExercise {
  id: string;
  exerciseId: string;
  name: string;
  category: string;
  series: number;
  repetitions: number;
  load: number;
  restTime: number;
  observations?: string;
  orderIndex: number;
}

interface TrainingExercisesState {
  exercises: TrainingExercise[];
  addExercise: (exercise: TrainingExercise) => void;
  removeExercise: (exerciseId: string) => void;
  updateExercise: (
    exerciseId: string,
    updates: Partial<TrainingExercise>
  ) => void;
  clearExercises: () => void;
}

export const useTrainingExercises = create<TrainingExercisesState>((set) => ({
  exercises: [],

  addExercise: (exercise: TrainingExercise) => {
    set((state) => ({
      exercises: [...state.exercises, exercise],
    }));
  },

  removeExercise: (exerciseId: string) => {
    set((state) => ({
      exercises: state.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  },

  updateExercise: (exerciseId: string, updates: Partial<TrainingExercise>) => {
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      ),
    }));
  },

  clearExercises: () => {
    set({ exercises: [] });
  },
}));
