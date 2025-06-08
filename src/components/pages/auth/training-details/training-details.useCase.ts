import { useTrainingDetails as useTrainingDetailsStore } from "@/store/useTrainingDetails";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useTrainingDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { selectedTraining, completeRepetition, clearSelectedTraining } =
    useTrainingDetailsStore();

  useEffect(() => {
    if (!selectedTraining) {
      router.back();
    }
  }, [selectedTraining, router]);

  useEffect(() => {
    if (selectedTraining) {
      navigation.setOptions({
        title: selectedTraining.name,
      });
    }
  }, [selectedTraining, navigation]);

  const handleCompleteRepetition = () => {
    completeRepetition();
    if (
      selectedTraining &&
      selectedTraining.currentRepetition + 1 >= selectedTraining.series
    ) {
      clearSelectedTraining();
      router.back();
    }
  };

  const handleFullscreenEnter = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenExit = () => {
    setIsFullscreen(false);
  };

  const remainingRepetitions = selectedTraining
    ? selectedTraining.series - selectedTraining.currentRepetition
    : 0;

  const exerciseInfoData = selectedTraining
    ? [
        { label: "Nome", value: selectedTraining.name },
        { label: "Série", value: selectedTraining.series.toString() },
        { label: "Repetições", value: selectedTraining.repetitions.toString() },
        { label: "Carga", value: `${selectedTraining.weight} KG` },
        { label: "Descanso", value: `${selectedTraining.restTime} segundos` },
      ]
    : [];

  const getVideoSource = () => {
    if (!selectedTraining?.videoUrl) return require("@assets/video/supino.mp4");

    return { uri: selectedTraining.videoUrl };
  };

  return {
    selectedTraining,
    remainingRepetitions,
    handleCompleteRepetition,
    getVideoSource,
    exerciseInfoData,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  };
};
