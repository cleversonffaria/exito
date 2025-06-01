import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { tv } from "tailwind-variants";

const inputVariants = tv({
  slots: {
    container: "mb-5",
    label: "text-base font-semibold mb-2",
    input: "rounded-xl px-4 py-3.5 text-base",
    errorText: "text-sm mt-1",
  },
  variants: {
    variant: {
      default: {
        label: "text-gray-800",
        input: "border border-gray-300 bg-gray-50 text-gray-900",
      },
      glass: {
        label: "text-gray-300",
        input:
          "border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-300",
      },
      error: {
        label: "text-error-400",
        input: "border border-error-400 bg-red-50 text-gray-900",
        errorText: "text-error-400",
      },
    },
    disabled: {
      true: {
        input: "bg-gray-200 text-gray-500",
        label: "text-gray-500",
      },
    },
    focused: {
      true: {
        input: "border-primary-500 ring-2 ring-primary-500/20",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: "default" | "error" | "glass";
  containerClassName?: string;
  disabled?: boolean;
}

export default function Input({
  label,
  error,
  variant = "default",
  disabled,
  containerClassName,
  className,
  ...props
}: InputProps) {
  const [focused, setFocused] = React.useState(false);

  const inputVariant = error ? "error" : variant;

  const {
    container,
    label: labelClass,
    input,
    errorText,
  } = inputVariants({ variant: inputVariant, disabled, focused });

  return (
    <View className={container({ className: containerClassName })}>
      {label && <Text className={labelClass()}>{label}</Text>}

      <TextInput
        className={input({ className })}
        placeholderTextColor="#6B7280"
        editable={!disabled}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />

      {error && <Text className={errorText()}>{error}</Text>}
    </View>
  );
}
