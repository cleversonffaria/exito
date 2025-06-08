import { zodResolver } from "@hookform/resolvers/zod";
import {
  FirstAccessFormData,
  firstAccessSchema,
} from "@schemas/first-access.schema";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FirstAccessData,
  FirstAccessResponse,
  FirstAccessState,
} from "./first-access.types";

export const useFirstAccess = () => {
  const [firstAccessState, setFirstAccessState] = useState<FirstAccessState>({
    isLoading: false,
    error: undefined,
  });

  const form = useForm<FirstAccessFormData>({
    resolver: zodResolver(firstAccessSchema),
    defaultValues: {
      email: "",
    },
  });

  const sendInstructions = useCallback(
    async (data: FirstAccessData): Promise<FirstAccessResponse | null> => {
      setFirstAccessState({ isLoading: true, error: undefined });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!data.email) {
          throw new Error("Email é obrigatório");
        }

        console.log(
          `Enviando instruções de primeiro acesso para: ${data.email}`
        );

        const response: FirstAccessResponse = {
          success: true,
          message: `Instruções enviadas para ${data.email}`,
        };

        setFirstAccessState({ isLoading: false, error: undefined });

        router.push("/validate-code");
        return response;
      } catch (error) {
        const errorResponse: FirstAccessResponse = {
          success: false,
          message: "Erro ao processar primeiro acesso",
        };

        setFirstAccessState({
          isLoading: false,
          error: errorResponse.message,
        });

        return errorResponse;
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (data: FirstAccessFormData) => {
      return await sendInstructions(data);
    },
    [sendInstructions]
  );

  const clearErrors = useCallback(() => {
    setFirstAccessState((prev) => ({ ...prev, error: undefined }));
  }, []);

  return {
    isLoading: firstAccessState.isLoading,
    error: firstAccessState.error,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    sendInstructions,
    clearErrors,
  };
};
