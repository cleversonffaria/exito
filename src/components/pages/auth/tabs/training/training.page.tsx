import { TextAtom } from "@atom/text";
import { cn } from "@utils/cn";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { TrainingContent } from "./_components";
import { useTraining } from "./training.useCase";
import { colors } from "@/constants/colors";

export default function TrainingPage() {
  const {
    weekDays,
    trainings,
    isLoading,
    isRefreshing,
    handleDaySelect,
    handleExercisePress,
    handleRefresh,
  } = useTraining();

  return (
    <View className="flex-1 bg-gym-black-500">
      <View className="px-6 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          className="mb-6"
        >
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.id}
              className={cn("rounded-2xl p-6 mr-3 min-w-[80px] items-center", {
                "bg-gym-primary-500": day.isActive,
                "bg-gym-black-400": !day.isActive,
              })}
              activeOpacity={0.8}
              onPress={() => handleDaySelect(day.id)}
            >
              <TextAtom
                className={cn("text-base font-semibold", {
                  "text-gym-black-500": day.isActive,
                  "text-gym-primary-500": !day.isActive,
                })}
              >
                {day.shortName}
              </TextAtom>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        <TrainingContent
          trainings={trainings}
          isLoading={isLoading}
          onExercisePress={handleExercisePress}
        />
      </ScrollView>
    </View>
  );
}
