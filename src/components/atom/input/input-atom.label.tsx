import { TextAtom } from "@atom/text";
import React from "react";
import { useInputContext } from "./input-atom.context";
import { NInputAtom } from "./input-atom.types";
import { inputVariants } from "./input-atom.variant";

export function InputLabel({
  children,
  className,
  ...props
}: NInputAtom.LabelProps) {
  const { variant, size, disabled, focused, hasError } = useInputContext();

  const { label } = inputVariants({
    variant,
    size,
    disabled,
    focused,
    hasError,
  });

  return (
    <TextAtom className={label({ className })} {...props}>
      {children}
    </TextAtom>
  );
}
