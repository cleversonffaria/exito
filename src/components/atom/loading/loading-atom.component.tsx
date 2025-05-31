import { colors } from "@/constants/colors";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}
