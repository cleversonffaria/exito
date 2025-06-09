import { zodResolver } from "@hookform/resolvers/zod";
import {
  FirstAccessFormData,
  firstAccessSchema,
} from "@schemas/first-access.schema";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useActivationStore } from "@/store/useActivationStore";
import { supabase } from "@/services/supabase";
import {
  FirstAccessData,
  FirstAccessResponse,
  FirstAccessState,
} from "./first-access.types";
import { useToast } from "@/hooks/useToast";

export const useFirstAccess = () => {
  const [firstAccessState, setFirstAccessState] = useState<FirstAccessState>({
    isLoading: false,
    error: undefined,
  });

  const { setEmail, setStudentName, reset } = useActivationStore();

  const toast = useToast();

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
        const { data: userData, error } = await supabase
          .from("users")
          .select("name, email")
          .eq("email", data.email.toLowerCase().trim())
          .single();

        if (error || !userData) {
          throw toast.error(
            "Email não encontrado. Verifique se foi cadastrado por um professor."
          );
        }

        setEmail(userData.email);
        setStudentName(userData.name);

        const response: FirstAccessResponse = {
          success: true,
          message: `Usuário encontrado: ${userData.name}`,
        };

        setFirstAccessState({ isLoading: false, error: undefined });

        router.push("/validate-code");
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao processar primeiro acesso";

        const errorResponse: FirstAccessResponse = {
          success: false,
          message: errorMessage,
        };

        setFirstAccessState({
          isLoading: false,
          error: errorResponse.message,
        });

        return errorResponse;
      }
    },
    [setEmail, setStudentName]
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
