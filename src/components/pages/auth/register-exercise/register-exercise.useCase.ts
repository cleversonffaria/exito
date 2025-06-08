import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { registerExerciseSchema } from "./register-exercise.schema";
import { NRegisterExercisePage } from "./register-exercise.types";

export const useRegisterExercise = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [muscleInputs, setMuscleInputs] = useState<string[]>([""]);

  const form = useForm<NRegisterExercisePage.FormData>({
    resolver: zodResolver(registerExerciseSchema),
    defaultValues: {
      name: "",
      thumbnail: "",
      muscleGroups: [],
      equipment: "",
      videoDemo: "",
    },
  });

  const handleAddMuscleInput = useCallback(() => {
    setMuscleInputs((prev) => [...prev, ""]);
  }, []);

  const handleRemoveMuscleInput = useCallback(
    (index: number) => {
      setMuscleInputs((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        const filteredMuscles = updated.filter(
          (muscle) => muscle.trim() !== ""
        );
        form.setValue("muscleGroups", filteredMuscles, {
          shouldValidate: true,
        });
        return updated;
      });
    },
    [form]
  );

  const handleMuscleInputChange = useCallback(
    (index: number, value: string) => {
      setMuscleInputs((prev) => {
        const updated = [...prev];
        updated[index] = value;
        const filteredMuscles = updated.filter(
          (muscle) => muscle.trim() !== ""
        );
        form.setValue("muscleGroups", filteredMuscles, {
          shouldValidate: true,
        });
        return updated;
      });
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (data: NRegisterExercisePage.FormData) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      console.log("Dados do exercício:", data);
      router.back();
    },
    []
  );

  return {
    form,
    isLoading,
    muscleInputs,
    handleAddMuscleInput,
    handleRemoveMuscleInput,
    handleMuscleInputChange,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
