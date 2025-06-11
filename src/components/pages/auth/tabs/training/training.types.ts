export namespace NTrainingPage {
  export interface Exercise {
    id: number;
    name: string;
    muscles_worked: string[];
    equipment: string;
    description: string;
    video_url?: string;
  }

  export interface TrainingExercise {
    id: string;
    exercise: Exercise;
    sets: number;
    repetitions: number;
    load: number;
    rest: number;
    notes: string;
    isCompleted?: boolean;
    completedSets?: number;
  }

  export interface Training {
    id: string;
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
