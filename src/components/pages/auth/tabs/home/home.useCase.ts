import { useAuth } from "@/store/useAuth";
import { trainingService } from "@/services/training.service";
import { trainingLogService } from "@/services/training-log.service";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { NHomePage } from "./home.types";

export const useHome = () => {
  const { user } = useAuth();
  const [weeklyStats, setWeeklyStats] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weekDays = [
    { id: 1, day: "Seg" },
    { id: 2, day: "Ter" },
    { id: 3, day: "Qua" },
    { id: 4, day: "Qui" },
    { id: 5, day: "Sex" },
    { id: 6, day: "Sab" },
    { id: 7, day: "Dom" },
  ];

  const loadWeeklyStats = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const trainingResult = await trainingService.getStudentTrainings(user.id);
      if (!trainingResult.success || !trainingResult.studentTrainings) return;

      const today = new Date();
      const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
      const mondayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      mondayDate.setDate(today.getDate() - (currentDayOfWeek - 1));

      const weekStats: { [key: number]: number } = {};

      for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
        const targetDate = new Date(mondayDate);
        targetDate.setDate(mondayDate.getDate() + (dayIndex - 1));

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, "0");
        const day = String(targetDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        const dayTrainings = trainingResult.studentTrainings.filter(
          (st: any) => {
            const weekDays = (st.week_days || []).map((day: string | number) => 
              typeof day === 'string' ? parseInt(day, 10) : day
            );
            return weekDays.includes(dayIndex);
          }
        );

        let totalRepetitionsCompleted = 0;

        for (const studentTraining of dayTrainings) {
          const training = (studentTraining as any).trainings;
          if (!training?.training_exercises) continue;

          const logsResult = await trainingLogService.getLogsByTraining(
            studentTraining.id,
            dateString
          );

          if (logsResult.success && logsResult.trainingLogs) {
            for (const exercise of training.training_exercises) {
              const exerciseLogs = logsResult.trainingLogs.filter(
                (log: any) =>
                  String(log.training_exercise_id) === String(exercise.id)
              );

              totalRepetitionsCompleted += exerciseLogs.length;
            }
          }
        }

        weekStats[dayIndex] = totalRepetitionsCompleted;
      }

      setWeeklyStats(weekStats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadWeeklyStats();
    }, [loadWeeklyStats])
  );

  const weeklyData: NHomePage.WeeklyData[] = useMemo(() => {
    return weekDays.map(({ id, day }) => ({
      day,
      value: weeklyStats[id] || 0,
    }));
  }, [weeklyStats]);

  const maxHeight = 60;

  const totalValue = useMemo(() => {
    return weeklyData.reduce((sum, item) => sum + item.value, 0);
  }, [weeklyData]);

  const weeklyDataWithHeight = useMemo(() => {
    const maxValue = Math.max(...weeklyData.map((item) => item.value), 1);
    return weeklyData.map((item) => ({
      ...item,
      height: maxValue > 0 ? (item.value / maxValue) * maxHeight : 0,
    }));
  }, [weeklyData, maxHeight]);

  const handleNavigationToTraining = () => {
    router.push("/(auth)/(tabs)/training");
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadWeeklyStats();
    } catch (error) {
      // Erro silencioso
    } finally {
      setIsRefreshing(false);
    }
  }, [loadWeeklyStats]);

  return {
    weeklyData,
    weeklyDataWithHeight,
    totalValue,
    maxHeight,
    handleExercisePress: handleNavigationToTraining,
    handleTrainingPress: handleNavigationToTraining,
    handleRefresh,
    user,
    isLoading,
    isRefreshing,
  };
};
