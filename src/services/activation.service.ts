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
  // Verificar se código é válido
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

  // Ativar conta do aluno (criar conta de autenticação + definir senha)
  async activateAccount(
    email: string,
    code: string,
    password: string
  ): Promise<ActivateAccountResponse> {
    try {
      // 1. Verificar se código é válido e não foi usado
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

      // 2. Buscar usuário na tabela users
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

      // 3. Criar conta de autenticação no Supabase Auth
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

      // 4. Atualizar o ID do usuário na tabela users com o ID do auth
      if (authData.user) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ id: authData.user.id })
          .eq("email", email);

        if (updateError) {
          console.error("Erro ao atualizar ID do usuário:", updateError);
        }
      }

      // 5. Marcar código como usado
      await supabase
        .from("password_reset_codes")
        .update({ used: true })
        .eq("id", codeData.id);

      // 6. Fazer login automático
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

      // 7. Buscar perfil atualizado do usuário
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
      console.error("Erro na ativação:", error);
      return {
        success: false,
        error: "Erro de conexão",
      };
    }
  }

  // Reenviar código de ativação
  async resendActivationCode(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar se usuário existe e não está ativado
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

      // Gerar novo código
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Invalidar códigos antigos
      await supabase
        .from("password_reset_codes")
        .update({ used: true })
        .eq("email", email);

      // Criar novo código
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

      // Log do código (em produção, enviar por email)
      console.log(`📧 Novo código para ${email}: ${newCode}`);

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
