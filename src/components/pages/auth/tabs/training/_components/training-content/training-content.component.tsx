import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { TrainingCard } from "../training-card";
import { NTrainingContent } from "./training-content.types";

export function TrainingContent({
  trainings,
  isLoading,
  onExercisePress,
}: NTrainingContent.Props) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <TextAtom className="text-gym-gray-400 text-base">
          Carregando treinos...
        </TextAtom>
      </View>
    );
  }

  if (trainings.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <TextAtom className="text-gym-gray-400 text-base text-center">
          Nenhum treino encontrado para este dia
        </TextAtom>
      </View>
    );
  }

  return (
    <>
      {trainings.map((training, index) => (
        <TrainingCard
          key={index}
          training={training}
          onExercisePress={onExercisePress}
        />
      ))}
    </>
  );
}
