export const formatWeekDays = (weekDays: number[]): string => {
  const dayNames = {
    1: "Seg",
    2: "Ter",
    3: "Qua",
    4: "Qui",
    5: "Sex",
    6: "Sáb",
    7: "Dom",
  };

  return weekDays
    .map((day) => dayNames[day as keyof typeof dayNames])
    .join(" - ");
};
