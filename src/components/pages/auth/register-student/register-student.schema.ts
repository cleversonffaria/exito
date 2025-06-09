import { z } from "zod";

export const registerStudentSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(1, "Telefone obrigatório"),
  age: z.string().min(1, "Idade obrigatória"),
  gender: z
    .string()
    .refine(
      (val) => val === "Masculino" || val === "Feminino" || val === "Outros",
      {
        message: "Gênero obrigatório",
      }
    ),
  goal: z.string().min(1, "Objetivo obrigatório"),
});
