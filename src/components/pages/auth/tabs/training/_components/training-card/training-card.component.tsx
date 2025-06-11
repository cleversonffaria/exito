import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { ExerciseItem } from "../exercise-item";
import { NTrainingCard } from "./training-card.types";

export function TrainingCard({
  training,
  onExercisePress,
}: NTrainingCard.Props) {
  return (
    <View className="mb-6">
      <TextAtom className="text-gym-gray-400 text-base font-medium mb-4 text-center">
        {training.name}
      </TextAtom>

      {training.exercises.map((exercise) => (
        <ExerciseItem
          key={exercise.exercise.id}
          exercise={exercise}
          isCompleted={exercise.isCompleted || false}
          onPress={() => onExercisePress(exercise)}
        />
      ))}
    </View>
  );
}
