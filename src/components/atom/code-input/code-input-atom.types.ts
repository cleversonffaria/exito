import { Control, FieldPath, FieldValues } from "react-hook-form";
import { TextProps, ViewProps } from "react-native";
import { VariantProps } from "tailwind-variants";
import { codeInputVariants } from "./code-input-atom.variant";

export namespace NCodeInputAtom {
  export interface ContextValue extends VariantProps<typeof codeInputVariants> {
    value: string;
    setValue: (value: string) => void;
    error?: string;
    hasError?: boolean;
  }

  export interface RootProps
    extends ViewProps,
      VariantProps<typeof codeInputVariants> {
    children: React.ReactNode;
    error?: string;
  }

  export interface LabelProps extends TextProps {
    children: React.ReactNode;
  }

  export interface FieldProps {
    cellCount?: number;
    autoFocus?: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onComplete?: (code: string) => void;
  }

  export interface ErrorProps extends TextProps {
    children?: React.ReactNode;
  }

  export interface ControllerProps<T extends FieldValues>
    extends Omit<NCodeInputAtom.RootProps, "error" | "children"> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    cellCount?: number;
    autoFocus?: boolean;
    onComplete?: (code: string) => void;
    fieldProps?: Omit<
      NCodeInputAtom.FieldProps,
      "value" | "onChangeText" | "onComplete"
    >;
  }
}
