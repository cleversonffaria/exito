import { exerciseService } from "@/services/exercise.service";
import { useSelectedExercise } from "@/store/useSelectedExercise";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NExerciseTrainingPage } from "./exercise-training.types";

export const useExerciseSelection = () => {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<NExerciseTrainingPage.Option[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { setSelectedExercise } = useSelectedExercise();

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const result = await exerciseService.getExercises();
      if (result.success && result.exercises) {
        const formattedExercises = result.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          category: exercise.muscle_groups.join(", "),
          image: exercise.image_url || undefined,
        }));
        setExercises(formattedExercises);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) {
      return exercises;
    }

    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, exercises]);

  const handleSelectExercise = useCallback(
    (exercise: NExerciseTrainingPage.Option) => {
      setSelectedExercise({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        image: exercise.image,
      });

      router.push(`/(auth)/students/register-training?studentId=${studentId}`);
    },
    [setSelectedExercise, studentId]
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredExercises,
    handleSelectExercise,
    loading,
  };
};
