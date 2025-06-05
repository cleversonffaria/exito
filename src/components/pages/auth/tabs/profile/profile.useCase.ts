import { useAuth } from "@/store/useAuth";
import { router } from "expo-router";
import { Alert } from "react-native";

export const useProfile = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return {
    handleLogout,
  };
};
