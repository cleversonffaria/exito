import { userService } from "@/services/user.service";
import { useAuth } from "@/store/useAuth";
import { modal } from "@store/useModal";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export const useProfile = () => {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    exercises: 0,
    trainings: 0,
    progress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  const isTeacher = user?.role === "teacher";

  const profileStats = isTeacher
    ? [
        { value: stats.students.toString(), label: "Total de Alunos" },
        { value: stats.exercises.toString(), label: "Total de Exercícios" },
      ]
    : [
        { value: stats.trainings.toString(), label: "Treinos" },
        { value: stats.progress.toString(), label: "Em progresso" },
        { value: stats.completed.toString(), label: "Completo" },
      ];

  const userInfo = {
    name: user?.name || "Usuário",
    role: isTeacher ? "Professor" : "Aluno",
    startDate: user?.start_date
      ? new Date(user.start_date).toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
        })
      : new Date().toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
        }),
    avatar:
      user?.avatar_url ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  };

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      if (isTeacher) {
        const result = await userService.getTeacherStats();
        if (result.success && result.stats) {
          setStats({
            students: result.stats.totalStudents,
            exercises: result.stats.totalExercises,
            trainings: 0,
            progress: 0,
            completed: 0,
          });
        }
      } else {
        const result = await userService.getStudentStats(user.id);
        if (result.success && result.stats) {
          setStats({
            students: 0,
            exercises: 0,
            trainings: result.stats.totalTrainings,
            progress: result.stats.inProgress,
            completed: result.stats.completed,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [user, isTeacher]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

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
          onPress: async () => {
            await signOut();
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
    loading,
    navigateToStudents,
    navigateToExercises,
    showLogoutModal,
  };
};
