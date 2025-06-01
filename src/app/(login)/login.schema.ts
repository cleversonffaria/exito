import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
