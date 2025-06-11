import type { AuthResponse, SignUpData } from "@/interfaces";
import type { Database, User } from "@/types/database.types";
import {
  translateSupabaseError,
  getGenericErrorMessage,
} from "@/utils/error-translator.utils";
import { supabase } from "./supabase";

type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

class AuthService {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginData.user && !loginError) {
        const userData = await this.getUserProfile(loginData.user.id);

        if (userData.success) {
          return {
            success: true,
            user: userData.user,
          };
        } else {
          return {
            success: false,
            error: userData.error,
          };
        }
      }

      if (loginError) {
        const { data: studentProfile } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .eq("role", "student")
          .is("deleted_at", null)
          .single();

        if (studentProfile && !studentProfile.id) {
          return {
            success: false,
            error:
              "Conta não ativada. Use 'Primeiro Acesso' para ativar sua conta com o código enviado por email.",
          };
        }
      }

      return {
        success: false,
        error: translateSupabaseError(
          loginError?.message || "Email ou senha incorretos"
        ),
      };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      if (authData.user) {
        const userProfile: UserInsert = {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role || "student",
        };

        const { error: insertError } = await supabase
          .from("users")
          .insert(userProfile);

        if (insertError) {
          return { success: false, error: "Erro ao criar perfil do usuário" };
        }

        return { success: true };
      }

      return { success: false, error: "Erro inesperado no cadastro" };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      if (session?.user) {
        const userData = await this.getUserProfile(session.user.id);
        return userData;
      }

      return { success: false, error: "Nenhuma sessão ativa" };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async getUserProfile(userId: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .is("deleted_at", null)
        .single();

      if (error) {
        const { data: allUsers } = await supabase
          .from("users")
          .select("id, email, name")
          .limit(5);

        return {
          success: false,
          error: "Usuário não encontrado ou foi excluído",
        };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error("Erro no getUserProfile:", error);
      return { success: false, error: "Erro ao carregar perfil" };
    }
  }

  async updateProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: "Erro ao atualizar perfil" };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async resetPassword(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async sendResetCode(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "reset-password",
        {
          body: {
            action: "send_code",
            email: email,
          },
        }
      );

      if (error) {
        return {
          success: false,
          error:
            translateSupabaseError(error.message) ||
            "Erro ao enviar código de verificação",
        };
      }

      if (data?.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async verifyResetCode(
    email: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "reset-password",
        {
          body: {
            action: "verify_code",
            email: email,
            code: code,
          },
        }
      );

      if (error) {
        return {
          success: false,
          error:
            translateSupabaseError(error.message) ||
            "Código de verificação inválido",
        };
      }

      if (data?.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async resetPasswordWithCode(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "reset-password",
        {
          body: {
            action: "reset_password",
            email: email,
            code: code,
            new_password: newPassword,
          },
        }
      );

      if (error) {
        return {
          success: false,
          error:
            translateSupabaseError(error.message) || "Erro ao alterar senha",
        };
      }

      if (data?.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro de conexão" };
    }
  }

  async syncAuthenticatedUser(
    name: string,
    role: "student" | "teacher" = "student"
  ): Promise<AuthResponse> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return {
          success: false,
          error: translateSupabaseError("Usuário não autenticado"),
        };
      }

      const userProfile: UserInsert = {
        id: user.id,
        email: user.email || "",
        name: name,
        role: role,
      };

      const { data, error: insertError } = await supabase
        .from("users")
        .insert(userProfile)
        .select()
        .single();

      if (insertError) {
        return {
          success: false,
          error: translateSupabaseError(insertError.message),
        };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: getGenericErrorMessage("auth") };
    }
  }
}

export const authService = new AuthService();
