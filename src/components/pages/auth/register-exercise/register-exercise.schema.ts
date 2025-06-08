import { z } from "zod";

export const registerExerciseSchema = z.object({
  name: z.string().min(1, "Nome do exercício obrigatório"),
  thumbnail: z.string(),
  muscleGroups: z.array(z.string()).min(1, "Selecione pelo menos um músculo"),
  equipment: z.string().min(1, "Equipamento obrigatório"),
  videoDemo: z.string(),
});
