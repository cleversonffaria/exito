import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";
import { InputAtom } from "@atom/input";
import { TextAtom } from "@atom/text";
import { NExerciseTrainingPage } from "./exercise.types";
import { useExerciseSelection } from "./exercise.useCase";

import PlusIcon from "@assets/svg/plus-solid.svg";
import SearchIcon from "@assets/svg/search.svg";

export default function ExercisePage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredExercises,
    handleViewExerciseDetails,
    addNewExercise,
  } = useExerciseSelection();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={addNewExercise}
          className="p-1.5 bg-gym-primary-500 rounded-full"
          activeOpacity={0.7}
          hitSlop={20}
        >
          <PlusIcon width={12} height={12} color={colors.black[500]} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, addNewExercise]);

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
            onPress={() => handleViewExerciseDetails(exercise)}
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
