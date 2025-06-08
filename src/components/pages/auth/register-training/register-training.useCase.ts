import { useSelectedExercise } from "@/store/useSelectedExercise";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { registerTrainingSchema } from "./register-training.schema";
import { NRegisterTrainingPage } from "./register-training.types";

export const useRegisterTraining = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedExercise, clearSelectedExercise } = useSelectedExercise();

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

  const handleSubmit = useCallback(
    async (data: NRegisterTrainingPage.FormData) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      console.log("Dados do treino:", { ...data, selectedExercise });
      clearSelectedExercise();
      router.back();
    },
    [selectedExercise, clearSelectedExercise]
  );

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
    selectedExercise,
  };
};
