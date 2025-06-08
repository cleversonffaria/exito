import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { NExerciseTrainingPage } from "./exercise-training.types";

const mockExercises: NExerciseTrainingPage.Option[] = [
  {
    id: "1",
    name: "Barra",
    category: "Ombros, Tríceps",
    image: "https://picsum.photos/150",
  },
  {
    id: "2",
    name: "Supino",
    category: "Peito, Tríceps",
  },
  {
    id: "3",
    name: "Rosca Bíceps",
    category: "Bíceps",
    image: "https://picsum.photos/120",
  },
  {
    id: "4",
    name: "Agachamentos",
    category: "Pernas, Glúteos",
    image: "https://picsum.photos/230",
  },
  {
    id: "5",
    name: "Barra Fixa",
    category: "Costas, Bíceps, Antebraços",
    image: "https://picsum.photos/260",
  },
];

export const useExerciseSelection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockExercises;
    }

    return mockExercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectExercise = useCallback(
    (exercise: NExerciseTrainingPage.Option) => {
      console.log("Exercício selecionado:", exercise);
      router.back();
    },
    []
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredExercises,
    handleSelectExercise,
  };
};
