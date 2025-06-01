import "react-native-reanimated";
import "../../global.css";

import { useStorePersist } from "@hooks/useStorePersist";
import { useAuth } from "@store/useAuth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuth } = useAuth();
  const { isHydrated } = useStorePersist();

  const [loaded] = useFonts({
    WorkSans: require("../assets/fonts/WorkSans.ttf"),
    Epilogue: require("../assets/fonts/Epilogue.ttf"),
  });

  useEffect(() => {
    if (!loaded || !isHydrated) return;

    SplashScreen.hideAsync();
  }, [loaded, isHydrated]);

  if (!loaded || !isHydrated) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="(login)" options={{ headerShown: false }} />

        <Stack.Protected guard={!isAuth}>
          <Stack.Screen
            name="recover-password"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Protected guard={isAuth}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="dark" />
    </>
  );
}
