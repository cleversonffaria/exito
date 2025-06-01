import { TextInputProps, TextProps, ViewProps } from "react-native";
import { VariantProps } from "tailwind-variants";
import { inputVariants } from "./input-atom.variant";

export namespace NInputAtom {
  export interface ContextValue extends VariantProps<typeof inputVariants> {
    focused: boolean;
    setFocused: (focused: boolean) => void;
    error?: string;
  }

  export interface RootProps
    extends ViewProps,
      VariantProps<typeof inputVariants> {
    children: React.ReactNode;
    error?: string;
  }

  export interface LabelProps extends TextProps {
    children: React.ReactNode;
  }

  export interface FieldProps extends TextInputProps {}

  export interface ErrorProps extends TextProps {
    children?: React.ReactNode;
  }
}
