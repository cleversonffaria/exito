import { colors } from "@/constants/colors";
import { TabBarOrganism } from "@organisms/tab-bar";
import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1 bg-gym-black-500">
      <Tabs
        tabBar={(props) => <TabBarOrganism {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          sceneStyle: {
            backgroundColor: colors.black[500],
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Início",
          }}
        />
        <Tabs.Screen
          name="training"
          options={{
            title: "Treino",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
