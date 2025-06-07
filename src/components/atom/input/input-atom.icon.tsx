import { HocRenderComponent } from "@/hoc/hoc-render-component";
import React from "react";
import { View } from "react-native";
import { NInputAtom } from "./input-atom.types";

export function InputIcon({ icon }: NInputAtom.InputIconProps) {
  return (
    <View pointerEvents="none">
      <HocRenderComponent component={icon} />
    </View>
  );
}
