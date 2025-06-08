import React from "react";
import { ScrollView } from "react-native";
import { ExerciseItemComponent } from "../exercise-item/exercise-item.component";
import { ExerciseLoadingComponent } from "../exercise-loading/exercise-loading.component";
import { ExerciseEmptyComponent } from "../exercise-empty/exercise-empty.component";
import { NExerciseList } from "./exercise-list.types";

export function ExerciseListComponent({
  loading,
  exercises,
  searchQuery,
  onExercisePress,
}: NExerciseList.Props) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {loading ? (
        <ExerciseLoadingComponent />
      ) : exercises.length > 0 ? (
        exercises.map((exercise) => (
          <ExerciseItemComponent
            key={exercise.id}
            exercise={exercise}
            onPress={onExercisePress}
          />
        ))
      ) : (
        <ExerciseEmptyComponent searchQuery={searchQuery} />
      )}
    </ScrollView>
  );
}
