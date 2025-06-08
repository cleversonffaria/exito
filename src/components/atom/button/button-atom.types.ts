import { TextProps as RNTextProps, TouchableOpacityProps } from "react-native";
import { VariantProps } from "tailwind-variants";
import { buttonVariants } from "./button-atom.variant";

export namespace NButtonAtom {
  export interface RootProps
    extends TouchableOpacityProps,
      VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    isLoading?: boolean;
  }

  export interface TextProps
    extends RNTextProps,
      VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
  }
}
