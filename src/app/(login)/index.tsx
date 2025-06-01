import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Button from "../../components/atom/Button";
import Input from "../../components/atom/Input";
import { useAuth } from "../../store/useAuth";

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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-12">
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Bem-vindo!
            </Text>
            <Text className="text-base text-gray-600">
              Faça login para continuar
            </Text>
          </View>

          <View className="w-full">
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
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              isLoading={loading}
              className="mt-5"
            />

            <Button
              title="Recuperar senha"
              variant="secondary"
              onPress={handleRecoverPassword}
              disabled={loading}
              className="mt-3"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
