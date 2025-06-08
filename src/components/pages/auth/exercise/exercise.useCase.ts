import { useExerciseDetails } from "@/store/useExerciseDetails";
import { useSelectedExercise } from "@/store/useSelectedExercise";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { NExerciseTrainingPage } from "./exercise.types";

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
  const { setSelectedExercise } = useSelectedExercise();
  const { setSelectedExercise: setExerciseDetails } = useExerciseDetails();

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

  const handleViewExerciseDetails = useCallback(
    (exercise: NExerciseTrainingPage.Option) => {
      setExerciseDetails({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        muscleGroups: exercise.category.split(", "),
        equipment: "Equipamento padrão",
        description: `Descrição detalhada do exercício ${exercise.name}. Este exercício trabalha principalmente os músculos: ${exercise.category}.`,
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
    handleViewExerciseDetails,
    addNewExercise,
  };
};
