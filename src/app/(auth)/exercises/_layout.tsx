import { colors } from "@/constants/colors";
import { createCustomHeader } from "@/utils/header-config.utils";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.black[500] },
        headerShown: false,
        animation: "none",
        animationDuration: 0,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={createCustomHeader({
          title: "Exercícios",
        })}
      />
      <Stack.Screen
        name="register"
        options={createCustomHeader({
          title: "Exercícios",
        })}
      />
    </Stack>
  );
}
