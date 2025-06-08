import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import PlusIcon from "@assets/svg/plus-solid.svg";
import { NExerciseHeaderButton } from "./exercise-header-button.types";

export function ExerciseHeaderButtonComponent({
  onPress,
}: NExerciseHeaderButton.Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="p-1.5 bg-gym-primary-500 rounded-full"
      activeOpacity={0.7}
      hitSlop={20}
    >
      <PlusIcon width={12} height={12} color={colors.black[500]} />
    </TouchableOpacity>
  );
}
