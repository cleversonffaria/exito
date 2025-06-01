import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useInputContext } from "./input-atom.context";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";

export function InputError({
  children,
  className,
  ...props
}: NInputAtom.ErrorProps) {
  const { variant, size, disabled, focused, error } = useInputContext();
  const { errorText } = inputVariants({ variant, size, disabled, focused });

  const shakeX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (error || children) {
      opacity.value = withTiming(1, { duration: 200 });
      shakeX.value = withSequence(
        withTiming(3, { duration: 50 }),
        withTiming(-3, { duration: 50 }),
        withTiming(2, { duration: 50 }),
        withTiming(-2, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [error, children]);

  if (!children && !error) return null;

  return (
    <Animated.View style={animatedStyle} className="overflow-hidden">
      <Text className={errorText({ className })} {...props}>
        {children || error}
      </Text>
    </Animated.View>
  );
}
