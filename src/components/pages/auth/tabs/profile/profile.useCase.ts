import { useAuth } from "@/store/useAuth";
import { modal } from "@store/useModal";
import { router } from "expo-router";

export const useProfile = () => {
  const { logout } = useAuth();

  const profileStats = [
    { value: "12", label: "Treinos" },
    { value: "36", label: "Em progresso" },
    { value: "24", label: "Completo" },
  ];

  const userInfo = {
    name: "John Doe",
    role: "Aluno",
    startDate: "06/2024",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  };

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
    userInfo,
    profileStats,
    showLogoutModal,
  };
};
