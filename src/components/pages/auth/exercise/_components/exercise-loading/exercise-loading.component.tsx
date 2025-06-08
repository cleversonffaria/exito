import React from "react";
import { View } from "react-native";

export function ExerciseLoadingComponent() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} className="flex-row items-center rounded-xl p-4 mb-3">
          <View className="w-12 h-12 bg-gym-black-400 rounded-lg mr-4 animate-pulse" />
          <View className="flex-1">
            <View className="h-4 bg-gym-black-400 rounded mb-2 animate-pulse" />
            <View className="h-3 bg-gym-black-400 rounded w-2/3 animate-pulse" />
          </View>
        </View>
      ))}
    </>
  );
}
