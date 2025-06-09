import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { activationService } from "@/services/activation.service";
import { useActivationStore } from "@/store/useActivationStore";
import { useToast } from "@/hooks/useToast";
import { ValidateCodeData, ValidateCodeResponse } from "./validate-code.types";

export const useValidateCode = () => {
  const { email, setCode } = useActivationStore();
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const form = useForm({
    defaultValues: {
      code: "",
    },
  });

  const validateCode = useCallback(
    async (data: ValidateCodeData): Promise<ValidateCodeResponse | null> => {
      setIsLoading(true);

      try {
        if (!data.code) {
          throw toast.error("Código é obrigatório");
        }

        if (!email) {
          throw toast.error(
            "Email não encontrado. Volte e digite seu email novamente."
          );
        }

        const result = await activationService.verifyActivationCode(
          email,
          data.code
        );

        if (!result.success || !result.isValid) {
          throw new Error(result.error || "Código inválido ou expirado");
        }

        const response: ValidateCodeResponse = {
          success: true,
          message: "Código validado com sucesso!",
        };

        toast.success("Código validado com sucesso!", {
          description: "Agora você pode criar sua senha",
        });

        setCode(data.code);

        router.push("/create-password");

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Código inválido ou expirado";

        const errorResponse: ValidateCodeResponse = {
          success: false,
          message: errorMessage,
        };

        toast.error(errorMessage);

        return errorResponse;
      } finally {
        setIsLoading(false);
      }
    },
    [email, setCode]
  );

  const handleSubmit = useCallback(
    async (data: ValidateCodeData) => {
      return await validateCode(data);
    },
    [validateCode]
  );

  return {
    isLoading,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    validateCode,
  };
};
