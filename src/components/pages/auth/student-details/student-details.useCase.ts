import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";

import { ROLE_MAP } from "@/constants/profile";
import { useModal } from "@/store/useModal";
import { formatWeekDays, normalizeWeekDays } from "@utils/week-days.utils";
import { maskPhone } from "@utils/phone-mask.utils";
import { studentService } from "@/services/student.service";
import { trainingService } from "@/services/training.service";
import { useTrainingExercises } from "@/store/useTrainingExercises";
import { useTrainingForm } from "@/store/useTrainingForm";
import { NStudentDetailsPage } from "./student-details.types";
import { useToast } from "@/hooks/useToast";

export const useStudentDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] =
    useState<NStudentDetailsPage.StudentDetailsWithFormattedTrainings | null>(
      null
    );

  const { id } = useLocalSearchParams<{ id: string }>();
  const modal = useModal();
  const toast = useToast();
  const { clearExercises } = useTrainingExercises();
  const { clearForm } = useTrainingForm();

  const loadStudent = useCallback(async () => {
    if (!id) {
      toast.error("ID do aluno não encontrado");
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      const result = await studentService.getStudentById(id);

      if (!result.success || !result.student) {
        toast.error("Erro ao carregar dados do aluno", {
          description: result.error || "Tente novamente",
        });
        router.back();
        return;
      }

      const studentData = result.student;

      const trainingsResult = await trainingService.getStudentTrainings(
        studentData.id!
      );
      let formattedTrainings: NStudentDetailsPage.TrainingWithDays[] = [];

      if (trainingsResult.success && trainingsResult.studentTrainings) {
        formattedTrainings = trainingsResult.studentTrainings.map(
          (studentTraining: any) => {
            const weekDaysNumbers = normalizeWeekDays(
              studentTraining.week_days
            );

            const training = studentTraining.trainings as any;
            const exercises = training?.training_exercises || [];

            return {
              id: studentTraining.id,
              student_id: studentData.id!,
              training_id: studentTraining.training_id,
              name: training?.name || "Treino sem nome",
              exercises: exercises.map((te: any) => ({
                id: te.id,
                exercise: te.exercises,
                sets: te.sets,
                repetitions: te.repetitions,
                load: te.load,
                rest: te.rest_seconds,
                notes: te.notes,
              })),
              week_days: weekDaysNumbers,
              days: formatWeekDays(weekDaysNumbers),
            };
          }
        );
      }

      const formattedStudent: NStudentDetailsPage.StudentDetailsWithFormattedTrainings =
        {
          id: studentData.id!,
          name: studentData.name || "",
          gender: studentData.gender as "Masculino" | "Feminino" | "Outros",
          avatar: studentData.avatar_url || "",
          email: studentData.email || "",
          phone: maskPhone(studentData.phone || ""),
          age: studentData.age?.toString() || "",
          goal: studentData.goal || "",
          startDate:
            studentData.start_date ||
            new Date().toLocaleDateString("pt-BR", {
              month: "2-digit",
              year: "numeric",
            }),
          role: ROLE_MAP["student"],
          trainings: formattedTrainings,
        };

      setStudent(formattedStudent);
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente mais tarde",
      });
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadStudent();
      }
    }, [id, loadStudent])
  );

  const handleAddTraining = useCallback(() => {
    if (!id) return;
    clearExercises();
    clearForm();
    router.push(`/(auth)/students/training?studentId=${id}`);
  }, [id, clearExercises, clearForm]);

  const handleRemoveTraining = useCallback(
    async (trainingId: string) => {
      modal.show({
        title: "Remover treino",
        description: "Tem certeza que deseja remover este treino?",
        actions: [
          {
            title: "Excluir",
            variant: "error",
            className: "!w-[200px] mx-auto",
            onPress: async () => {
              try {
                const result = await trainingService.deactivateStudentTraining(
                  trainingId
                );
                if (result.success) {
                  toast.success("Treino removido com sucesso");
                  loadStudent();
                } else {
                  toast.error("Erro ao remover treino", {
                    description: result.error,
                  });
                }
              } catch (error) {
                toast.error("Erro ao remover treino");
              }
            },
          },
          {
            title: "Cancelar",
            variant: "none",
            onPress: () => {},
          },
        ],
      });
    },
    [modal, loadStudent]
  );

  const goBack = useCallback(() => {
    router.back();
  }, []);

  if (!student) {
    return {
      student: null,
      isLoading,
      handleAddTraining,
      handleRemoveTraining,
      goBack,
      refreshStudent: loadStudent,
    };
  }

  return {
    student,
    isLoading,
    handleAddTraining,
    handleRemoveTraining,
    goBack,
    refreshStudent: loadStudent,
  };
};
