import type { Database } from "@/types/database.types";
import { supabase } from "./supabase";

interface CreateStudentData {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "Masculino" | "Feminino" | "Outros";
  goal: string;
}

interface StudentResponse {
  success: boolean;
  error?: string;
  student?: Database["public"]["Tables"]["users"]["Row"];
  activationCode?: string;
}

class StudentService {
  // Gerar código de ativação
  private generateActivationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
  }

  // Verificar se usuário logado é professor
  private async isCurrentUserTeacher(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      return !error && data?.role === "teacher";
    } catch {
      return false;
    }
  }

  // Enviar código de ativação por email
  private async sendActivationCode(
    email: string,
    code: string,
    studentName: string
  ): Promise<boolean> {
    try {
      // Salvar código na tabela password_reset_codes
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Expira em 24 horas

      const { error } = await supabase.from("password_reset_codes").insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

      if (error) {
        console.error("Erro ao salvar código:", error);
        return false;
      }

      // Enviar email via Edge Function
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
      console.error("Erro ao enviar código:", error);
      return false;
    }
  }

  async createStudent(
    studentData: CreateStudentData
  ): Promise<StudentResponse> {
    try {
      // 🔒 VALIDAÇÃO: Verificar se é professor
      const isTeacher = await this.isCurrentUserTeacher();

      if (!isTeacher) {
        return {
          success: false,
          error: "Apenas professores podem cadastrar alunos",
        };
      }

      // Verificar se email já existe
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

      // Gerar código de ativação
      const activationCode = this.generateActivationCode();

      // Criar registro na tabela users
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
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Enviar código por email
      const emailSent = await this.sendActivationCode(
        studentData.email,
        activationCode,
        studentData.name
      );

      if (!emailSent) {
        // Se falhar ao enviar email, remover o usuário criado
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
}

export const studentService = new StudentService();
