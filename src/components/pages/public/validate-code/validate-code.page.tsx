import Logo from "@assets/svg/logo.svg";
import { ButtonAtom } from "@atom/button";
import { CodeInputAtom } from "@atom/code-input";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { useValidateCode } from "./validate-code.useCase";

export default function ValidateCodePage() {
  const { isLoading, form, handleSubmit } = useValidateCode();

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center pt-16">
            <Logo width={160} height={140} />
          </View>

          <View className="flex-1 justify-center mb-24">
            <CodeInputAtom.Controller
              control={form.control}
              name="code"
              label="Digite o código enviado por e-mail"
              cellCount={6}
              variant="default"
              onComplete={() => handleSubmit()}
            />
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <ButtonAtom.Root
            onPress={handleSubmit}
            isLoading={isLoading}
            variant="primary"
            className="shadow-lg"
          >
            <ButtonAtom.Text>Concluir</ButtonAtom.Text>
          </ButtonAtom.Root>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
