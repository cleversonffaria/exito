import React from "react";
import { Platform, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useCodeInputContext } from "./code-input-atom.context";
import { NCodeInputAtom } from "./code-input-atom.types";
import { codeInputVariants } from "./code-input-atom.variant";

export function CodeInputField({
  cellCount = 6,
  autoFocus = true,
  value,
  onChangeText,
  onComplete,
  ...props
}: NCodeInputAtom.FieldProps) {
  const { variant, size, hasError } = useCodeInputContext();

  const { field, cell, cellText } = codeInputVariants({
    variant,
    size,
    hasError,
  });

  const ref = useBlurOnFulfill({ value, cellCount });
  const [clearProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  const handleChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    onChangeText(numericText);

    if (numericText.length === cellCount && onComplete) {
      setTimeout(() => onComplete(numericText), 50);
    }
  };

  return (
    <View className={field()}>
      <CodeField
        ref={ref}
        {...clearProps}
        value={value}
        onChangeText={handleChangeText}
        cellCount={cellCount}
        keyboardType="number-pad"
        keyboardAppearance="dark"
        textContentType="oneTimeCode"
        autoComplete={Platform.select({
          android: "sms-otp" as const,
          default: "one-time-code" as const,
        })}
        caretHidden={false}
        autoFocus={autoFocus}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            className={cell({
              className: isFocused ? "border-gym-primary-500" : "",
            })}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text className={cellText()}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
        {...props}
      />
    </View>
  );
}
