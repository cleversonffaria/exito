import { z } from "zod";

const fileSchema = z
  .object({
    uri: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number().optional(),
  })
  .nullable();

export const registerExerciseSchema = z.object({
  name: z.string().min(1, "Nome do exercício obrigatório"),
  thumbnail: fileSchema,
  muscleGroups: z.array(z.string()).min(1, "Selecione pelo menos um músculo"),
  equipment: z.string().min(1, "Equipamento obrigatório"),
  videoDemo: fileSchema,
});
