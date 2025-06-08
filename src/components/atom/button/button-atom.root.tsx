import React, { cloneElement, isValidElement } from "react";
import { TouchableOpacity } from "react-native";
import { NButtonAtom } from "./button-atom.types";
import { buttonVariants } from "./button-atom.variant";

export function ButtonRoot({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  outline = false,
  className,
  ...props
}: NButtonAtom.RootProps) {
  const isDisabled = disabled || isLoading;

  const { root } = buttonVariants({
    variant,
    size,
    outline,
    disabled: isDisabled,
    loading: isLoading,
  });

  const enhancedChildren = React.Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<any>, {
        variant,
        size,
        outline,
        disabled: isDisabled,
        loading: isLoading,
      });
    }
    return child;
  });

  return (
    <TouchableOpacity
      className={root({ className })}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {enhancedChildren}
    </TouchableOpacity>
  );
}
