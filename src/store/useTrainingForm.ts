import { create } from "zustand";

interface WeekDay {
  id: number;
  name: string;
  isSelected: boolean;
}

interface TrainingFormState {
  trainingName: string;
  selectedDays: WeekDay[];
  setTrainingName: (name: string) => void;
  setSelectedDays: (days: WeekDay[]) => void;
  toggleDay: (dayId: number) => void;
  clearForm: () => void;
}

const initialWeekDays: WeekDay[] = [
  { id: 1, name: "Seg", isSelected: false },
  { id: 2, name: "Ter", isSelected: false },
  { id: 3, name: "Qua", isSelected: false },
  { id: 4, name: "Qui", isSelected: false },
  { id: 5, name: "Sex", isSelected: false },
  { id: 6, name: "Sáb", isSelected: false },
  { id: 7, name: "Dom", isSelected: false },
];

export const useTrainingForm = create<TrainingFormState>((set) => ({
  trainingName: "",
  selectedDays: initialWeekDays,

  setTrainingName: (name: string) => {
    set({ trainingName: name });
  },

  setSelectedDays: (days: WeekDay[]) => {
    set({ selectedDays: days });
  },

  toggleDay: (dayId: number) => {
    set((state) => ({
      selectedDays: state.selectedDays.map((day) =>
        day.id === dayId ? { ...day, isSelected: !day.isSelected } : day
      ),
    }));
  },

  clearForm: () => {
    set({
      trainingName: "",
      selectedDays: initialWeekDays,
    });
  },
}));
