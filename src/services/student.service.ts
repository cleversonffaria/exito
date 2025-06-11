import type { Database } from "@/types/database.types";
import { FileUploadResult } from "@/hooks/useFileUpload";
import { RequestInterceptor } from "@/utils/request-interceptor";
import { supabase } from "./supabase";
import { storageService } from "./storage.service";

interface CreateStudentData {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "Masculino" | "Feminino" | "Outros";
  goal: string;
  avatar?: FileUploadResult;
}

interface StudentResponse {
  success: boolean;
  error?: string;
  student?: Database["public"]["Tables"]["users"]["Row"];
  activationCode?: string;
}

class StudentService {
  private generateActivationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendActivationCode(
    email: string,
    code: string,
    studentName: string
  ): Promise<boolean> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase.from("password_reset_codes").insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

      if (error) {
        return false;
      }

      const { data, error: emailError } = await supabase.functions.invoke(
        "send-activation-email",
        {
          body: { email, code, studentName },
        }
      );

      if (emailError) {
        throw new Error(`Falha no envio do email: ${emailError.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Erro desconhecido no envio do email");
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async createStudent(
    studentData: CreateStudentData
  ): Promise<StudentResponse> {
    try {
      const isAuthorized = await RequestInterceptor.validateTeacherAuth();
      if (!isAuthorized) {
        return {
          success: false,
          error: "Sem autorização",
        };
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", studentData.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "Já existe um usuário com este email",
        };
      }

      const activationCode = this.generateActivationCode();

      let avatarUrl: string | null = null;
      if (studentData.avatar) {
        const avatarUpload = await storageService.uploadAvatar(
          studentData.avatar
        );
        if (!avatarUpload.success) {
          return {
            success: false,
            error: avatarUpload.error || "Erro ao fazer upload do avatar",
          };
        }
        avatarUrl = avatarUpload.url!;
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          age: studentData.age,
          gender: studentData.gender,
          goal: studentData.goal,
          role: "student",
          avatar_url: avatarUrl,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      const emailSent = await this.sendActivationCode(
        studentData.email,
        activationCode,
        studentData.name
      );

      if (!emailSent) {
        await supabase.from("users").delete().eq("email", studentData.email);

        return {
          success: false,
          error: "Erro ao enviar email de ativação",
        };
      }

      return {
        success: true,
        student: data,
        activationCode,
      };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getStudents(): Promise<{
    success: boolean;
    error?: string;
    students?: Database["public"]["Tables"]["users"]["Row"][];
  }> {
    try {
      const isAuthorized = await RequestInterceptor.validateAuth();
      if (!isAuthorized) {
        return { success: false, error: "Sem autorização" };
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, students: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getStudentById(id: string): Promise<{
    success: boolean;
    error?: string;
    student?: Database["public"]["Tables"]["users"]["Row"];
  }> {
    try {
      const isAuthorized = await RequestInterceptor.validateAuth();
      if (!isAuthorized) {
        return { success: false, error: "Sem autorização" };
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("role", "student")
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, student: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }
}

export const studentService = new StudentService();
