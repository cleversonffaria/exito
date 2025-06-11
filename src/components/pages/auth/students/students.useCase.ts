import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { studentService } from "@/services/student.service";
import { NStudentsPage } from "./students.types";
import { useToast } from "@/hooks/useToast";

export const useStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<NStudentsPage.Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await studentService.getStudents();

      if (!result.success) {
        toast.error("Erro ao carregar alunos", {
          description: result.error || "Tente novamente",
        });
        return;
      }

      const formattedStudents: NStudentsPage.Student[] =
        result.students?.map((student) => ({
          id: student.id!,
          name: student.name || "",
          gender: student.gender as "Masculino" | "Feminino" | "Outros",
          avatar: student.avatar_url || "",
        })) || [];

      setStudents(formattedStudents);
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [loadStudents])
  );

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewStudent = () => {
    router.push("/(auth)/students/register");
  };

  const handleStudentPress = (studentId: string) => {
    router.push({
      pathname: "/(auth)/students/details",
      params: { id: studentId },
    });
  };

  return {
    students: filteredStudents,
    isLoading,
    searchQuery,
    setSearchQuery,
    addNewStudent,
    handleStudentPress,
    refreshStudents: loadStudents,
  };
};
