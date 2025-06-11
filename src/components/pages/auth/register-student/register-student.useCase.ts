import { studentService } from "@/services/student.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useFileUpload } from "@/hooks/useFileUpload";
import { registerStudentSchema } from "./register-student.schema";
import { NRegisterStudentPage } from "./register-student.types";
import { useToast } from "@/hooks/useToast";

export const useRegisterStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isUploading, pickImage } = useFileUpload();
  const toast = useToast();

  const form = useForm<NRegisterStudentPage.FormData>({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "" as any,
      goal: "",
      avatar: null,
    },
  });

  const handleSelectAvatar = useCallback(async () => {
    const result = await pickImage();
    if (result) {
      form.setValue("avatar", result, { shouldValidate: true });
    }
  }, [pickImage, form]);

  const handleSubmit = useCallback(
    async (data: NRegisterStudentPage.FormData) => {
      setIsLoading(true);

      try {
        const result = await studentService.createStudent({
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          age: parseInt(data.age, 10),
          gender: data.gender as "Masculino" | "Feminino" | "Outros",
          goal: data.goal.trim(),
          avatar: data.avatar || undefined,
        });

        if (!result.success) {
          toast.error("Erro ao cadastrar aluno", {
            description: result.error || "Tente novamente",
          });
          return;
        }

        toast.success("Aluno cadastrado com sucesso!", {
          description: `Email de ativação enviado para ${data.email}`,
        });

        form.reset();
        router.back();
      } catch (error) {
        toast.error("Erro inesperado", {
          description: "Tente novamente mais tarde",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );

  return {
    form,
    isLoading,
    isUploading,
    handleSelectAvatar,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
