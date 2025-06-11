import { useTrainingDetails as useTrainingDetailsStore } from "@/store/useTrainingDetails";
import { trainingLogService } from "@/services/training-log.service";
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/useToast";
import { useMemo, useState, useCallback, useEffect } from "react";

export const useTrainingDetails = () => {
  const { selectedTraining, completeRepetition, updateCurrentRepetition } =
    useTrainingDetailsStore();
  const { user } = useAuth();
  const toast = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompletedRepetitions();
  }, [
    selectedTraining?.trainingExerciseId,
    selectedTraining?.studentTrainingId,
  ]);

  const loadCompletedRepetitions = useCallback(async () => {
    if (
      !selectedTraining?.trainingExerciseId ||
      !selectedTraining?.studentTrainingId
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const targetDate =
        selectedTraining.selectedDate || new Date().toISOString().split("T")[0];
      const result = await trainingLogService.getLogsByTraining(
        selectedTraining.studentTrainingId,
        targetDate
      );

      if (result.success && result.trainingLogs) {
        const relevantLogs = result.trainingLogs.filter(
          (log: any) =>
            String(log.training_exercise_id) ===
            String(selectedTraining.trainingExerciseId)
        );

        updateCurrentRepetition(relevantLogs.length);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedTraining?.trainingExerciseId,
    selectedTraining?.studentTrainingId,
    selectedTraining?.selectedDate,
    updateCurrentRepetition,
  ]);

  const hasVideo = useMemo(() => {
    return !!selectedTraining?.videoUrl;
  }, [selectedTraining?.videoUrl]);

  const getVideoSource = () => {
    if (selectedTraining?.videoUrl) {
      return { uri: selectedTraining.videoUrl };
    }
    return null;
  };

  const exerciseInfoData = useMemo(() => {
    if (!selectedTraining) return [];

    return [
      {
        label: "Exercício",
        value: selectedTraining.name,
      },
      {
        label: "Séries",
        value: selectedTraining.series.toString(),
      },
      {
        label: "Repetições",
        value: selectedTraining.repetitions.toString(),
      },
      {
        label: "Peso",
        value: `${selectedTraining.weight}kg`,
      },
      {
        label: "Descanso",
        value: `${selectedTraining.restTime}s`,
      },
    ];
  }, [selectedTraining]);

  const remainingRepetitions = useMemo(() => {
    if (!selectedTraining || isLoading) return 0;
    return Math.max(
      0,
      selectedTraining.repetitions - selectedTraining.currentRepetition
    );
  }, [selectedTraining, isLoading]);

  const handleCompleteRepetition = useCallback(async () => {
    if (!selectedTraining || !user?.id || isCompleting || isLoading) return;

    if (selectedTraining.currentRepetition >= selectedTraining.repetitions) {
      toast.error("Todas as repetições já foram completadas!");
      return;
    }

    setIsCompleting(true);

    try {
      completeRepetition();

      const logData = {
        studentTrainingId:
          selectedTraining.studentTrainingId || selectedTraining.id,
        exerciseId: selectedTraining.trainingExerciseId || selectedTraining.id,
        setNumber: selectedTraining.currentRepetition + 1,
        repsCompleted: selectedTraining.repetitions,
        weightUsed: selectedTraining.weight,
        customDate: selectedTraining.selectedDate,
      };

      const result = await trainingLogService.logCompletedSet(logData);

      if (result.success) {
        toast.success("Repetição concluída!");
        loadCompletedRepetitions();
      } else {
        toast.error(`Erro: ${result.error}`);
      }
    } catch (error) {
      toast.error("Erro ao registrar repetição");
    } finally {
      setTimeout(() => setIsCompleting(false), 500);
    }
  }, [selectedTraining, user?.id, completeRepetition, isCompleting, toast]);

  const handleFullscreenEnter = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenExit = () => {
    setIsFullscreen(false);
  };

  return {
    selectedTraining,
    hasVideo,
    getVideoSource,
    exerciseInfoData,
    remainingRepetitions,
    handleCompleteRepetition,
    isCompleting,
    isLoading,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  };
};
