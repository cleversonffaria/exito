import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { NExerciseSection } from "./exercise-section.types";

export function ExerciseSection({
  title,
  content,
  className = "text-base",
}: NExerciseSection.Props) {
  return (
    <View className="pt-4">
      <TextAtom className="text-white text-base font-medium mb-2">
        {title}
      </TextAtom>
      <TextAtom className={`text-gym-gray-400 ${className}`}>
        {content}
      </TextAtom>
    </View>
  );
}
