import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import { createCustomHeader } from "../../utils/header-config";

export default function PublicLayout() {
  return (
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
    </Stack>
  );
}
