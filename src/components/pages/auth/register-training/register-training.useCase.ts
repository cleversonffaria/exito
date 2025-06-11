import { useSelectedExercise } from "@/store/useSelectedExercise";
import { useTrainingExercises } from "@/store/useTrainingExercises";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { registerTrainingSchema } from "./register-training.schema";
import { NRegisterTrainingPage } from "./register-training.types";

export const useRegisterTraining = () => {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedExercise, clearSelectedExercise } = useSelectedExercise();
  const { addExercise, exercises } = useTrainingExercises();

  const form = useForm<NRegisterTrainingPage.FormData>({
    resolver: zodResolver(registerTrainingSchema),
    defaultValues: {
      exercise: {
        name: selectedExercise?.name || "",
        category: selectedExercise?.category || "",
      },
      series: "",
      repetitions: "",
      load: "",
      restTime: "",
      observations: "",
    },
  });

  useEffect(() => {
    if (selectedExercise) {
      form.setValue("exercise.name", selectedExercise.name);
      form.setValue("exercise.category", selectedExercise.category);
    }
  }, [selectedExercise, form]);

  const handleSubmit = useCallback(
    async (data: NRegisterTrainingPage.FormData) => {
      if (!selectedExercise) return;

      setIsLoading(true);

      try {
        const exerciseData = {
          id: `${Date.now()}-${Math.random()}`,
          exerciseId: selectedExercise.id,
          name: selectedExercise.name,
          category: selectedExercise.category,
          series: parseInt(data.series) || 0,
          repetitions: parseInt(data.repetitions) || 0,
          load: parseFloat(data.load) || 0,
          restTime: parseInt(data.restTime) || 0,
          observations: data.observations,
          orderIndex: exercises.length,
        };

        addExercise(exerciseData);
        clearSelectedExercise();
        router.dismissAll();
        router.push(`/(auth)/students/training?studentId=${studentId}`);
      } catch (error) {
        console.error("Erro ao adicionar exercício:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedExercise, clearSelectedExercise, addExercise, exercises.length]
  );

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
    selectedExercise,
  };
};
