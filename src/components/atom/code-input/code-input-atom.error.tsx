import { TextAtom } from "@atom/text";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useCodeInputContext } from "./code-input-atom.context";
import { NCodeInputAtom } from "./code-input-atom.types";
import { codeInputVariants } from "./code-input-atom.variant";

export function CodeInputError({
  children,
  className,
  ...props
}: NCodeInputAtom.ErrorProps) {
  const { variant, size, error, hasError } = useCodeInputContext();
  const { errorText } = codeInputVariants({
    variant,
    size,
    hasError,
  });

  const shakeX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
    opacity: opacity.value,
  }));

  const hasErrorContent = !!(error || children);

  useEffect(() => {
    if (hasErrorContent) {
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
  }, [hasErrorContent]);

  return (
    <Animated.View
      style={animatedStyle}
      className="overflow-hidden min-h-5 mt-2 ml-4"
    >
      {hasErrorContent && (
        <TextAtom className={errorText({ className })} {...props}>
          {children || error}
        </TextAtom>
      )}
    </Animated.View>
  );
}
