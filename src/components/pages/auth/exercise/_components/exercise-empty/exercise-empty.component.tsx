import React from "react";
import { View } from "react-native";
import { TextAtom } from "@atom/text";
import { NExerciseEmpty } from "./exercise-empty.types";

export function ExerciseEmptyComponent({ searchQuery }: NExerciseEmpty.Props) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <TextAtom className="text-gym-gray-400 text-center">
        {searchQuery
          ? "Nenhum exercício encontrado"
          : "Nenhum exercício cadastrado"}
      </TextAtom>
    </View>
  );
}
