import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { tv, VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  slots: {
    base: "rounded-xl items-center justify-center",
    text: "font-semibold text-white",
  },
  variants: {
    variant: {
      primary: {
        base: "bg-primary-500",
        text: "text-black-500",
      },
      secondary: {
        base: "bg-secondary-500",
      },
      error: {
        base: "bg-error-400",
      },
      outline: {
        base: "border-2 border-primary-500 bg-transparent",
        text: "text-primary-500",
      },
      ghost: {
        base: "bg-transparent",
        text: "text-primary-500",
      },
      transparent: {
        base: "bg-transparent",
        text: "text-gray-300",
      },
    },
    size: {
      xs: {
        base: "py-1 px-2",
        text: "text-xs",
      },
      sm: {
        base: "py-2 px-4",
        text: "text-sm",
      },
      md: {
        base: "py-4 px-6",
        text: "text-lg",
      },
      lg: {
        base: "py-5 px-8",
        text: "text-xl",
      },
    },
    disabled: {
      true: {
        base: "bg-gray-400",
        text: "text-gray-600",
      },
    },
    loading: {
      true: {
        base: "bg-gray-400",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  title: string;
  isLoading?: boolean;
}

export default function Button({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const { base, text } = buttonVariants({
    variant,
    size,
    disabled: isDisabled,
    loading: isLoading,
  });

  return (
    <TouchableOpacity
      className={base({ className })}
      disabled={isDisabled}
      {...props}
    >
      <Text className={text()}>{isLoading ? "Carregando..." : title}</Text>
    </TouchableOpacity>
  );
}
