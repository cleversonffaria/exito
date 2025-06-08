import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useRegisterTraining } from "./register-training.useCase";

export default function RegisterTrainingPage() {
  const { form, isLoading, handleSubmit, selectedExercise } =
    useRegisterTraining();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={20}
    >
      <View className="flex-1 px-6">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View className="pt-8">
            <InputAtom.Controller
              control={form.control}
              name="exercise.name"
              label="Nome do Exercício"
              placeholder="Nome do exercício"
              disabled
              fieldProps={{ editable: false }}
            />

            <InputAtom.Controller
              control={form.control}
              name="exercise.category"
              label="Músculo Trabalhado"
              placeholder="Músculo Trabalhado"
              disabled
              fieldProps={{ editable: false }}
            />

            <InputAtom.Controller
              control={form.control}
              name="series"
              label="Séries"
              placeholder="Digite o número de séries"
              fieldProps={{ keyboardType: "numeric" }}
            />

            <InputAtom.Controller
              control={form.control}
              name="repetitions"
              label="Repetições"
              placeholder="Digite o número de repetições"
              fieldProps={{ keyboardType: "numeric" }}
            />

            <InputAtom.Controller
              control={form.control}
              name="load"
              label="Carga"
              placeholder="Digite a carga (kg)"
              fieldProps={{ keyboardType: "numeric" }}
            />

            <InputAtom.Controller
              control={form.control}
              name="restTime"
              label="Descanso em segundos"
              placeholder="Digite o tempo de descanso"
              fieldProps={{ keyboardType: "numeric" }}
            />

            <InputAtom.Controller
              control={form.control}
              name="observations"
              label="Observações"
              placeholder="Digite observações sobre o exercício"
              fieldProps={{
                multiline: true,
                textAlignVertical: "top",
              }}
              classNameContainer="h-24"
            />
          </View>
        </ScrollView>

        <View className="pb-8">
          <ButtonAtom.Root
            onPress={handleSubmit}
            isLoading={isLoading}
            className="bg-gym-primary-500"
          >
            <ButtonAtom.Text className="text-black text-base font-semibold">
              Concluir
            </ButtonAtom.Text>
          </ButtonAtom.Root>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
