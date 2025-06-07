import { colors } from "@/constants/colors";
import { createCustomHeader } from "@utils/header-config";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.black[500] },
          headerShown: false,
          animation: "none",
          animationDuration: 0,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="exercise-details"
          options={createCustomHeader({
            title: "Detalhes do Exercício",
          })}
        />
      </Stack>
    </SafeAreaView>
  );
}
