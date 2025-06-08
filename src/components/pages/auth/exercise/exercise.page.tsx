import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";

import { useAuth } from "@/store/useAuth";
import { useExerciseSelection } from "./exercise.useCase";
import {
  ExerciseSearchComponent,
  ExerciseListComponent,
  ExerciseHeaderButtonComponent,
} from "./_components";

export default function ExercisePage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredExercises,
    loading,
    handleViewExerciseDetails,
    addNewExercise,
  } = useExerciseSelection();

  const { user } = useAuth();
  const navigation = useNavigation();
  const isTeacher = user?.role === "teacher";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isTeacher ? (
          <ExerciseHeaderButtonComponent onPress={addNewExercise} />
        ) : null,
    });
  }, [navigation, addNewExercise, isTeacher]);

  return (
    <View className="flex-1 px-6 mt-4">
      <ExerciseSearchComponent
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ExerciseListComponent
        loading={loading}
        exercises={filteredExercises}
        searchQuery={searchQuery}
        onExercisePress={handleViewExerciseDetails}
      />
    </View>
  );
}
