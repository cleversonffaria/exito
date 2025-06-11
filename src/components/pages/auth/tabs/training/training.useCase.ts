import { useTrainingDetails } from "@/store/useTrainingDetails";
import { useAuth } from "@/store/useAuth";
import { trainingService } from "@/services/training.service";
import { trainingLogService } from "@/services/training-log.service";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { NTrainingPage } from "./training.types";

export const useTraining = () => {
  const today = new Date();
  const currentWeekDay = today.getDay() === 0 ? 7 : today.getDay();

  const [selectedDay, setSelectedDay] = useState(currentWeekDay);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trainings, setTrainings] = useState<NTrainingPage.Training[]>([]);
  const router = useRouter();
  const { setSelectedTraining } = useTrainingDetails();
  const { user } = useAuth();

  const weekDays: NTrainingPage.WeekDay[] = [
    { id: 1, name: "Segunda", shortName: "Seg", isActive: false },
    { id: 2, name: "Terça", shortName: "Ter", isActive: false },
    { id: 3, name: "Quarta", shortName: "Qua", isActive: false },
    { id: 4, name: "Quinta", shortName: "Qui", isActive: false },
    { id: 5, name: "Sexta", shortName: "Sex", isActive: false },
    { id: 6, name: "Sábado", shortName: "Sab", isActive: false },
    { id: 7, name: "Domingo", shortName: "Dom", isActive: false },
  ];

  useEffect(() => {
    loadTrainings();
  }, []);

  const getDateForSelectedDay = useCallback((dayId: number) => {
    const today = new Date();
    const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

    const daysDifference = dayId - currentDayOfWeek;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysDifference);

    return targetDate.toISOString().split("T")[0];
  }, []);

  const loadCompletedRepetitions = useCallback(async () => {
    if (!user?.id) return;

    setTrainings((currentTrainings) => {
      if (currentTrainings.length === 0) return currentTrainings;

      const selectedDate = getDateForSelectedDay(selectedDay);

      Promise.all(
        currentTrainings.map(async (training) => {
          const result = await trainingLogService.getLogsByTraining(
            training.id,
            selectedDate
          );

          if (result.success && result.trainingLogs) {
            const updatedExercises = training.exercises.map((exercise) => {
              const exerciseLogs = result.trainingLogs!.filter(
                (log: any) =>
                  String(log.training_exercise_id) === String(exercise.id)
              );

              const completedSets = exerciseLogs.length;
              const isCompleted = completedSets >= exercise.repetitions;

              return {
                ...exercise,
                completedSets,
                isCompleted,
              };
            });

            return {
              ...training,
              exercises: updatedExercises,
            };
          }

          return training;
        })
      )
        .then((updatedTrainings) => {
          setTrainings(updatedTrainings);
        })
        .catch((error) => {
          console.error("Erro ao carregar repetições completadas:", error);
        });

      return currentTrainings;
    });
  }, [user?.id, selectedDay, getDateForSelectedDay]);

  useFocusEffect(
    useCallback(() => {
      if (trainings.length > 0) {
        loadCompletedRepetitions();
      }
    }, [loadCompletedRepetitions, selectedDay, trainings.length])
  );

  const loadTrainings = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const result = await trainingService.getStudentTrainings(user.id);

      if (result.success && result.studentTrainings) {
        const formattedTrainings = result.studentTrainings.map((st: any) => {
          const training = st.trainings;
          const exercises = training?.training_exercises || [];

          return {
            id: st.id,
            name: training?.name || "Treino sem nome",
            week_days: st.week_days || [],
            exercises: exercises.map((te: any) => ({
              id: te.id,
              exercise: {
                id: te.exercises?.id || 0,
                name: te.exercises?.name || "Exercício",
                muscles_worked: te.exercises?.muscle_groups || [],
                equipment: te.exercises?.equipment || "",
                description: te.exercises?.description || "",
                video_url: te.exercises?.video_url || null,
              },
              sets: te.sets || 0,
              repetitions: te.repetitions || 0,
              load: te.load || 0,
              rest: te.rest_seconds || 0,
              notes: te.notes || "",
              completedSets: 0,
              isCompleted: false,
            })),
          };
        });

        setTrainings(formattedTrainings);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const weekDaysWithActive = useMemo(() => {
    return weekDays.map((day) => ({
      ...day,
      isActive: day.id === selectedDay,
    }));
  }, [selectedDay]);

  const currentTrainings = useMemo(() => {
    return trainings.filter((training: NTrainingPage.Training) =>
      training.week_days.includes(selectedDay)
    );
  }, [selectedDay, trainings]);

  const handleDaySelect = useCallback(async (dayId: number) => {
    setSelectedDay(dayId);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadTrainings();
      setTimeout(() => {
        loadCompletedRepetitions();
      }, 100);
    } catch (error) {
      // Erro silencioso
    } finally {
      setIsRefreshing(false);
    }
  }, [loadTrainings, loadCompletedRepetitions]);

  const handleExercisePress = useCallback(
    (exercise: NTrainingPage.TrainingExercise) => {
      const training = currentTrainings.find((t) =>
        t.exercises.some((e) => e.id === exercise.id)
      );

      const selectedDate = getDateForSelectedDay(selectedDay);

      const exerciseData = {
        id: exercise.exercise.id.toString(),
        trainingExerciseId: exercise.id.toString(),
        studentTrainingId: training?.id.toString() || "",
        name: exercise.exercise.name,
        series: exercise.sets,
        repetitions: exercise.repetitions,
        weight: exercise.load,
        restTime: exercise.rest,
        muscleGroups: exercise.exercise.muscles_worked,
        description: exercise.exercise.description,
        observations: exercise.notes,
        currentRepetition: exercise.completedSets || 0,
        selectedDate: selectedDate,
      };

      setSelectedTraining(exerciseData);
      router.push("/(auth)/students/training-details");
    },
    [router, currentTrainings, selectedDay, getDateForSelectedDay]
  );

  return {
    weekDays: weekDaysWithActive,
    selectedDay,
    trainings: currentTrainings,
    isLoading,
    isRefreshing,
    handleDaySelect,
    handleExercisePress,
    handleRefresh,
  };
};
