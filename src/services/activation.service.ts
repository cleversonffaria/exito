import { supabase } from "./supabase";

interface VerifyCodeResponse {
  success: boolean;
  error?: string;
  isValid?: boolean;
}

interface ActivateAccountResponse {
  success: boolean;
  error?: string;
  user?: any;
}

class ActivationService {
  async verifyActivationCode(
    email: string,
    code: string
  ): Promise<VerifyCodeResponse> {
    try {
      const { data, error } = await supabase
        .from("password_reset_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return {
          success: true,
          isValid: false,
          error: "Código inválido ou expirado",
        };
      }

      return {
        success: true,
        isValid: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro de conexão",
      };
    }
  }

  async activateAccount(
    email: string,
    code: string,
    password: string
  ): Promise<ActivateAccountResponse> {
    try {
      const { data: codeData, error: codeError } = await supabase
        .from("password_reset_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (codeError || !codeData) {
        return {
          success: false,
          error: "Código inválido ou expirado",
        };
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", "student")
        .single();

      if (userError || !userData) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: "student",
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: authError.message || "Erro ao criar conta de autenticação",
        };
      }

      await supabase
        .from("password_reset_codes")
        .update({ used: true })
        .eq("id", codeData.id);

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError || !loginData.user) {
        return {
          success: false,
          error: "Conta criada, mas erro no login automático",
        };
      }

      const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", loginData.user.id)
        .single();

      return {
        success: true,
        user: userProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro de conexão",
      };
    }
  }

  async resendActivationCode(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", "student")
        .single();

      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await supabase
        .from("password_reset_codes")
        .update({ used: true })
        .eq("email", email);

      const { error } = await supabase.from("password_reset_codes").insert({
        email,
        code: newCode,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

      if (error) {
        return {
          success: false,
          error: "Erro ao gerar novo código",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Erro de conexão",
      };
    }
  }
}

export const activationService = new ActivationService();
