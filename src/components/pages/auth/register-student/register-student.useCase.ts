import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { registerStudentSchema } from "./register-student.schema";
import { NRegisterStudentPage } from "./register-student.types";

export const useRegisterStudent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NRegisterStudentPage.FormData>({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      frequency: "",
      gender: "",
      goal: "",
    },
  });

  const handleSubmit = useCallback(
    async (data: NRegisterStudentPage.FormData) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      console.log(data);
      router.back();
    },
    []
  );

  return { form, isLoading, handleSubmit: form.handleSubmit(handleSubmit) };
};
