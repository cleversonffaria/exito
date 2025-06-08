import type { Exercise } from "@/types/database.types";

export interface ExerciseResponse {
  success: boolean;
  error?: string;
  exercise?: Exercise;
  exercises?: Exercise[];
}

export interface ExerciseFilters {
  muscleGroups?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  equipment?: string;
  search?: string;
}
