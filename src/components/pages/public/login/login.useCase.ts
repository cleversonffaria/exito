import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@schemas/login.schema";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginCredentials, LoginResponse, LoginState } from "./login.types";

export const useLogin = () => {
  const [loginState, setLoginState] = useState<LoginState>({
    isLoading: false,
    error: undefined,
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authenticate = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
      setLoginState({ isLoading: true, error: undefined });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!credentials.email || !credentials.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const response: LoginResponse = {
          success: true,
          user: {
            id: "1",
            email: credentials.email,
            name: "Usuário",
          },
          token: "mock-jwt-token",
        };

        setLoginState({ isLoading: false, error: undefined });
        return response;
      } catch (error) {
        const errorResponse: LoginResponse = {
          success: false,
        };

        setLoginState({
          isLoading: false,
          error: "Erro na autenticação",
        });

        return errorResponse;
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      return await authenticate(data);
    },
    [authenticate]
  );

  const clearErrors = useCallback(() => {
    setLoginState((prev) => ({ ...prev, error: undefined }));
  }, []);

  const handleRecoverPassword = () => {
    router.push("/validate-code");
  };

  return {
    isLoading: loginState.isLoading,
    error: loginState.error,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    authenticate,
    clearErrors,
    handleRecoverPassword,
  };
};
