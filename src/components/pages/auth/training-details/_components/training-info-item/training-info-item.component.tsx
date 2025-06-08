import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { NTrainingInfoItem } from "./training-info-item.types";

export function TrainingInfoItem({ label, value }: NTrainingInfoItem.Props) {
  return (
    <View className="flex-row justify-between items-center">
      <TextAtom className="text-white text-lg font-medium">{label}</TextAtom>
      <TextAtom className="text-gym-gray-400 text-lg">{value}</TextAtom>
    </View>
  );
}
