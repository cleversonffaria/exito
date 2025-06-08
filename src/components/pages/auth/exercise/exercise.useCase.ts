import { exerciseService } from "@/services/exercise.service";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { NExerciseTrainingPage } from "./exercise.types";
import type { Exercise } from "@/types/database.types";

export const useExerciseSelection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

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
      image: exercise.image_url || undefined,
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
      router.push(`/(auth)/exercises/${exercise.id}` as Href);
    },
    []
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
