export namespace NTrainingPage {
  export interface Exercise {
    id: number;
    name: string;
    muscles_worked: string[];
    equipment: string;
    description: string;
  }

  export interface TrainingExercise {
    exercise: Exercise;
    sets: number;
    repetitions: number;
    load: number;
    rest: number;
    notes: string;
  }

  export interface Training {
    name: string;
    exercises: TrainingExercise[];
    week_days: number[];
  }

  export interface WeekDay {
    id: number;
    name: string;
    shortName: string;
    isActive: boolean;
  }

  export interface UseTrainingReturn {
    weekDays: WeekDay[];
    selectedDay: number;
    trainings: Training[];
    isLoading: boolean;
    handleDaySelect: (dayId: number) => void;
    handleTrainingPress: (training: Training) => void;
  }
}
