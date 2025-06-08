import { exerciseService } from "@/services/exercise.service";
import { useNavigation } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import type { Exercise } from "@/types/database.types";
import { DIFFICULTY_OPTIONS } from "@/constants/exercise";

export const useExerciseDetailsPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  };
};
