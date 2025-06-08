import { useFileUpload } from "@/hooks/useFileUpload";
import { exerciseService } from "@/services/exercise.service";
import { storageService } from "@/services/storage.service";
import { useAuth } from "@/store/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { registerExerciseSchema } from "./register-exercise.schema";
import { NRegisterExercisePage } from "./register-exercise.types";
import { useToast } from "@/hooks/useToast";

export const useRegisterExercise = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [muscleInputs, setMuscleInputs] = useState<string[]>([""]);
  const { pickImage, pickVideo, isUploading } = useFileUpload();
  const { user } = useAuth();
  const toast = useToast();

  const form = useForm<NRegisterExercisePage.FormData>({
    resolver: zodResolver(registerExerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: null,
      muscleGroups: [],
      equipment: "",
      difficulty: "beginner",
      videoDemo: null,
    },
    mode: "onChange",
  });

  const handleAddMuscleInput = useCallback(() => {
    setMuscleInputs((prev) => [...prev, ""]);
  }, []);

  console.log(form.formState.errors);

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
      console.log("data", data);
      setIsLoading(true);

      try {
        if (!user) {
          toast.error("Usuário não autenticado");
          setIsLoading(false);
          return;
        }

        console.log(data);

        if (user.role !== "teacher") {
          toast.error("Apenas professores podem cadastrar exercícios");
          setIsLoading(false);
          return;
        }

        const validMuscleGroups = muscleInputs.filter(
          (muscle) => muscle.trim() !== ""
        );

        if (validMuscleGroups.length === 0) {
          toast.error("Adicione pelo menos um grupo muscular");
          setIsLoading(false);
          return;
        }

        if (!data.thumbnail) {
          toast.error("Imagem é obrigatória");
          setIsLoading(false);
          return;
        }

        let imageUrl: string | null = null;
        let videoUrl: string | null = null;

        const imageUpload = await storageService.uploadImage(data.thumbnail);
        if (!imageUpload.success) {
          toast.error(imageUpload.error || "Erro ao fazer upload da imagem");
          setIsLoading(false);
          return;
        }
        imageUrl = imageUpload.url!;

        if (data.videoDemo) {
          const videoUpload = await storageService.uploadVideo(data.videoDemo);
          if (!videoUpload.success) {
            toast.error(videoUpload.error || "Erro ao fazer upload do vídeo");
            setIsLoading(false);
            return;
          }
          videoUrl = videoUpload.url!;
        }

        const exerciseData = {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          muscle_groups: validMuscleGroups,
          equipment: data.equipment.trim(),
          difficulty: data.difficulty,
          image_url: imageUrl,
          video_url: videoUrl,
          created_by: user.id,
        };

        const result = await exerciseService.createExercise(exerciseData);

        if (result.success) {
          toast.success("Exercício cadastrado com sucesso!");
          form.reset();
          setMuscleInputs([""]);
          router.back();
        } else {
          toast.error(result.error || "Erro ao cadastrar exercício");
        }
      } catch (error) {
        toast.error("Erro inesperado ao cadastrar exercício");
      } finally {
        setIsLoading(false);
      }
    },
    [form, router, muscleInputs, user, toast]
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
