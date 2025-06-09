import { supabase } from "@/services/supabase";
import { useAuth } from "@/store/useAuth";
import { router } from "expo-router";
import { toast } from "sonner-native";

export class RequestInterceptor {
  static async validateAuth(): Promise<boolean> {
    const { isAuth, user, validateSupabaseSession } = useAuth.getState();

    if (!isAuth || !user) {
      toast.error("Sessão expirada", {
        description: "Faça login novamente",
      });
      router.replace("/login");
      return false;
    }

    const isValidSession = await validateSupabaseSession();

    if (!isValidSession) {
      toast.error("Sessão expirada", {
        description: "Faça login novamente",
      });
      router.replace("/login");
      return false;
    }

    return true;
  }

  static async validateTeacherAuth(): Promise<boolean> {
    const isValid = await this.validateAuth();
    if (!isValid) return false;

    const { user } = useAuth.getState();

    if (user?.role !== "teacher") {
      toast.error("Acesso negado", {
        description: "Apenas professores podem realizar esta ação",
      });
      return false;
    }

    return true;
  }
}
