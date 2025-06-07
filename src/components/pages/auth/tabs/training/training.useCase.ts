import { useExercise } from "@store/useExercise";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { NTrainingPage } from "./training.types";

export const useTraining = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setSelectedExercise } = useExercise();

  const weekDays: NTrainingPage.WeekDay[] = [
    { id: 1, name: "Segunda", shortName: "Seg", isActive: false },
    { id: 2, name: "Terça", shortName: "Ter", isActive: false },
    { id: 3, name: "Quarta", shortName: "Qua", isActive: false },
    { id: 4, name: "Quinta", shortName: "Qui", isActive: false },
    { id: 5, name: "Sexta", shortName: "Sex", isActive: false },
    { id: 6, name: "Sábado", shortName: "Sab", isActive: false },
    { id: 7, name: "Domingo", shortName: "Dom", isActive: false },
  ];

  const mockTrainings: NTrainingPage.Training[] = [
    {
      name: "Treino Full Body",
      exercises: [
        {
          exercise: {
            id: 1,
            name: "Supino",
            muscles_worked: ["Peitoral maior", "Tríceps"],
            equipment: "Barra",
            execution_description: "Deite no banco, segure a barra...",
          },
          sets: 5,
          repetitions: 10,
          load: 60,
          rest: 90,
          notes: "Movimento controlado",
        },
        {
          exercise: {
            id: 2,
            name: "Triceps",
            muscles_worked: ["Tríceps"],
            equipment: "Halteres",
            execution_description: "Movimento de extensão do tríceps...",
          },
          sets: 2,
          repetitions: 10,
          load: 15,
          rest: 60,
          notes: "Foco na contração",
        },
      ],
      week_days: [1, 3, 5],
    },
    {
      name: "Treino de Resistência Muscular",
      exercises: [
        {
          exercise: {
            id: 3,
            name: "Supino",
            muscles_worked: ["Peitoral maior", "Tríceps"],
            equipment: "Barra",
            execution_description: "Deite no banco, segure a barra...",
          },
          sets: 5,
          repetitions: 10,
          load: 60,
          rest: 90,
          notes: "Movimento controlado",
        },
        {
          exercise: {
            id: 4,
            name: "Triceps",
            muscles_worked: ["Tríceps"],
            equipment: "Halteres",
            execution_description: "Movimento de extensão do tríceps...",
          },
          sets: 2,
          repetitions: 10,
          load: 15,
          rest: 60,
          notes: "Foco na contração",
        },
      ],
      week_days: [1, 4],
    },
  ];

  const weekDaysWithActive = useMemo(() => {
    return weekDays.map((day) => ({
      ...day,
      isActive: day.id === selectedDay,
    }));
  }, [selectedDay]);

  const currentTrainings = useMemo(() => {
    return mockTrainings.filter((training) =>
      training.week_days.includes(selectedDay)
    );
  }, [selectedDay]);

  const handleDaySelect = useCallback(async (dayId: number) => {
    setSelectedDay(dayId);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsLoading(false);
  }, []);

  const handleExercisePress = useCallback(
    (exercise: NTrainingPage.TrainingExercise) => {
      const exerciseData = {
        id: exercise.exercise.id.toString(),
        name: exercise.exercise.name,
        series: exercise.sets,
        repetitions: exercise.repetitions,
        weight: exercise.load,
        restTime: exercise.rest,
        muscleGroups: exercise.exercise.muscles_worked,
        description: exercise.exercise.execution_description,
        observations: exercise.notes,
        currentRepetition: 0,
      };

      setSelectedExercise(exerciseData);
      router.push("/(auth)/exercise-details");
    },
    [router, setSelectedExercise]
  );

  return {
    weekDays: weekDaysWithActive,
    selectedDay,
    trainings: currentTrainings,
    isLoading,
    handleDaySelect,
    handleExercisePress,
  };
};
