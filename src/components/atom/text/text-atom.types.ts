import React, { ComponentProps } from "react";
import { Text } from "react-native";
import { VariantProps } from "tailwind-variants";
import { textVariants } from "./text-atom.variants";

export namespace NTextAtom {
  export interface Props
    extends VariantProps<typeof textVariants>,
      ComponentProps<typeof Text> {
    As?: React.ElementType;
  }
}
