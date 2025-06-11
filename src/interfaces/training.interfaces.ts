import type {
  StudentTraining,
  Training,
  TrainingExercise,
} from "@/types/database.types";

export interface TrainingResponse {
  success: boolean;
  error?: string;
  training?: Training;
  trainings?: Training[];
}

export interface TrainingWithExercises extends Training {
  training_exercises: (TrainingExercise & {
    exercises: {
      id: string;
      name: string;
      muscle_groups: string[];
      equipment: string | null;
      difficulty: "beginner" | "intermediate" | "advanced";
    };
  })[];
}

export interface StudentTrainingResponse {
  success: boolean;
  error?: string;
  studentTraining?: StudentTraining;
  studentTrainings?: StudentTraining[];
}

export interface CreateTrainingData {
  name: string;
  description?: string;
  teacherId: string;
  exercises: {
    exerciseId: string;
    sets: number;
    repetitions?: number;
    load?: number;
    restSeconds?: number;
    orderIndex: number;
  }[];
}
