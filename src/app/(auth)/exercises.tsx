import { TextAtom } from "@atom/text";
import React from "react";
import { View } from "react-native";

export default function ExercisesPage() {
  return (
    <View className="flex-1 bg-gym-black-500 items-center justify-center">
      <TextAtom className="text-gym-gray-300 text-lg">
        Lista de Exercícios
      </TextAtom>
      <TextAtom className="text-gym-gray-400 text-base mt-2">
        Em desenvolvimento...
      </TextAtom>
    </View>
  );
}
