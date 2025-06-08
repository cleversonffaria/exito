import { TextAtom } from "@atom/text";
import React from "react";
import { NButtonAtom } from "./button-atom.types";
import { buttonVariants } from "./button-atom.variant";

export function ButtonText({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  outline = false,
  className,
  ...props
}: NButtonAtom.TextProps) {
  const { text } = buttonVariants({
    variant,
    size,
    outline,
    disabled,
    loading,
  });

  const displayText = loading ? "Carregando..." : children;

  return (
    <TextAtom className={text({ className })} {...props}>
      {displayText}
    </TextAtom>
  );
}
