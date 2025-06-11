import type {
  CreateTrainingData,
  StudentTrainingResponse,
  TrainingResponse,
  TrainingWithExercises,
} from "@/interfaces";
import type { Database, TrainingExercise } from "@/types/database.types";
import { supabase } from "./supabase";

type TrainingInsert = Database["public"]["Tables"]["trainings"]["Insert"];
type TrainingUpdate = Database["public"]["Tables"]["trainings"]["Update"];
type TrainingExerciseInsert =
  Database["public"]["Tables"]["training_exercises"]["Insert"];
type TrainingExerciseUpdate =
  Database["public"]["Tables"]["training_exercises"]["Update"];
type StudentTrainingInsert =
  Database["public"]["Tables"]["student_trainings"]["Insert"];
type StudentTrainingUpdate =
  Database["public"]["Tables"]["student_trainings"]["Update"];

class TrainingService {
  async createTraining(
    trainingData: CreateTrainingData
  ): Promise<TrainingResponse> {
    try {
      const { data: training, error: trainingError } = await supabase
        .from("trainings")
        .insert({
          name: trainingData.name,
          description: trainingData.description,
          teacher_id: trainingData.teacherId,
        })
        .select()
        .single();

      if (trainingError) {
        return { success: false, error: trainingError.message };
      }

      if (trainingData.exercises.length > 0) {
        const exercisesToInsert: TrainingExerciseInsert[] =
          trainingData.exercises.map((exercise) => ({
            training_id: training.id,
            exercise_id: exercise.exerciseId,
            sets: exercise.sets,
            repetitions: exercise.repetitions,
            load: exercise.load,
            rest_seconds: exercise.restSeconds,
            order_index: exercise.orderIndex,
          }));

        const { error: exercisesError } = await supabase
          .from("training_exercises")
          .insert(exercisesToInsert);

        if (exercisesError) {
          await supabase.from("trainings").delete().eq("id", training.id);
          return {
            success: false,
            error: "Erro ao adicionar exercícios ao treino",
          };
        }
      }

      return { success: true, training };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getTrainingsByTeacher(teacherId: string): Promise<TrainingResponse> {
    try {
      const { data, error } = await supabase
        .from("trainings")
        .select("*")
        .eq("teacher_id", teacherId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainings: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getTrainingWithExercises(trainingId: string): Promise<{
    success: boolean;
    error?: string;
    training?: TrainingWithExercises;
  }> {
    try {
      const { data, error } = await supabase
        .from("trainings")
        .select(
          `
          *,
          training_exercises (
            *,
            exercises (
              id,
              name,
              muscle_groups,
              equipment,
              difficulty
            )
          )
        `
        )
        .eq("id", trainingId)
        .is("deleted_at", null)
        .single();

      if (error) {
        return { success: false, error: "Treino não encontrado" };
      }

      return { success: true, training: data as TrainingWithExercises };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async updateTraining(
    id: string,
    updates: TrainingUpdate
  ): Promise<TrainingResponse> {
    try {
      const { data, error } = await supabase
        .from("trainings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, training: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async deleteTraining(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("trainings")
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async assignTrainingToStudent(
    studentId: string,
    trainingId: string,
    weekDays: number[],
    startDate: string,
    endDate?: string
  ): Promise<StudentTrainingResponse> {
    try {
      const { data, error } = await supabase
        .from("student_trainings")
        .insert({
          student_id: studentId,
          training_id: trainingId,
          week_days: weekDays,
          start_date: startDate,
          end_date: endDate,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, studentTraining: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getStudentTrainings(
    studentId: string,
    activeOnly: boolean = true
  ): Promise<StudentTrainingResponse> {
    try {
      let studentTrainingsQuery = supabase
        .from("student_trainings")
        .select("*")
        .eq("student_id", studentId);

      if (activeOnly) {
        studentTrainingsQuery = studentTrainingsQuery.eq("is_active", true);
      }

      const { data: studentTrainings, error: studentTrainingsError } =
        await studentTrainingsQuery.order("created_at", { ascending: false });

      if (studentTrainingsError) {
        return { success: false, error: studentTrainingsError.message };
      }

      if (!studentTrainings || studentTrainings.length === 0) {
        return { success: true, studentTrainings: [] };
      }

      const trainingIds = studentTrainings.map((st) => st.training_id);

      const { data: trainings, error: trainingsError } = await supabase
        .from("trainings")
        .select("id, name, teacher_id")
        .in("id", trainingIds)
        .is("deleted_at", null);

      if (trainingsError) {
        return { success: false, error: trainingsError.message };
      }

      const enrichedTrainings = await Promise.all(
        (trainings || []).map(async (training) => {
          const { data: trainingExercises } = await supabase
            .from("training_exercises")
            .select(
              `
              id,
              sets,
              repetitions,
              load,
              rest_seconds,
              order_index,
              notes,
              exercise_id
            `
            )
            .eq("training_id", training.id)
            .is("deleted_at", null)
            .order("order_index", { ascending: true });

          const exerciseIds =
            trainingExercises?.map((te) => te.exercise_id) || [];
          const { data: exercises } =
            exerciseIds.length > 0
              ? await supabase
                  .from("exercises")
                  .select(
                    "id, name, muscle_groups, equipment, description, video_url"
                  )
                  .in("id", exerciseIds)
              : { data: [] };

          const exercisesWithData =
            trainingExercises?.map((te) => ({
              ...te,
              exercises:
                exercises?.find((ex) => ex.id === te.exercise_id) || null,
            })) || [];

          return {
            ...training,
            training_exercises: exercisesWithData,
          };
        })
      );

      const combinedData = studentTrainings.map((studentTraining) => ({
        ...studentTraining,
        trainings:
          enrichedTrainings.find((t) => t.id === studentTraining.training_id) ||
          null,
      }));

      return { success: true, studentTrainings: combinedData };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async updateStudentTraining(
    id: string,
    updates: StudentTrainingUpdate
  ): Promise<StudentTrainingResponse> {
    try {
      const { data, error } = await supabase
        .from("student_trainings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, studentTraining: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async deactivateStudentTraining(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("student_trainings")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async addExerciseToTraining(
    trainingId: string,
    exerciseData: Omit<TrainingExerciseInsert, "training_id">
  ): Promise<{
    success: boolean;
    error?: string;
    trainingExercise?: TrainingExercise;
  }> {
    try {
      const { data, error } = await supabase
        .from("training_exercises")
        .insert({
          ...exerciseData,
          training_id: trainingId,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainingExercise: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async updateTrainingExercise(
    id: string,
    updates: TrainingExerciseUpdate
  ): Promise<{
    success: boolean;
    error?: string;
    trainingExercise?: TrainingExercise;
  }> {
    try {
      const { data, error } = await supabase
        .from("training_exercises")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, trainingExercise: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async removeExerciseFromTraining(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("training_exercises")
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }
}

export const trainingService = new TrainingService();
