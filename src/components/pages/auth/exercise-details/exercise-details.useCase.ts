import { useExerciseDetails } from "@/store/useExerciseDetails";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useExerciseDetailsPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { selectedExercise, clearSelectedExercise } = useExerciseDetails();

  useEffect(() => {
    if (!selectedExercise) {
      router.back();
    }
  }, [selectedExercise, router]);

  useEffect(() => {
    if (selectedExercise) {
      navigation.setOptions({
        title: selectedExercise.name,
      });
    }
  }, [selectedExercise, navigation]);

  const handleFullscreenEnter = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenExit = () => {
    setIsFullscreen(false);
  };

  const exerciseInfoData = selectedExercise
    ? [
        { label: "Nome", value: selectedExercise.name },
        { label: "Categoria", value: selectedExercise.category },
        { label: "Equipamento", value: selectedExercise.equipment },
      ]
    : [];

  const getVideoSource = () => {
    if (!selectedExercise?.videoUrl) return require("@assets/video/supino.mp4");

    return { uri: selectedExercise.videoUrl };
  };

  const getImageSource = () => {
    if (!selectedExercise?.imageUrl) return null;

    return { uri: selectedExercise.imageUrl };
  };

  return {
    selectedExercise,
    exerciseInfoData,
    getVideoSource,
    getImageSource,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
    clearSelectedExercise,
  };
};
