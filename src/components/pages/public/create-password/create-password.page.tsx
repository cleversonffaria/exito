import Logo from "@assets/svg/logo.svg";
import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from "react-native";
import { useCreatePassword } from "./create-password.useCase";

export default function CreatePasswordPage() {
  const { isLoading, form, handleSubmit } = useCreatePassword();

  return (
    <SafeAreaView className="flex-1 bg-gym-black-500">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="pt-8">
            <View className="items-center mb-6">
              <Logo width={120} height={100} />
            </View>

            <Text className="text-2xl font-bold text-center text-gym-gray-200 mb-2">
              Criar Senha
            </Text>
            <Text className="text-base text-center text-gym-gray-200 mb-6">
              Defina uma senha segura para sua conta
            </Text>

            <View className="space-y-4">
              <InputAtom.PasswordController
                control={form.control}
                name="password"
                label="Nova Senha"
                placeholder="Digite sua nova senha"
              />

              <InputAtom.PasswordController
                control={form.control}
                name="confirmPassword"
                label="Confirmar Senha"
                placeholder="Digite novamente sua senha"
              />
            </View>
          </View>

          <View className="pt-8 pb-10">
            <ButtonAtom.Root
              onPress={handleSubmit}
              isLoading={isLoading}
              variant="primary"
              className="shadow-lg"
            >
              <ButtonAtom.Text>Criar Senha</ButtonAtom.Text>
            </ButtonAtom.Root>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
