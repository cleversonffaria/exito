import "react-native-reanimated";
import "../../global.css";

import { useStorePersist } from "@hooks/useStorePersist";
import { useAuth } from "@store/useAuth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { colors } from "../constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuth } = useAuth();
  const { isHydrated } = useStorePersist();

  const [loaded] = useFonts({
    Epilogue: require("@assets/fonts/Epilogue.ttf"),
    WorkSans: require("@assets/fonts/WorkSans.ttf"),
  });

  useEffect(() => {
    if (!loaded || !isHydrated) return;

    SplashScreen.hideAsync();
  }, [loaded, isHydrated]);

  if (!loaded || !isHydrated) return null;

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.black[500] },
          animation: "none",
          animationDuration: 0,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Protected guard={!isAuth}>
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={isAuth}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="light" />
    </>
  );
}
