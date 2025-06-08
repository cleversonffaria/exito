import { router } from "expo-router";
import { useMemo } from "react";
import { NHomePage } from "./home.types";

export const useHome = () => {
  const weeklyData: NHomePage.WeeklyData[] = [
    { day: "Seg", value: 18 },
    { day: "Ter", value: 60 },
    { day: "Qua", value: 10 },
    { day: "Qui", value: 40 },
    { day: "Sex", value: 49 },
    { day: "Sab", value: 19 },
  ];

  const maxHeight = 60;

  const totalValue = useMemo(() => {
    return weeklyData.reduce((sum, item) => sum + item.value, 0);
  }, [weeklyData]);

  const weeklyDataWithHeight = useMemo(() => {
    return weeklyData.map((item) => ({
      ...item,
      height: (item.value / totalValue) * maxHeight,
    }));
  }, [weeklyData, totalValue, maxHeight]);

  const handleExercisePress = () => {
    router.push("/(auth)/(tabs)/training");
  };

  const handleTrainingPress = () => {
    router.push("/(auth)/(tabs)/training");
  };

  const user = {
    name: "John Doe",
  };

  return {
    weeklyData,
    weeklyDataWithHeight,
    totalValue,
    maxHeight,
    handleExercisePress,
    handleTrainingPress,
    user,
  };
};
