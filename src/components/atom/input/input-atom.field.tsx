import React, { useRef } from "react";
import { TextInput } from "react-native";
import { colors } from "../../../constants/colors";
import { useInputContext } from "./input-atom.context";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";
import { InputErrorBoundary } from "./input-error-boundary";

export function InputField({ className, ...props }: NInputAtom.FieldProps) {
  const { variant, size, disabled, focused, setFocused, hasError } =
    useInputContext();
  const inputRef = useRef<TextInput>(null);

  const { input } = inputVariants({
    variant,
    size,
    disabled,
    focused,
    hasError,
  });

  return (
    <InputErrorBoundary>
      <TextInput
        ref={inputRef}
        className={input({ className })}
        editable={!disabled}
        selectionColor={colors.primary[500]}
        keyboardAppearance="dark"
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </InputErrorBoundary>
  );
}
