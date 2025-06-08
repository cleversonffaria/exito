import { router } from "expo-router";
import { useState } from "react";
import { NStudentsPage } from "./students.types";

export const useStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const studentsData: NStudentsPage.Student[] = [
    {
      id: "1",
      name: "John Silva",
      gender: "Masculino",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "2",
      name: "Jone Berk",
      gender: "Outros",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c1fd?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "3",
      name: "Livia Coelho",
      gender: "Feminino",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    },
  ];

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewStudent = () => {
    router.push("/(auth)/students/register");
  };

  return {
    students: filteredStudents,
    searchQuery,
    setSearchQuery,
    addNewStudent,
  };
};
