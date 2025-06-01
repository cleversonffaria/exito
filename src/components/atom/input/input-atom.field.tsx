import React, { useRef } from "react";
import { TextInput } from "react-native";
import { colors } from "../../../constants/colors";
import { useInputContext } from "./input-atom.context";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";

export function InputField({ className, ...props }: NInputAtom.FieldProps) {
  const { variant, size, disabled, focused, setFocused } = useInputContext();
  const inputRef = useRef<TextInput>(null);

  const { input } = inputVariants({ variant, size, disabled, focused });

  return (
    <TextInput
      ref={inputRef}
      className={input({ className })}
      editable={!disabled}
      selectionColor={colors.primary[500]}
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
  );
}
