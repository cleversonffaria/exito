import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState, useEffect } from "react";

import { ROLE_MAP } from "@/constants/profile";
import { useModal } from "@/store/useModal";
import { formatWeekDays } from "@utils/dates.utils";
import { maskPhone } from "@utils/phone-mask.utils";
import { studentService } from "@/services/student.service";
import { toast } from "sonner-native";
import { NStudentDetailsPage } from "./student-details.types";

export const useStudentDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] =
    useState<NStudentDetailsPage.StudentDetailsWithFormattedTrainings | null>(
      null
    );

  const { id } = useLocalSearchParams<{ id: string }>();
  const modal = useModal();

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
          trainings: [], // Por enquanto vazio, como solicitado
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

  const handleAddTraining = useCallback(() => {
    router.push("/(auth)/students/training");
  }, []);

  const handleRemoveTraining = useCallback((trainingId: string) => {
    console.log("Remover treino:", trainingId);
    modal.show({
      title: "Remover treino",
      description: "Tem certeza que deseja remover este treino?",
      actions: [
        {
          title: "Excluir",
          variant: "error",
          className: "!w-[200px] mx-auto",
          onPress: () => {
            console.log("Treino removido");
          },
        },
        {
          title: "Cancelar",
          variant: "none",
          onPress: () => {
            console.log("Treino removido");
          },
        },
      ],
    });
  }, []);

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
    };
  }

  return {
    student,
    isLoading,
    handleAddTraining,
    handleRemoveTraining,
    goBack,
  };
};
