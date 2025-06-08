import { useAuth } from "@store/useAuth";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";

export default function App() {
  const { isAuth, loading, checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (loading) {
    return null;
  }

  if (isAuth) {
    return <Redirect href="/(auth)/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}
