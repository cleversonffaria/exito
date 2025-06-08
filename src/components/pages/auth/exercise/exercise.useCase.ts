import { useExerciseDetails } from "@/store/useExerciseDetails";
import { useSelectedExercise } from "@/store/useSelectedExercise";
import { exerciseService } from "@/services/exercise.service";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { NExerciseTrainingPage } from "./exercise.types";
import type { Exercise } from "@/types/database.types";

export const useExerciseSelection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedExercise } = useSelectedExercise();
  const { setSelectedExercise: setExerciseDetails } = useExerciseDetails();

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const result = await exerciseService.getExercises();
      if (result.success && result.exercises) {
        setExercises(result.exercises);
      }
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [fetchExercises])
  );

  const filteredExercises: NExerciseTrainingPage.Option[] = useMemo(() => {
    const exerciseOptions = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.muscle_groups.join(", "),
      image: exercise.instructions || undefined,
    }));

    if (!searchQuery.trim()) {
      return exerciseOptions;
    }

    return exerciseOptions.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exercises, searchQuery]);

  const handleViewExerciseDetails = useCallback(
    (exercise: NExerciseTrainingPage.Option) => {
      setExerciseDetails({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        muscleGroups: exercise.category.split(", "),
        equipment: "Equipamento padrão",
        description: `Descrição detalhada`,
        videoUrl: require("@assets/video/supino.mp4"),
        imageUrl: exercise.image,
      });

      router.push("/(auth)/exercises/details");
    },
    [setExerciseDetails]
  );

  const addNewExercise = () => {
    router.push("/(auth)/exercises/register");
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredExercises,
    loading,
    handleViewExerciseDetails,
    addNewExercise,
  };
};
