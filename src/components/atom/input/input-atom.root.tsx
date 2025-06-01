import React, { useState } from "react";
import { View } from "react-native";
import { InputContext } from "./input-atom.context";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";

export function InputRoot({
  children,
  variant = "default",
  size = "md",
  disabled = false,
  error,
  className,
  ...props
}: NInputAtom.RootProps) {
  const [focused, setFocused] = useState(false);

  const finalVariant = error ? "error" : variant;

  const { container } = inputVariants({
    variant: finalVariant,
    size,
    disabled,
    focused,
  });

  return (
    <InputContext.Provider
      value={{
        variant: finalVariant,
        size,
        disabled,
        focused,
        setFocused,
        error,
      }}
    >
      <View className={container({ className })} {...props}>
        {children}
      </View>
    </InputContext.Provider>
  );
}
