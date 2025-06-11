import { exerciseService } from "@/services/exercise.service";
import { useNavigation } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import type { Exercise } from "@/types/database.types";
import { DIFFICULTY_OPTIONS } from "@/constants/exercise";
import { useAuth } from "@/store/useAuth";
import { useModal } from "@/store/useModal";
import { useToast } from "@/hooks/useToast";

export const useExerciseDetailsPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const modal = useModal();
  const toast = useToast();

  const canDelete = user?.role === "teacher";

  const fetchExercise = useCallback(async () => {
    if (!id) {
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      const result = await exerciseService.getExerciseById(id);
      if (result.success && result.exercise) {
        setExercise(result.exercise);
        navigation.setOptions({
          title: result.exercise.name,
        });
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Erro ao buscar exercício:", error);
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id, router, navigation]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  const handleFullscreenEnter = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenExit = () => {
    setIsFullscreen(false);
  };

  const getDifficultyLabel = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);
    return option?.label || difficulty;
  };

  const exerciseInfoData = exercise
    ? [
        { label: "Nome", value: exercise.name },
        { label: "Equipamento", value: exercise.equipment },
        {
          label: "Dificuldade",
          value: getDifficultyLabel(exercise.difficulty),
        },
      ]
    : [];

  const getVideoSource = () => {
    if (!exercise?.video_url) return null;
    return { uri: exercise.video_url };
  };

  const getImageSource = () => {
    if (!exercise?.image_url) return null;
    return { uri: exercise.image_url };
  };

  const deleteExercise = async () => {
    if (!canDelete)
      return toast.error("Apenas professores podem excluir exercícios");

    setIsDeleting(true);
    try {
      const result = await exerciseService.deleteExercise(id);

      if (result.success) {
        toast.success("Exercício excluído com sucesso");
        router.back();
      } else {
        toast.error(result.error || "Erro ao excluir exercício");
      }
    } catch (error) {
      toast.error("Erro ao excluir exercício");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteExercise = useCallback(async () => {
    modal.show({
      description: "Tem certeza que deseja excluir este exercício?",
      actions: [
        {
          title: "Excluir",
          variant: "error",
          className: "!w-[200px] mx-auto",
          onPress: deleteExercise,
        },
        {
          title: "Cancelar",
          variant: "none",
          onPress: () => null,
        },
      ],
    });
  }, [id, user, router]);

  return {
    exercise,
    isLoading,
    exerciseInfoData,
    getVideoSource,
    getImageSource,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
    getDifficultyLabel,
    handleDeleteExercise,
    isDeleting,
    canDelete,
  };
};
