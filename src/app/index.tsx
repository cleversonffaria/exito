import { useAuth } from "@store/useAuth";
import { Redirect } from "expo-router";
import React from "react";

export default function App() {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Redirect href="/(auth)/home" />;
  }

  return <Redirect href="/login" />;
}
