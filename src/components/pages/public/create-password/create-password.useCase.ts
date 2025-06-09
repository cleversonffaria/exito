import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { activationService } from "@/services/activation.service";
import { router } from "expo-router";
import { useActivationStore } from "@/store/useActivationStore";
import { toast } from "sonner-native";
import {
  CreatePasswordData,
  CreatePasswordResponse,
} from "./create-password.types";

export const useCreatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { email, code, reset } = useActivationStore();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!email || !code) {
      router.replace("/validate-code");
    }
  }, [email, code]);

  const createPassword = useCallback(
    async (
      data: CreatePasswordData
    ): Promise<CreatePasswordResponse | null> => {
      setIsLoading(true);

      try {
        if (!data.password || !data.confirmPassword) {
          throw new Error("Todos os campos são obrigatórios");
        }

        if (data.password !== data.confirmPassword) {
          throw new Error("As senhas não coincidem");
        }

        if (data.password.length < 6) {
          throw new Error("A senha deve ter pelo menos 6 caracteres");
        }

        if (!email || !code) {
          throw new Error("Dados de ativação não encontrados");
        }

        const result = await activationService.activateAccount(
          email,
          code,
          data.password
        );

        if (!result.success) {
          throw new Error(result.error || "Erro ao criar senha");
        }

        const response: CreatePasswordResponse = {
          success: true,
          message: "Senha criada com sucesso!",
        };

        setIsLoading(false);

        toast.success("Conta ativada com sucesso!", {
          description: "Você já pode fazer login no aplicativo",
        });

        router.replace("/login");

        setTimeout(() => {
          reset();
        }, 100);

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao criar senha";

        toast.error("Erro ao ativar conta", {
          description: errorMessage,
        });

        const errorResponse: CreatePasswordResponse = {
          success: false,
          message: errorMessage,
        };

        setIsLoading(false);

        return errorResponse;
      }
    },
    [email, code, reset]
  );

  const handleSubmit = useCallback(
    async (data: CreatePasswordData) => {
      return await createPassword(data);
    },
    [createPassword]
  );

  return {
    isLoading,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    createPassword,
  };
};
