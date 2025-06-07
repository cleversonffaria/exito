import React, { useState } from "react";
import { View } from "react-native";
import { InputContext } from "./input-atom.context";
import { InputLabel } from "./input-atom.label";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";

export function InputRoot({
  children,
  variant = "default",
  size = "md",
  disabled = false,
  error,
  className,
  label,
  ...props
}: NInputAtom.RootProps) {
  const [focused, setFocused] = useState(false);

  const hasError = !!error;

  const { container } = inputVariants({
    variant,
    size,
    disabled,
    focused,
    hasError,
  });

  return (
    <InputContext.Provider
      value={{
        variant,
        size,
        disabled,
        focused,
        setFocused,
        error,
        hasError,
      }}
    >
      <View>
        <InputLabel>{label}</InputLabel>
        <View className={container({ className })} {...props}>
          {children}
        </View>
      </View>
    </InputContext.Provider>
  );
}
