export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type WeekDayName = "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sáb" | "Dom";

/**
 * Mapeamento de números para nomes dos dias da semana
 */
export const WEEK_DAYS_MAP: Record<WeekDay, WeekDayName> = {
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
  7: "Dom",
};

/**
 * Mapeamento de nomes para números dos dias da semana
 */
export const WEEK_DAYS_REVERSE_MAP: Record<string, WeekDay> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
  seg: 1,
  ter: 2,
  qua: 3,
  qui: 4,
  sex: 5,
  sáb: 6,
  dom: 7,
};

/**
 * Converte week_days para array de números, independente do formato de entrada
 * @param weekDays - Array que pode conter números, strings ou misturado
 * @returns Array de números representando os dias da semana (1-7)
 */
export function normalizeWeekDays(weekDays: any): WeekDay[] {
  if (!Array.isArray(weekDays)) {
    return [];
  }

  return weekDays
    .map((day: any) => {
      if (typeof day === "number") {
        return day >= 1 && day <= 7 ? day : null;
      }

      if (typeof day === "string") {
        const parsed = parseInt(day);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) {
          return parsed;
        }

        const normalized = day.toLowerCase().trim();
        return WEEK_DAYS_REVERSE_MAP[normalized] || null;
      }

      return null;
    })
    .filter((day: any): day is WeekDay => day !== null)
    .sort((a, b) => a - b);
}

/**
 * Converte array de números para nomes dos dias da semana
 * @param weekDays - Array de números (1-7)
 * @returns Array de nomes dos dias
 */
export function weekDaysToNames(weekDays: WeekDay[]): WeekDayName[] {
  return weekDays
    .filter((day) => day >= 1 && day <= 7)
    .map((day) => WEEK_DAYS_MAP[day])
    .filter(Boolean);
}

/**
 * Converte array de números para string formatada
 * @param weekDays - Array de números (1-7)
 * @param separator - Separador entre os dias (padrão: ", ")
 * @returns String formatada com os nomes dos dias
 */
export function formatWeekDays(
  weekDays: any,
  separator: string = " - "
): string {
  const normalized = normalizeWeekDays(weekDays);
  const names = weekDaysToNames(normalized);
  return names.join(separator);
}

/**
 * Verifica se um dia da semana é válido
 * @param day - Dia para verificar
 * @returns true se o dia é válido (1-7)
 */
export function isValidWeekDay(day: any): day is WeekDay {
  return typeof day === "number" && day >= 1 && day <= 7;
}
