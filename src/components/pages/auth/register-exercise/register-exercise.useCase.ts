import { useFileUpload } from "@/hooks/useFileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { registerExerciseSchema } from "./register-exercise.schema";
import { NRegisterExercisePage } from "./register-exercise.types";

export const useRegisterExercise = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [muscleInputs, setMuscleInputs] = useState<string[]>([""]);
  const { pickImage, pickVideo, isUploading } = useFileUpload();

  const form = useForm<NRegisterExercisePage.FormData>({
    resolver: zodResolver(registerExerciseSchema),
    defaultValues: {
      name: "",
      thumbnail: null,
      muscleGroups: [],
      equipment: "",
      videoDemo: null,
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

  const handleThumbnailUpload = useCallback(async () => {
    const result = await pickImage();
    if (result) {
      form.setValue("thumbnail", result, { shouldValidate: true });
    }
  }, [pickImage, form]);

  const handleVideoUpload = useCallback(async () => {
    const result = await pickVideo();
    if (result) {
      form.setValue("videoDemo", result, { shouldValidate: true });
    }
  }, [pickVideo, form]);

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
    isLoading: isLoading || isUploading,
    muscleInputs,
    handleAddMuscleInput,
    handleRemoveMuscleInput,
    handleMuscleInputChange,
    handleThumbnailUpload,
    handleVideoUpload,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
