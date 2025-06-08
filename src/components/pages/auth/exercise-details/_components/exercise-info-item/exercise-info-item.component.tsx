import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { NExerciseInfoItem } from "./exercise-info-item.types";

export function ExerciseInfoItem({ label, value }: NExerciseInfoItem.Props) {
  return (
    <View className="flex-row justify-between items-center">
      <TextAtom className="text-white text-base font-medium">{label}</TextAtom>
      <TextAtom className="text-gym-gray-400 text-base">{value}</TextAtom>
    </View>
  );
}
