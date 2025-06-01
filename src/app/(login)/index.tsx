import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Button from "../../components/atom/Button";
import Input from "../../components/atom/Input";
import { useAuth } from "../../store/useAuth";

import Logo from "@/assets/svg/logo.svg";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { setAuth } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuth(true);
      router.push("/(tabs)/home");
    } catch (error) {
      console.log("Erro", "Falha na autenticação");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = () => {
    router.push("/recover-password");
  };

  return (
    <View className="flex-1">
      {/* Background Image com múltiplas estratégias para cobertura total */}
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
          <View className="flex-1 justify-center">
            <View className="items-center">
              <Logo width={160} height={140} className="mb-4" />
            </View>

            {/* Form container com glass morphism melhorado */}
            <View>
              <Text className="text-xl font-bold text-white mb-6 text-center">
                Faça seu login
              </Text>

              <Input
                label="E-mail"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                variant="error"
                containerClassName="mb-4"
              />

              <Input
                label="Senha"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Digite sua senha"
                secureTextEntry
                autoComplete="password"
                error={errors.password}
                variant="glass"
                containerClassName="mb-6"
              />

              <Button
                title="Entrar"
                onPress={handleLogin}
                isLoading={loading}
                className="mb-4 shadow-lg"
              />

              <Button
                title="Esqueci minha senha"
                variant="transparent"
                onPress={handleRecoverPassword}
                disabled={loading}
              />
            </View>

            {/* Espaço inferior flexível */}
            <View className="pb-8 pt-4" />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
