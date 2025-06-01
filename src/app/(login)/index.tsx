import Logo from "@/assets/svg/logo.svg";
import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@schemas/login.schema";
import { useAuth } from "@store/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";

export default function LoginScreen() {
  const [isSubmit, setIsSubmit] = useState(false);
  const { setAuth } = useAuth();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmit(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuth(true);
      router.push("/(tabs)/home");
    } catch (error) {
      console.log("Erro", "Falha na autenticação");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleRecoverPassword = () => {
    router.push("/recover-password");
  };

  return (
    <View className="flex-1">
      <View className="absolute inset-0 overflow-hidden">
        <ImageBackground
          source={require("../../assets/images/gym-background.webp")}
          className="w-full h-full scale-105"
          resizeMode="cover"
        />
      </View>

      <SafeAreaView className="flex-1 relative z-20 mx-6">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-around mt-14">
            <View>
              <View className="items-center">
                <Logo width={160} height={140} className="mb-4" />
              </View>

              <InputAtom.Controller
                control={control}
                name="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                variant="glass"
                className="mb-4"
                fieldProps={{
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  autoComplete: "email",
                }}
              />

              <InputAtom.Controller
                control={control}
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                variant="glass"
                className="mb-6"
                fieldProps={{
                  secureTextEntry: true,
                  autoComplete: "password",
                }}
              />
            </View>

            <View>
              <ButtonAtom.Root
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmit}
                variant="primary"
                className="mb-4 shadow-lg"
              >
                <ButtonAtom.Text>Entrar</ButtonAtom.Text>
              </ButtonAtom.Root>

              <ButtonAtom.Root
                onPress={handleRecoverPassword}
                disabled={isSubmit}
                variant="none"
              >
                <ButtonAtom.Text>Esqueci minha senha</ButtonAtom.Text>
              </ButtonAtom.Root>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
