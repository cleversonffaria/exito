import { View } from "react-native";

export function ExerciseDetailsSkeleton() {
  return (
    <View className="flex-1">
      <View className="px-6 pt-6 pb-6 gap-1">
        <View
          className="mb-8 rounded-2xl bg-gym-black-400 animate-pulse"
          style={{ height: 256 }}
        />

        <View className="gap-4">
          <View className="flex-row justify-between items-center py-3 border-b border-gym-black-400">
            <View className="h-5 bg-gym-black-400 rounded w-20 animate-pulse" />
            <View className="h-5 bg-gym-black-400 rounded w-32 animate-pulse" />
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-gym-black-400">
            <View className="h-5 bg-gym-black-400 rounded w-24 animate-pulse" />
            <View className="h-5 bg-gym-black-400 rounded w-28 animate-pulse" />
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-gym-black-400">
            <View className="h-5 bg-gym-black-400 rounded w-20 animate-pulse" />
            <View className="h-5 bg-gym-black-400 rounded w-24 animate-pulse" />
          </View>

          <View className="mt-4">
            <View className="h-6 bg-gym-black-400 rounded w-40 animate-pulse mb-2" />
            <View className="h-5 bg-gym-black-400 rounded w-full animate-pulse" />
          </View>

          <View className="mt-4">
            <View className="h-6 bg-gym-black-400 rounded w-48 animate-pulse mb-2" />
            <View className="h-5 bg-gym-black-400 rounded w-full animate-pulse mb-1" />
            <View className="h-5 bg-gym-black-400 rounded w-4/5 animate-pulse mb-1" />
            <View className="h-5 bg-gym-black-400 rounded w-3/4 animate-pulse" />
          </View>
        </View>
      </View>
    </View>
  );
}
