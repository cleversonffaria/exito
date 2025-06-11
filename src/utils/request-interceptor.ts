import { useAuth } from "@/store/useAuth";
import { router } from "expo-router";
import { toast } from "sonner-native";

export class RequestInterceptor {
  static async validateAuth(): Promise<boolean> {
    const { isAuth, user } = useAuth.getState();

    if (!isAuth || !user) {
      toast.error("Sessão expirada", {
        description: "Faça login novamente",
      });
      router.replace("/login");
      return false;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { validateSupabaseSession } = useAuth.getState();
      const isValidSession = await validateSupabaseSession();

      if (!isValidSession) {
        toast.error("Sessão expirada", {
          description: "Faça login novamente",
        });
        router.replace("/login");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na validação de auth:", error);
      return true; // Em caso de erro, assumir válido para não quebrar o fluxo
    }
  }

  static async validateTeacherAuth(): Promise<boolean> {
    const { isAuth, user } = useAuth.getState();

    if (!isAuth || !user) {
      toast.error("Sessão expirada", {
        description: "Faça login novamente",
      });
      router.replace("/login");
      return false;
    }

    if (user?.role !== "teacher") {
      toast.error("Acesso negado", {
        description: "Apenas professores podem realizar esta ação",
      });
      return false;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { validateSupabaseSession } = useAuth.getState();
      const isValidSession = await validateSupabaseSession();

      if (!isValidSession) {
        toast.error("Sessão expirada", {
          description: "Faça login novamente",
        });
        router.replace("/login");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na validação de teacher auth:", error);
      return true; // Em caso de erro, assumir válido para não quebrar o fluxo
    }
  }
}
