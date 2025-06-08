import React, { useState } from "react";
import { View } from "react-native";
import { CodeInputContext } from "./code-input-atom.context";
import { NCodeInputAtom } from "./code-input-atom.types";
import { codeInputVariants } from "./code-input-atom.variant";

export function CodeInputRoot({
  children,
  variant = "default",
  size = "md",
  error,
  className,
  ...props
}: NCodeInputAtom.RootProps) {
  const [value, setValue] = useState("");

  const hasError = !!error;

  const { container } = codeInputVariants({
    variant,
    size,
    hasError,
  });

  return (
    <CodeInputContext.Provider
      value={{
        variant,
        size,
        value,
        setValue,
        error,
        hasError,
      }}
    >
      <View className={container({ className })} {...props}>
        {children}
      </View>
    </CodeInputContext.Provider>
  );
}
