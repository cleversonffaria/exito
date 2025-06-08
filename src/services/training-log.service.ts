import type {
  LogExerciseData,
  ProgressData,
  TrainingLogResponse,
} from "@/interfaces";
import type { Database } from "@/types/database.types";
import { supabase } from "./supabase";

type TrainingLogInsert =
  Database["public"]["Tables"]["training_logs"]["Insert"];
type TrainingLogUpdate =
  Database["public"]["Tables"]["training_logs"]["Update"];

class TrainingLogService {
  async logExercise(logData: LogExerciseData): Promise<TrainingLogResponse> {
    try {
      const logInsert: TrainingLogInsert = {
        student_training_id: logData.studentTrainingId,
        exercise_id: logData.exerciseId,
        sets_completed: logData.setsCompleted,
        reps_completed: logData.repsCompleted,
        weight_used: logData.weightUsed,
        duration: logData.duration,
        notes: logData.notes,
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("training_logs")
        .insert(logInsert)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainingLog: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getStudentLogs(
    studentId: string,
    exerciseId?: string,
    limit?: number
  ): Promise<TrainingLogResponse> {
    try {
      let query = supabase
        .from("training_logs")
        .select(
          `
          *,
          exercises (
            id,
            name,
            muscle_groups
          ),
          student_trainings (
            id,
            trainings (
              id,
              name
            )
          )
        `
        )
        .eq("student_trainings.student_id", studentId);

      if (exerciseId) {
        query = query.eq("exercise_id", exerciseId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query.order("completed_at", {
        ascending: false,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainingLogs: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getLogsByTraining(
    studentTrainingId: string,
    date?: string
  ): Promise<TrainingLogResponse> {
    try {
      let query = supabase
        .from("training_logs")
        .select(
          `
          *,
          exercises (
            id,
            name,
            muscle_groups
          )
        `
        )
        .eq("student_training_id", studentTrainingId);

      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte("completed_at", startOfDay.toISOString())
          .lte("completed_at", endOfDay.toISOString());
      }

      const { data, error } = await query.order("completed_at", {
        ascending: false,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainingLogs: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async updateLog(
    id: string,
    updates: TrainingLogUpdate
  ): Promise<TrainingLogResponse> {
    try {
      const { data, error } = await supabase
        .from("training_logs")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainingLog: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async deleteLog(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("training_logs")
        .delete()
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getProgressData(
    studentId: string,
    exerciseId: string,
    days: number = 30
  ): Promise<{ success: boolean; error?: string; progress?: ProgressData }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: logs, error } = await supabase
        .from("training_logs")
        .select(
          `
          completed_at,
          weight_used,
          reps_completed,
          sets_completed,
          exercises (
            id,
            name
          ),
          student_trainings!inner (
            student_id
          )
        `
        )
        .eq("exercise_id", exerciseId)
        .eq("student_trainings.student_id", studentId)
        .gte("completed_at", startDate.toISOString())
        .order("completed_at", { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      if (logs.length === 0) {
        return { success: false, error: "Nenhum progresso encontrado" };
      }

      const progress: ProgressData = {
        exerciseId,
        exerciseName: (logs[0].exercises as any)?.name || "Exercício",
        logs: logs.map((log) => ({
          date: log.completed_at,
          weight: log.weight_used,
          reps: log.reps_completed,
          sets: log.sets_completed,
        })),
      };

      return { success: true, progress };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getWorkoutSummary(
    studentTrainingId: string,
    date: string
  ): Promise<{
    success: boolean;
    error?: string;
    summary?: {
      totalExercises: number;
      totalSets: number;
      totalDuration: number;
      exercises: {
        exerciseId: string;
        exerciseName: string;
        sets: number;
        avgWeight: number | null;
        avgReps: number | null;
      }[];
    };
  }> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("training_logs")
        .select(
          `
          exercise_id,
          sets_completed,
          reps_completed,
          weight_used,
          duration,
          exercises (
            id,
            name
          )
        `
        )
        .eq("student_training_id", studentTrainingId)
        .gte("completed_at", startOfDay.toISOString())
        .lte("completed_at", endOfDay.toISOString());

      if (error) {
        return { success: false, error: error.message };
      }

      const exerciseGroups = data.reduce((acc, log) => {
        const key = log.exercise_id;
        if (!acc[key]) {
          acc[key] = {
            exerciseId: key,
            exerciseName: (log.exercises as any)?.name || "Exercício",
            logs: [],
          };
        }
        acc[key].logs.push(log);
        return acc;
      }, {} as Record<string, { exerciseId: string; exerciseName: string; logs: any[] }>);

      const exercises = Object.values(exerciseGroups).map((group) => ({
        exerciseId: group.exerciseId,
        exerciseName: group.exerciseName,
        sets: group.logs.reduce((sum, log) => sum + log.sets_completed, 0),
        avgWeight:
          group.logs.filter((log) => log.weight_used).length > 0
            ? group.logs.reduce((sum, log) => sum + (log.weight_used || 0), 0) /
              group.logs.filter((log) => log.weight_used).length
            : null,
        avgReps:
          group.logs.filter((log) => log.reps_completed).length > 0
            ? group.logs.reduce(
                (sum, log) => sum + (log.reps_completed || 0),
                0
              ) / group.logs.filter((log) => log.reps_completed).length
            : null,
      }));

      const summary = {
        totalExercises: exercises.length,
        totalSets: exercises.reduce((sum, ex) => sum + ex.sets, 0),
        totalDuration: data.reduce((sum, log) => sum + (log.duration || 0), 0),
        exercises,
      };

      return { success: true, summary };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }
}

export const trainingLogService = new TrainingLogService();
