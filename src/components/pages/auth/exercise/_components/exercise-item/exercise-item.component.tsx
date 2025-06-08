import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { TextAtom } from "@atom/text";
import { NExerciseItem } from "./exercise-item.types";

export function ExerciseItemComponent({
  exercise,
  onPress,
}: NExerciseItem.Props) {
  return (
    <TouchableOpacity
      className="flex-row items-center rounded-xl p-4 mb-3"
      activeOpacity={0.8}
      onPress={() => onPress(exercise)}
    >
      <View className="w-12 h-12 bg-gym-black-500 rounded-lg mr-4 items-center justify-center overflow-hidden">
        {exercise.image ? (
          <Image
            source={{ uri: exercise.image }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => console.log("Erro ao carregar imagem")}
          />
        ) : (
          <View className="w-full h-full bg-gym-black-400 items-center justify-center">
            <View className="w-6 h-6 bg-gym-primary-500 rounded-full" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <TextAtom className="text-gym-gray-200 font-semibold text-base mb-1">
          {exercise.name}
        </TextAtom>
        <TextAtom className="text-gym-gray-400 text-sm">
          {exercise.category}
        </TextAtom>
      </View>
    </TouchableOpacity>
  );
}
