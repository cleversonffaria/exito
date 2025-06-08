import { router } from "expo-router";
import { useCallback, useState } from "react";
import { NStudentTrainingPage } from "./student-training.types";

export const useStudentTraining = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trainingName, setTrainingName] = useState("");

  const weekDays: NStudentTrainingPage.WeekDay[] = [
    { id: 1, name: "Seg", isSelected: false },
    { id: 2, name: "Ter", isSelected: true },
    { id: 3, name: "Qua", isSelected: true },
    { id: 4, name: "Qui", isSelected: false },
    { id: 5, name: "Sex", isSelected: false },
    { id: 6, name: "Sáb", isSelected: false },
    { id: 7, name: "Dom", isSelected: false },
  ];

  const exercises: NStudentTrainingPage.Exercise[] = [
    { id: "1", name: "Tríceps", series: "2 x 10", isSelected: true },
    { id: "2", name: "Supino", series: "2 x 10", isSelected: true },
    { id: "3", name: "Agachamento", series: "3 x 12", isSelected: false },
    { id: "4", name: "Rosca Direta", series: "3 x 15", isSelected: false },
  ];

  const [selectedDays, setSelectedDays] =
    useState<NStudentTrainingPage.WeekDay[]>(weekDays);
  const [selectedExercises, setSelectedExercises] =
    useState<NStudentTrainingPage.Exercise[]>(exercises);

  const handleToggleDay = useCallback((dayId: number) => {
    setSelectedDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, isSelected: !day.isSelected } : day
      )
    );
  }, []);

  const handleToggleExercise = useCallback((exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, isSelected: !exercise.isSelected }
          : exercise
      )
    );
  }, []);

  const handleAddExercise = useCallback(() => {
    router.push("/(auth)/students/exercise-training");
  }, []);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.filter((exercise) => exercise.id !== exerciseId)
    );
  }, []);

  const handleSaveTraining = useCallback(() => {
    const selectedDayIds = selectedDays
      .filter((day) => day.isSelected)
      .map((day) => day.id);
    const selectedExerciseIds = selectedExercises
      .filter((ex) => ex.isSelected)
      .map((ex) => ex.id);

    const trainingData: NStudentTrainingPage.TrainingForm = {
      name: trainingName,
      selectedDays: selectedDayIds,
      selectedExercises: selectedExerciseIds,
    };

    console.log("Salvar treino:", trainingData);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1000);
  }, [trainingName, selectedDays, selectedExercises]);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  return {
    trainingName,
    setTrainingName,
    selectedDays,
    selectedExercises,
    isLoading,
    handleToggleDay,
    handleToggleExercise,
    handleAddExercise,
    handleRemoveExercise,
    handleSaveTraining,
    goBack,
  };
};
