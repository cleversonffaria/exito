import { TextAtom } from "@atom/text";
import { colors } from "@constants/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { cn } from "@utils/cn";
import React from "react";
import { Pressable, View } from "react-native";
import {
  TAB_BAR_ICONS,
  TAB_BAR_LABELS,
  TabKey,
} from "./tab-bar-organism.constants";

export function TabBarOrganism({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="absolute left-0 right-0 bg-gym-black-400 border border-gym-gray-700 rounded-2xl shadow-lg mx-6 h-20 bottom-2">
      <View className="flex-row h-full items-center justify-around px-4">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const IconComponent = TAB_BAR_ICONS[route.name as TabKey];
          const label = TAB_BAR_LABELS[route.name as TabKey];

          if (!IconComponent || !label) return null;

          const iconSize = route.name === "training" ? 26 : 20;

          return (
            <Pressable
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 h-full items-center justify-center"
            >
              <View className="items-center justify-center">
                <IconComponent
                  width={iconSize}
                  height={iconSize}
                  color={isFocused ? colors.primary[500] : colors.gray[500]}
                />
                <TextAtom
                  className={cn("text-sm mt-1 text-gym-gray-400", {
                    "text-gym-primary-500": isFocused,
                  })}
                >
                  {label}
                </TextAtom>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
