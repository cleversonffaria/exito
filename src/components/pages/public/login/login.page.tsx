import Logo from "@assets/svg/logo.svg";
import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import React from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { useLogin } from "./login.useCase";

export default function LoginPage() {
  const { isLoading, form, handleSubmit, handleRecoverPassword } = useLogin();

  return (
    <View className="flex-1">
      <View className="absolute inset-0 overflow-hidden">
        <ImageBackground
          source={require("@assets/images/gym-background.webp")}
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
                control={form.control}
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
                control={form.control}
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
                onPress={handleSubmit}
                isLoading={isLoading}
                variant="primary"
                className="mb-4 shadow-lg"
              >
                <ButtonAtom.Text>Entrar</ButtonAtom.Text>
              </ButtonAtom.Root>

              <ButtonAtom.Root
                onPress={handleRecoverPassword}
                disabled={isLoading}
                variant="none"
              >
                <ButtonAtom.Text>Primeiro Acesso</ButtonAtom.Text>
              </ButtonAtom.Root>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
