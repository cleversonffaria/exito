import { colors } from "@/constants/colors";
import { createCustomHeader } from "@/utils/header-config.utils";
import { TabBarOrganism } from "@organisms/tab-bar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBarOrganism {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.black[500],
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
        }}
      />
      <Tabs.Screen
        name="training"
        options={createCustomHeader({
          title: "Treino",
        })}
      />
      <Tabs.Screen
        name="profile"
        options={createCustomHeader({
          title: "Perfil",
        })}
      />
    </Tabs>
  );
}
