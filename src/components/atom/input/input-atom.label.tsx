import React from "react";
import { Text } from "react-native";
import { useInputContext } from "./input-atom.context";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";

export function InputLabel({
  children,
  className,
  ...props
}: NInputAtom.LabelProps) {
  const { variant, size, disabled, focused } = useInputContext();

  const { label } = inputVariants({ variant, size, disabled, focused });

  return (
    <Text className={label({ className })} {...props}>
      {children}
    </Text>
  );
}
