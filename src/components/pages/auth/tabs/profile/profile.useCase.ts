import { useAuth } from "@/store/useAuth";
import { modal } from "@store/useModal";
import { router } from "expo-router";

export const useProfile = () => {
  const { logout } = useAuth();

  const showLogoutModal = () => {
    modal.show({
      description: "Tem certeza que deseja sair?",
      adjustToContentHeight: true,
      actions: [
        {
          title: "Sair",
          variant: "error",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
        {
          title: "Cancelar",
          variant: "none",
          onPress: () => {
            console.log("Cancelado");
          },
        },
      ],
    });
  };

  return {
    showLogoutModal,
  };
};
