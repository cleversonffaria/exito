import { Redirect } from "expo-router";

export default function AuthIndex() {
  return <Redirect href="/(auth)/(tabs)/home" />;
}
