import { z } from "zod";

export const registerTrainingSchema = z.object({
  exercise: z.object({
    name: z.string().min(1, "Nome do exercício obrigatório"),
    category: z.string().min(1, "Categoria do exercício obrigatória"),
  }),
  series: z.string().min(1, "Séries obrigatórias"),
  repetitions: z.string().min(1, "Repetições obrigatórias"),
  load: z.string().min(1, "Carga obrigatória"),
  restTime: z.string().min(1, "Descanso obrigatório"),
  observations: z.string(),
});
