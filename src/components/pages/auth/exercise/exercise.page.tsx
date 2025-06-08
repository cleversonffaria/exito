import { useExerciseSelection } from "@/components/pages/auth/exercise-training/exercise-training.useCase";
import { colors } from "@/constants/colors";
import SearchIcon from "@assets/svg/search.svg";
import { InputAtom } from "@atom/input";
import { TextAtom } from "@atom/text";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { NExerciseTrainingPage } from "./exercise.types";

export default function ExercisePage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredExercises,
    handleSelectExercise,
  } = useExerciseSelection();

  return (
    <View className="flex-1 px-6 mt-4">
      <InputAtom.Root className="-mb-7">
        <InputAtom.Icon
          icon={<SearchIcon width={16} height={16} color={colors.gray[400]} />}
        />

        <InputAtom.Field
          placeholder="Pesquisar exercício"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </InputAtom.Root>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredExercises.map((exercise: NExerciseTrainingPage.Option) => (
          <TouchableOpacity
            key={exercise.id}
            className="flex-row items-center rounded-xl p-4 mb-3"
            activeOpacity={0.8}
            onPress={() => handleSelectExercise(exercise)}
          >
            <View className="w-12 h-12 bg-gym-black-500 rounded-lg mr-4 items-center justify-center overflow-hidden">
              {exercise.image ? (
                <Image
                  source={{ uri: exercise.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gym-black-400 animate-pulse" />
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
        ))}
      </ScrollView>
    </View>
  );
}
