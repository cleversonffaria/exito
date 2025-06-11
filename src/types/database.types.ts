export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          age: number | null;
          gender: "Masculino" | "Feminino" | "Outros" | null;
          avatar_url: string | null;
          role: "student" | "teacher";
          goal: string | null;
          start_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          age?: number | null;
          gender?: "Masculino" | "Feminino" | "Outros" | null;
          avatar_url?: string | null;
          role?: "student" | "teacher";
          goal?: string | null;
          start_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          age?: number | null;
          gender?: "Masculino" | "Feminino" | "Outros" | null;
          avatar_url?: string | null;
          role?: "student" | "teacher";
          goal?: string | null;
          start_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          muscle_groups: string[];
          equipment: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          instructions: string | null;
          image_url: string | null;
          video_url: string | null;
          created_by: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          muscle_groups: string[];
          equipment: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          instructions?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          muscle_groups?: string[];
          equipment?: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          instructions?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      trainings: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          teacher_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          teacher_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          teacher_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      training_exercises: {
        Row: {
          id: string;
          training_id: string;
          exercise_id: string;
          sets: number;
          reps: number | null;
          weight: number | null;
          rest_time: number | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          training_id: string;
          exercise_id: string;
          sets: number;
          reps?: number | null;
          weight?: number | null;
          rest_time?: number | null;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          training_id?: string;
          exercise_id?: string;
          sets?: number;
          reps?: number | null;
          weight?: number | null;
          rest_time?: number | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_trainings: {
        Row: {
          id: string;
          student_id: string;
          training_id: string;
          week_days: string[];
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          training_id: string;
          week_days: string[];
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          training_id?: string;
          week_days?: string[];
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      training_logs: {
        Row: {
          id: string;
          student_training_id: string;
          training_exercise_id: string;
          sets_completed: number;
          repetitions_completed: number | null;
          load_used: number | null;
          duration_seconds: number | null;
          notes: string | null;
          completed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_training_id: string;
          training_exercise_id: string;
          sets_completed: number;
          repetitions_completed?: number | null;
          load_used?: number | null;
          duration_seconds?: number | null;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_training_id?: string;
          training_exercise_id?: string;
          sets_completed?: number;
          repetitions_completed?: number | null;
          load_used?: number | null;
          duration_seconds?: number | null;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_student_trainings_with_exercises: {
        Args: {
          student_uuid: string;
        };
        Returns: {
          training_id: number;
          training_name: string;
          week_days: number[];
          exercise_id: number;
          exercise_name: string;
          sets: number;
          repetitions: number;
          load: number | null;
          rest_seconds: number | null;
          notes: string | null;
          equipment: string;
          muscle_groups: string[];
        }[];
      };
      calculate_student_progress: {
        Args: {
          student_uuid: string;
          training_id_param: number;
        };
        Returns: {
          total_exercises: number;
          completed_exercises: number;
          completion_percentage: number;
        }[];
      };
    };
    Enums: {
      user_role: "student" | "teacher";
      gender_type: "Masculino" | "Feminino" | "Outros";
      exercise_difficulty: "beginner" | "intermediate" | "advanced";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
export type Training = Database["public"]["Tables"]["trainings"]["Row"];
export type TrainingExercise =
  Database["public"]["Tables"]["training_exercises"]["Row"];
export type StudentTraining =
  Database["public"]["Tables"]["student_trainings"]["Row"];
export type TrainingLog = Database["public"]["Tables"]["training_logs"]["Row"];

export type UserRole = Database["public"]["Enums"]["user_role"];
export type GenderType = Database["public"]["Enums"]["gender_type"];

export type InsertUser = Database["public"]["Tables"]["users"]["Insert"];
export type InsertExercise =
  Database["public"]["Tables"]["exercises"]["Insert"];
export type InsertTraining =
  Database["public"]["Tables"]["trainings"]["Insert"];
export type InsertTrainingExercise =
  Database["public"]["Tables"]["training_exercises"]["Insert"];
export type InsertStudentTraining =
  Database["public"]["Tables"]["student_trainings"]["Insert"];
export type InsertTrainingLog =
  Database["public"]["Tables"]["training_logs"]["Insert"];

export type UpdateUser = Database["public"]["Tables"]["users"]["Update"];
export type UpdateExercise =
  Database["public"]["Tables"]["exercises"]["Update"];
export type UpdateTraining =
  Database["public"]["Tables"]["trainings"]["Update"];
export type UpdateTrainingExercise =
  Database["public"]["Tables"]["training_exercises"]["Update"];
export type UpdateStudentTraining =
  Database["public"]["Tables"]["student_trainings"]["Update"];

export interface TrainingWithExercises extends Training {
  training_exercises: (TrainingExercise & {
    exercise: Exercise;
  })[];
}

export interface StudentWithTrainings extends User {
  student_trainings: (StudentTraining & {
    training: TrainingWithExercises;
  })[];
}

export interface StudentTrainingWithProgress extends StudentTraining {
  training: TrainingWithExercises;
  today_logs: TrainingLog[];
}
