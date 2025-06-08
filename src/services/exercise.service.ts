import type { ExerciseFilters, ExerciseResponse } from "@/interfaces";
import type { Database } from "@/types/database.types";
import { supabase } from "./supabase";

type ExerciseInsert = Database["public"]["Tables"]["exercises"]["Insert"];
type ExerciseUpdate = Database["public"]["Tables"]["exercises"]["Update"];

class ExerciseService {
  async createExercise(
    exerciseData: ExerciseInsert
  ): Promise<ExerciseResponse> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .insert(exerciseData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, exercise: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getExercises(filters?: ExerciseFilters): Promise<ExerciseResponse> {
    try {
      let query = supabase.from("exercises").select("*").is("deleted_at", null);

      if (filters?.muscleGroups && filters.muscleGroups.length > 0) {
        query = query.overlaps("muscle_groups", filters.muscleGroups);
      }

      if (filters?.difficulty) {
        query = query.eq("difficulty", filters.difficulty);
      }

      if (filters?.equipment) {
        query = query.eq("equipment", filters.equipment);
      }

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order("name");

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, exercises: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getExerciseById(id: string): Promise<ExerciseResponse> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();

      if (error) {
        return { success: false, error: "Exercício não encontrado" };
      }

      return { success: true, exercise: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async updateExercise(
    id: string,
    updates: ExerciseUpdate
  ): Promise<ExerciseResponse> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, exercise: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async deleteExercise(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("exercises")
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .is("deleted_at", null);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getExercisesByMuscleGroup(
    muscleGroup: string
  ): Promise<ExerciseResponse> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .contains("muscle_groups", [muscleGroup])
        .is("deleted_at", null)
        .order("name");

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, exercises: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getAvailableMuscleGroups(): Promise<{
    success: boolean;
    error?: string;
    muscleGroups?: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("muscle_groups")
        .is("deleted_at", null);

      if (error) {
        return { success: false, error: error.message };
      }

      const allMuscleGroups = data
        .flatMap((exercise) => exercise.muscle_groups)
        .filter((group, index, arr) => arr.indexOf(group) === index)
        .sort();

      return { success: true, muscleGroups: allMuscleGroups };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getAvailableEquipments(): Promise<{
    success: boolean;
    error?: string;
    equipments?: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("equipment")
        .not("equipment", "is", null)
        .is("deleted_at", null);

      if (error) {
        return { success: false, error: error.message };
      }

      const equipments = data
        .map((exercise) => exercise.equipment)
        .filter(
          (equipment, index, arr) =>
            equipment && arr.indexOf(equipment) === index
        )
        .sort();

      return { success: true, equipments: equipments as string[] };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }
}

export const exerciseService = new ExerciseService();
