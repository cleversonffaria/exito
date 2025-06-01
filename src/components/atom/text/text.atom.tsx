import { FC, PropsWithChildren } from "react";
import { Text } from "react-native";
import { cn } from "../../../utils/cn";
import { NTextAtom } from "./text-atom.types";
import { textVariants } from "./text-atom.variants";

export const TextAtom: FC<PropsWithChildren<NTextAtom.Props>> = ({
  children,
  size = "base",
  className,
  testID,
  As = Text,
  ...props
}) => {
  return (
    <As
      testID={testID}
      {...props}
      aria-label={children}
      className={cn(textVariants({ size }), className)}
    >
      {children}
    </As>
  );
};
