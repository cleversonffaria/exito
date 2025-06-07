import ArrowLeft from "@/assets/svg/arrow-left.svg";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

interface HeaderConfigOptions {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export const createCustomHeader = (options: HeaderConfigOptions) => {
  const { title, onBackPress, showBackButton = true } = options;

  return {
    headerShown: true,
    title,
    headerStyle: {
      backgroundColor: colors.black[500],
      paddingTop: 0,
    },
    headerTintColor: colors.gray[300],
    headerTitleStyle: {
      fontFamily: "Epilogue",
      fontSize: 18,
      fontWeight: "600" as const,
    },
    headerShadowVisible: false,
    headerStatusBarHeight: 0,
    ...(showBackButton && {
      headerLeft: () => (
        <TouchableOpacity
          onPress={onBackPress || (() => router.back())}
          className="p-2 -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft width={20} height={20} color={colors.gray[400]} />
        </TouchableOpacity>
      ),
    }),
  };
};
