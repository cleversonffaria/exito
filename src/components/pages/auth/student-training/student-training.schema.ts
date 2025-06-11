import { z } from "zod";

export const studentTrainingSchema = z.object({
  name: z.string().min(1, "Nome do treino é obrigatório"),
  selectedDays: z
    .array(z.number())
    .min(1, "Selecione pelo menos um dia da semana"),
  exercises: z
    .array(
      z.object({
        id: z.string(),
        exerciseId: z.string(),
        name: z.string(),
        category: z.string(),
        series: z.number().min(1, "Séries deve ser maior que 0"),
        repetitions: z.number().min(1, "Repetições deve ser maior que 0"),
        load: z.number().min(0, "Carga deve ser maior ou igual a 0"),
        restTime: z
          .number()
          .min(0, "Tempo de descanso deve ser maior ou igual a 0"),
        observations: z.string().optional(),
        orderIndex: z.number(),
      })
    )
    .min(1, "Adicione pelo menos um exercício"),
});
