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
          title: "Alunos",
        })}
      />
      <Stack.Screen
        name="register"
        options={createCustomHeader({
          title: "Cadastro de Alunos",
        })}
      />

      <Stack.Screen
        name="exercise-training"
        options={createCustomHeader({
          title: "Treino do Aluno",
        })}
      />
      <Stack.Screen
        name="details"
        options={createCustomHeader({
          title: "Aluno",
        })}
      />
      <Stack.Screen
        name="training"
        options={createCustomHeader({
          title: "Treino do Aluno",
        })}
      />
      <Stack.Screen
        name="training-details"
        options={createCustomHeader({
          title: "Detalhes do Treino",
        })}
      />
      <Stack.Screen
        name="register-training"
        options={createCustomHeader({
          title: "Treino do Aluno",
        })}
      />
    </Stack>
  );
}
