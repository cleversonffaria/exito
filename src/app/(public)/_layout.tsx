import { colors } from "@/constants/colors";
import { useAuth } from "@/store/useAuth";
import { Redirect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCustomHeader } from "../../utils/header-config.utils";

export default function PublicLayout() {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Redirect href="/(auth)/(tabs)/home" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.black[500] },
          animation: "none",
          animationDuration: 0,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="first-access"
          options={createCustomHeader({ title: "Primeiro Acesso" })}
        />
        <Stack.Screen
          name="validate-code"
          options={createCustomHeader({ title: "Primeiro acesso" })}
        />
        <Stack.Screen
          name="create-password"
          options={createCustomHeader({ title: "Criar Senha" })}
        />
      </Stack>
    </SafeAreaView>
  );
}
