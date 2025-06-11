import type { Database, User } from "@/types/database.types";
import { supabase } from "./supabase";

type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

interface UserStatsResponse {
  success: boolean;
  error?: string;
  stats?: {
    totalStudents: number;
    totalExercises: number;
  };
}

interface StudentStatsResponse {
  success: boolean;
  error?: string;
  stats?: {
    totalTrainings: number;
    inProgress: number;
    completed: number;
  };
}

class UserService {
  async getTeacherStats(): Promise<UserStatsResponse> {
    try {
      const [studentsResponse, exercisesResponse] = await Promise.all([
        supabase
          .from("users")
          .select("id", { count: "exact" })
          .eq("role", "student")
          .is("deleted_at", null),
        supabase
          .from("exercises")
          .select("id", { count: "exact" })
          .is("deleted_at", null),
      ]);

      if (studentsResponse.error) {
        return { success: false, error: studentsResponse.error.message };
      }

      if (exercisesResponse.error) {
        return { success: false, error: exercisesResponse.error.message };
      }

      return {
        success: true,
        stats: {
          totalStudents: studentsResponse.count || 0,
          totalExercises: exercisesResponse.count || 0,
        },
      };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getStudentStats(studentId: string): Promise<StudentStatsResponse> {
    try {
      const allTrainingsResponse = await supabase
        .from("student_trainings")
        .select("id, week_days", { count: "exact" })
        .eq("student_id", studentId)
        .eq("is_active", true);

      if (allTrainingsResponse.error) {
        return { success: false, error: allTrainingsResponse.error.message };
      }

      const totalTrainings = allTrainingsResponse.count || 0;

      const today = new Date();
      const currentWeekDay = today.getDay() === 0 ? 7 : today.getDay();

      const todayTrainings =
        allTrainingsResponse.data?.filter((training) => {
          const weekDays = training.week_days || [];
          return weekDays.includes(currentWeekDay);
        }) || [];

      const inProgress = todayTrainings.length;

      const studentTrainingsIds = await supabase
        .from("student_trainings")
        .select("id")
        .eq("student_id", studentId)
        .eq("is_active", true);

      const trainingIds = studentTrainingsIds.data?.map((t) => t.id) || [];

      const logsResponse =
        trainingIds.length > 0
          ? await supabase
              .from("training_logs")
              .select("id", { count: "exact" })
              .in("student_training_id", trainingIds)
          : { count: 0, error: null };

      if (logsResponse.error) {
        return { success: false, error: logsResponse.error.message };
      }

      const completedLogs = logsResponse.count || 0;

      return {
        success: true,
        stats: {
          totalTrainings,
          inProgress,
          completed: completedLogs,
        },
      };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getAllStudents(includeDeleted: boolean = false): Promise<{
    success: boolean;
    error?: string;
    students?: User[];
  }> {
    try {
      let query = supabase.from("users").select("*").eq("role", "student");

      if (!includeDeleted) {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, students: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async updateUser(
    userId: string,
    updates: UserUpdate
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async deleteStudent(
    studentId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .eq("role", "student");

      if (error) {
        return { success: false, error: error.message };
      }

      await supabase
        .from("student_trainings")
        .update({ is_active: false })
        .eq("student_id", studentId);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async restoreStudent(
    studentId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .eq("role", "student");

      if (error) {
        return { success: false, error: error.message };
      }

      await supabase
        .from("student_trainings")
        .update({ is_active: true })
        .eq("student_id", studentId);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }
}

export const userService = new UserService();
