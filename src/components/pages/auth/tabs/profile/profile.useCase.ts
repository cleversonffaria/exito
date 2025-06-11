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

  const isTeacher = user?.role === "teacher";

  const profileStats = isTeacher
    ? [
        { value: stats.students.toString(), label: "Total de Alunos" },
        { value: stats.exercises.toString(), label: "Total de Exercícios" },
      ]
    : [
        {
          value: stats.trainings.toString(),
          label: "Total de\nTreinos",
        },
        {
          value: stats.progress.toString(),
          label: "Treinos em\n Progresso",
        },
        {
          value: stats.completed.toString(),
          label: "Repetições\nFinalizadas",
        },
      ];

  const userInfo = {
    name: user?.name || "Usuário",
    role: isTeacher ? "Professor" : "Aluno",
    startDate: user?.start_date
      ? new Date(user.start_date).toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
          day: "2-digit",
        })
      : new Date().toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
          day: "2-digit",
        }),
    avatar: user?.avatar_url || null,
    hasAvatar: !!user?.avatar_url,
  };

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;

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
      return null;
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
          onPress: () => {},
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
