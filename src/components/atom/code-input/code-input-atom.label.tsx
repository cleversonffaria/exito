import { TextAtom } from "@atom/text";
import React from "react";
import { useCodeInputContext } from "./code-input-atom.context";
import { NCodeInputAtom } from "./code-input-atom.types";
import { codeInputVariants } from "./code-input-atom.variant";

export function CodeInputLabel({
  children,
  className,
  ...props
}: NCodeInputAtom.LabelProps) {
  const { variant, size, hasError } = useCodeInputContext();

  const { label } = codeInputVariants({
    variant,
    size,
    hasError,
  });

  return (
    <TextAtom className={label({ className })} {...props}>
      {children}
    </TextAtom>
  );
}
