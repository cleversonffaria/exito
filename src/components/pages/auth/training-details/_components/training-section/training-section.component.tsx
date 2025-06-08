import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { NTrainingSection } from "./training-section.types";

export function TrainingSection({
  title,
  content,
  className = "text-base",
}: NTrainingSection.Props) {
  return (
    <View className="pt-4">
      <TextAtom className="text-white text-lg font-medium mb-2">
        {title}
      </TextAtom>
      <TextAtom className={`text-gym-gray-400 ${className}`}>
        {content}
      </TextAtom>
    </View>
  );
}
