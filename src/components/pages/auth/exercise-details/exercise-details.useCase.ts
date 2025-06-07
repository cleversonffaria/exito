import { useNavigation } from "@react-navigation/native";
import { useExercise } from "@store/useExercise";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useExerciseDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { selectedExercise, completeRepetition, clearSelectedExercise } =
    useExercise();

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

  const handleCompleteRepetition = () => {
    completeRepetition();
    if (
      selectedExercise &&
      selectedExercise.currentRepetition + 1 >= selectedExercise.series
    ) {
      clearSelectedExercise();
      router.back();
    }
  };

  const handleFullscreenEnter = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenExit = () => {
    setIsFullscreen(false);
  };

  const remainingRepetitions = selectedExercise
    ? selectedExercise.series - selectedExercise.currentRepetition
    : 0;

  const exerciseInfoData = selectedExercise
    ? [
        { label: "Nome", value: selectedExercise.name },
        { label: "Série", value: selectedExercise.series.toString() },
        { label: "Repetições", value: selectedExercise.repetitions.toString() },
        { label: "Carga", value: `${selectedExercise.weight} KG` },
        { label: "Descanso", value: `${selectedExercise.restTime} segundos` },
      ]
    : [];

  const getVideoSource = () => {
    if (!selectedExercise?.videoUrl) return require("@assets/video/supino.mp4");

    return { uri: selectedExercise.videoUrl };
  };

  return {
    selectedExercise,
    remainingRepetitions,
    handleCompleteRepetition,
    getVideoSource,
    exerciseInfoData,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  };
};
