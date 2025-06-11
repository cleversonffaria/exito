import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/store/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@schemas/login.schema";
import { router } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

export const useLogin = () => {
  const { signIn, loading } = useAuth();
  const toast = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        const signInUser = await signIn(data.email, data.password);

        if (signInUser.success) {
          toast.success("Login realizado com sucesso!", {
            description: "Bem-vindo ao sistema",
          });
          router.push("/(auth)/(tabs)/home");
        } else {
          toast.error("Erro na autenticação", {
            description: signInUser.error || "Erro na autenticação",
          });
        }

        return signInUser;
      } catch (error) {
        toast.error("Erro inesperado", {
          description: "Tente novamente mais tarde",
        });
      }
    },
    [signIn, form, toast]
  );

  const clearErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  const handleRecoverPassword = () => {
    router.push("/first-access");
  };

  return {
    isLoading: loading,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    clearErrors,
    handleRecoverPassword,
  };
};
