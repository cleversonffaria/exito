import { colors } from "@/constants/colors";
import ArrowLeftIcon from "@assets/svg/arrow-left.svg";
import PlayBrokenIcon from "@assets/svg/play-broken.svg";
import { TextAtom } from "@atom/text";
import { cn } from "@utils/cn";
import {
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useHome } from "./home.useCase";

export default function HomePage() {
  const {
    user,
    weeklyDataWithHeight,
    totalValue,
    maxHeight,
    handleExercisePress,
    handleTrainingPress,
    isLoading,
    isRefreshing,
    handleRefresh,
  } = useHome();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary[500]}
          colors={[colors.primary[500]]}
        />
      }
    >
      <View className="px-6 pb-8 mt-2">
        <TextAtom className="text-gym-gray-400 text-base mb-1 text-center">
          Bem Vindo de Volta
        </TextAtom>
        <View className="flex-row items-center justify-center">
          <TextAtom className="text-white text-2xl text-center">Olá, </TextAtom>
          <TextAtom className="text-white text-2xl font-bold text-center">
            {user?.name || "Usuário"}
          </TextAtom>
        </View>
      </View>

      <View className="mx-6 mb-6">
        <TouchableOpacity
          className="bg-gym-black-400 rounded-2xl p-6 flex-row items-center justify-between"
          activeOpacity={0.8}
          onPress={handleExercisePress}
        >
          <View className="flex-1">
            <TextAtom className="text-gym-primary-500 text-xl font-bold mb-2">
              Exercício do Dia
            </TextAtom>
            <TextAtom className="text-gym-gray-300 text-base">
              Recupere seu corpo saudável
            </TextAtom>
          </View>
          <View className="rounded-full p-4">
            <PlayBrokenIcon
              width={24}
              height={24}
              color={colors.primary[500]}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View className="mx-6 mb-6">
        <View className="bg-gym-black-400 rounded-2xl p-6 flex flex-row items-end justify-between">
          <View className="flex-col">
            <TextAtom className="text-white text-xl font-semibold mb-4">
              Treinos
            </TextAtom>

            <View>
              <TextAtom className="text-gym-primary-500 text-4xl font-bold">
                {isLoading ? "..." : String(totalValue)}
              </TextAtom>
              <TextAtom className="text-gym-gray-400 text-sm">
                Total da Semana
              </TextAtom>
            </View>
          </View>

          <View className="flex-row items-end">
            {weeklyDataWithHeight.map((item, index) => (
              <View
                key={index}
                className={cn("items-center", {
                  "ml-2": index > 0,
                })}
              >
                <View
                  className="bg-gym-black-600 rounded-sm w-3 mb-2 relative"
                  style={{ height: maxHeight }}
                >
                  <View
                    className="bg-gym-primary-500 rounded-sm w-3 absolute bottom-0"
                    style={{ height: item.height }}
                  />
                </View>
                <TextAtom className="text-gym-gray-500 text-xs">
                  {item.day}
                </TextAtom>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mx-6">
        <TouchableOpacity
          className="bg-gym-black-400 rounded-2xl relative overflow-visible"
          activeOpacity={0.8}
          onPress={handleTrainingPress}
        >
          <View className="p-6 flex-row items-center">
            <View className="flex-1 justify-center pr-4">
              <TextAtom className="text-gym-gray-300 text-lg font-semibold mb-4 leading-6">
                Transforme sua rotina com treinos sob medida.
              </TextAtom>

              <View className="flex-row items-center mt-2">
                <TextAtom className="text-gym-gray-300 text-base font-medium mr-2">
                  Acompanhar Treino
                </TextAtom>

                <View className="rotate-180">
                  <ArrowLeftIcon
                    width={12}
                    height={12}
                    color={colors.gray[300]}
                  />
                </View>
              </View>
            </View>

            <View className="w-20 h-20" />

            <View className="absolute -right-4 -top-4 w-44 h-40 z-10">
              <Image
                source={require("@assets/images/athlete-female.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
