import { useAuth } from "@/store/useAuth";
import { modal } from "@store/useModal";
import { router } from "expo-router";
import { NProfilePage } from "./profile.types";

export const useProfile = () => {
  const { logout } = useAuth();

  const userType = "teacher" as NProfilePage.UserType;
  const isTeacher = userType === "teacher";

  const profileStats = isTeacher
    ? [
        { value: "72", label: "Total de Alunos" },
        { value: "36", label: "Total de Exercícios" },
      ]
    : [
        { value: "12", label: "Treinos" },
        { value: "36", label: "Em progresso" },
        { value: "24", label: "Completo" },
      ];

  const userInfo = {
    name: "John Doe",
    role: isTeacher ? "Professor" : "Aluno",
    startDate: "06/2024",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  };

  const navigateToStudents = () => {
    router.push("/(auth)/students");
  };

  const navigateToExercises = () => {
    router.push("/(auth)/exercises");
  };

  const showLogoutModal = () => {
    modal.show({
      description: "Tem certeza que deseja sair?",
      adjustToContentHeight: true,
      actions: [
        {
          title: "Sair",
          variant: "error",
          className: "!w-[200px] mx-auto",
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
    isTeacher,
    userInfo,
    profileStats,
    navigateToStudents,
    navigateToExercises,
    showLogoutModal,
  };
};
