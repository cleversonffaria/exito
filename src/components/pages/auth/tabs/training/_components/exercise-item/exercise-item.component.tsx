import { TouchableOpacity, View } from "react-native";

import SealCheckFillIcon from "@assets/svg/seal-check-fill.svg";
import SealCheckIcon from "@assets/svg/seal-check.svg";
import { TextAtom } from "@atom/text";
import { colors } from "@constants/colors";
import { cn } from "@utils/cn";

import { NExerciseItem } from "./exercise-item.types";

export function ExerciseItem({
  exercise,
  isCompleted,
  onPress,
}: NExerciseItem.Props) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress, activeOpacity: 0.8 } : {};

  return (
    <Wrapper
      className="bg-gym-black-400 rounded-2xl p-6 mb-3 flex-row items-center justify-between"
      {...wrapperProps}
    >
      <View className="flex-1 gap-1">
        <TextAtom className="text-white text-lg font-semibold">
          {exercise.exercise.name}
        </TextAtom>
        <TextAtom className="text-gym-gray-400 text-sm">
          Séries - {exercise.sets} x {exercise.repetitions}
        </TextAtom>
      </View>

      <View className="flex-col items-end gap-3">
        {isCompleted ? (
          <SealCheckFillIcon
            width={24}
            height={24}
            color={colors.primary[500]}
          />
        ) : (
          <SealCheckIcon width={24} height={24} color={colors.gray[600]} />
        )}

        <View className="flex-row">
          {Array.from({ length: exercise.sets }).map((_, index) => (
            <View
              key={index}
              className={cn("w-2 h-2 rounded-full mx-0.5", {
                "bg-gym-primary-500": index < (exercise.completedSets || 0),
                "bg-gym-gray-600": index >= (exercise.completedSets || 0),
              })}
            />
          ))}
        </View>
      </View>
    </Wrapper>
  );
}
