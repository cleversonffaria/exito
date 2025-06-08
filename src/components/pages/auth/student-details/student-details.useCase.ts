import { router } from "expo-router";
import { useCallback, useState } from "react";

import { ROLE_MAP } from "@/constants/profile";
import { useModal } from "@/store/useModal";
import { formatWeekDays } from "@utils/dates.utils";
import { maskPhone } from "@utils/phone-mask.utils";
import { NStudentDetailsPage } from "./student-details.types";

export const useStudentDetails = () => {
  const [isLoading, setIsLoading] = useState(false);

  const modal = useModal();

  const studentData: NStudentDetailsPage.StudentDetails = {
    id: "1",
    name: "John Doe",
    gender: "Masculino",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "exemple@gmail.com",
    phone: maskPhone("2299999-9999"),
    age: "27",
    goal: "Emagrecimento",
    startDate: "06/2024",
    role: "student",
    trainings: [
      {
        id: "1",
        student_id: 101,
        training_id: 1,
        name: "Treino Full Body",
        exercises: [
          {
            exercise_id: 1,
            sets: 4,
            repetitions: 10,
            load: "60kg",
            rest: "90 segundos",
            notes: "Descer até 90°",
          },
          {
            exercise_id: 2,
            sets: 3,
            repetitions: 12,
            load: "40kg",
            rest: "60 segundos",
            notes: "Movimento controlado",
          },
          {
            exercise_id: 3,
            sets: 3,
            repetitions: 15,
            load: "20kg",
            rest: "45 segundos",
            notes: "Foco na contração",
          },
        ],
        week_days: [1, 3, 5],
      },
    ],
  };

  const trainingsWithFormattedDays: NStudentDetailsPage.TrainingWithDays[] =
    studentData.trainings.map((training) => ({
      ...training,
      days: formatWeekDays(training.week_days),
    }));

  const handleAddTraining = useCallback(() => {
    console.log("Adicionar treino para aluno:", studentData.name);
  }, [studentData.name]);

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

  const studentWithFormattedTrainings: NStudentDetailsPage.StudentDetailsWithFormattedTrainings =
    {
      ...studentData,
      role: ROLE_MAP[studentData.role],
      trainings: trainingsWithFormattedDays,
    };

  return {
    student: studentWithFormattedTrainings,
    isLoading,
    handleAddTraining,
    handleRemoveTraining,
    goBack,
  };
};
