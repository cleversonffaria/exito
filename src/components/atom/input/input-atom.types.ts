import { Control, FieldPath, FieldValues } from "react-hook-form";
import { TextInputProps, TextProps, ViewProps } from "react-native";
import { VariantProps } from "tailwind-variants";
import { inputVariants } from "./input-atom.variant";

export namespace NInputAtom {
  export interface ContextValue extends VariantProps<typeof inputVariants> {
    focused: boolean;
    setFocused: (focused: boolean) => void;
    error?: string;
    hasError?: boolean;
  }

  export interface RootProps
    extends ViewProps,
      VariantProps<typeof inputVariants> {
    children: React.ReactNode;
    classNameContainer?: string;
    error?: string;
    label?: string;
  }

  export interface LabelProps extends TextProps {
    children: React.ReactNode;
  }

  export interface FieldProps extends TextInputProps {}

  export interface ErrorProps extends TextProps {
    children?: React.ReactNode;
  }

  export interface InputIconProps {
    icon: React.ComponentType | React.ReactElement;
  }

  export interface ControllerProps<T extends FieldValues>
    extends Omit<NInputAtom.RootProps, "error" | "children"> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    fieldProps?: Omit<NInputAtom.FieldProps, "value" | "onChangeText">;
    onSubmitEditing?: () => void;
  }
}
