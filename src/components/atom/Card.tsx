import React from "react";
import { View, ViewProps } from "react-native";
import { tv } from "tailwind-variants";

const cardVariants = tv({
  base: "rounded-2xl",
  variants: {
    variant: {
      default: "bg-white border border-gray-200",
      dark: "bg-gray-700 border border-gray-600",
      primary: "bg-primary-500/10 border border-primary-500/20",
      secondary: "bg-secondary-500/10 border border-secondary-500/20",
      error: "bg-error-400/10 border border-error-400/20",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    },
    elevation: {
      none: "",
      low: "elevation-2",
      medium: "elevation-4",
      high: "elevation-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    shadow: "md",
  },
});

interface CardProps extends ViewProps {
  variant?: "default" | "dark" | "primary" | "secondary" | "error";
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  elevation?: "none" | "low" | "medium" | "high";
}

export default function Card({
  variant = "default",
  padding = "md",
  shadow = "md",
  elevation,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={cardVariants({
        variant,
        padding,
        shadow,
        elevation,
        className,
      })}
      {...props}
    >
      {children}
    </View>
  );
}
