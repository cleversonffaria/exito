import { useToast } from "@/hooks/useToast";
import { trainingService } from "@/services/training.service";
import { useAuth } from "@/store/useAuth";
import { useTrainingExercises } from "@/store/useTrainingExercises";
import { useTrainingForm } from "@/store/useTrainingForm";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

export const useStudentTraining = () => {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { exercises, clearExercises, removeExercise } = useTrainingExercises();
  const { trainingName, selectedDays, setTrainingName, toggleDay, clearForm } =
    useTrainingForm();
  const toast = useToast();

  const selectedExercises = exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    series: `${exercise.series} x ${exercise.repetitions}`,
    isSelected: true,
  }));

  const handleToggleDay = useCallback(
    (dayId: number) => {
      toggleDay(dayId);
    },
    [toggleDay]
  );

  const handleToggleExercise = useCallback((exerciseId: string) => {}, []);

  const handleAddExercise = useCallback(() => {
    if (!studentId) return;
    router.push(`/(auth)/students/exercise-training?studentId=${studentId}`);
  }, [studentId]);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    removeExercise(exerciseId);
  }, []);

  const handleSaveTraining = useCallback(async () => {
    if (!studentId) {
      toast.error("ID do aluno não encontrado");
      return;
    }

    if (!trainingName.trim()) {
      toast.error("Nome do treino é obrigatório");
      return;
    }

    const selectedDayIds = selectedDays
      .filter((day) => day.isSelected)
      .map((day) => day.id);

    if (selectedDayIds.length === 0) {
      toast.error("Selecione pelo menos um dia da semana");
      return;
    }

    if (exercises.length === 0) {
      toast.error("Adicione pelo menos um exercício ao treino");
      return;
    }

    setIsLoading(true);

    try {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const trainingData = {
        name: trainingName,
        teacherId: user.id,
        exercises: exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.series,
          repetitions: exercise.repetitions,
          load: exercise.load,
          restSeconds: exercise.restTime,
          orderIndex: exercise.orderIndex,
        })),
      };

      const createResult = await trainingService.createTraining(trainingData);

      if (!createResult.success || !createResult.training) {
        throw new Error(createResult.error || "Erro ao criar treino");
      }

      const weekDaysNumbers = selectedDayIds;

      const assignResult = await trainingService.assignTrainingToStudent(
        studentId,
        createResult.training.id,
        weekDaysNumbers,
        new Date().toISOString().split("T")[0]
      );

      if (!assignResult.success) {
        throw new Error(
          assignResult.error || "Erro ao atribuir treino ao aluno"
        );
      }

      clearExercises();
      clearForm();
      toast.success("Treino salvo com sucesso!");
      router.back();
    } catch (error) {
      toast.error("Falha ao salvar treino. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [studentId, trainingName, selectedDays, exercises, clearExercises]);

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
