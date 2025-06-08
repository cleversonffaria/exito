import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ValidateCodeData,
  ValidateCodeResponse,
  ValidateCodeState,
} from "./validate-code.types";

export const useValidateCode = () => {
  const [validateCodeState, setValidateCodeState] = useState<ValidateCodeState>(
    {
      isLoading: false,
      error: undefined,
    }
  );

  const form = useForm({
    defaultValues: {
      code: "",
    },
  });

  const validateCode = useCallback(
    async (data: ValidateCodeData): Promise<ValidateCodeResponse | null> => {
      setValidateCodeState({ isLoading: true, error: undefined });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!data.code) {
          throw new Error("Código é obrigatório");
        }

        const response: ValidateCodeResponse = {
          success: true,
          message: "Código validado com sucesso!",
        };

        setValidateCodeState({ isLoading: false, error: undefined });
        return response;
      } catch (error) {
        const errorResponse: ValidateCodeResponse = {
          success: false,
          message: "Código inválido ou expirado",
        };

        setValidateCodeState({
          isLoading: false,
          error: errorResponse.message,
        });

        return errorResponse;
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (data: ValidateCodeData) => {
      return await validateCode(data);
    },
    [validateCode]
  );

  const clearErrors = useCallback(() => {
    setValidateCodeState((prev) => ({ ...prev, error: undefined }));
  }, []);

  return {
    isLoading: validateCodeState.isLoading,
    error: validateCodeState.error,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    validateCode,
    clearErrors,
  };
};
