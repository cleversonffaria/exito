import { z } from "zod";

export const firstAccessSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .toLowerCase(),
});

export type FirstAccessFormData = z.infer<typeof firstAccessSchema>;
