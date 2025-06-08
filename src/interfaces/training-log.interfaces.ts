import type { TrainingLog } from "@/types/database.types";

export interface TrainingLogResponse {
  success: boolean;
  error?: string;
  trainingLog?: TrainingLog;
  trainingLogs?: TrainingLog[];
}

export interface LogExerciseData {
  studentTrainingId: string;
  exerciseId: string;
  setsCompleted: number;
  repsCompleted?: number;
  weightUsed?: number;
  duration?: number;
  notes?: string;
}

export interface TrainingLogWithDetails extends TrainingLog {
  exercises: {
    id: string;
    name: string;
    muscle_groups: string[];
  };
  student_trainings: {
    id: string;
    trainings: {
      id: string;
      name: string;
    };
  };
}

export interface ProgressData {
  exerciseId: string;
  exerciseName: string;
  logs: {
    date: string;
    weight: number | null;
    reps: number | null;
    sets: number;
  }[];
}
