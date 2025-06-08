import { colors } from "@/constants/colors";
import { cn } from "@/utils/cn";
import MinusIcon from "@assets/svg/minus-solid.svg";
import PlusIcon from "@assets/svg/plus-solid.svg";
import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import { TextAtom } from "@atom/text";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useStudentTraining } from "./student-training.useCase";

export default function StudentTrainingPage() {
  const {
    trainingName,
    setTrainingName,
    selectedDays,
    selectedExercises,
    isLoading,
    handleToggleDay,
    handleToggleExercise,
    handleAddExercise,
    handleRemoveExercise,
    handleSaveTraining,
  } = useStudentTraining();

  return (
    <View className="flex-1 bg-gym-black-500 px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <InputAtom.Root className="mt-4">
          <InputAtom.Field
            placeholder="Nome do treino"
            value={trainingName}
            onChangeText={setTrainingName}
            placeholderTextColor={colors.gray[400]}
          />
        </InputAtom.Root>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          className="mb-8"
        >
          {selectedDays.map((day) => (
            <TouchableOpacity
              key={day.id}
              className={cn("rounded-2xl p-6 mr-3 min-w-[80px] items-center", {
                "bg-gym-primary-500": day.isSelected,
                "bg-gym-black-400": !day.isSelected,
              })}
              activeOpacity={0.8}
              onPress={() => handleToggleDay(day.id)}
              hitSlop={20}
            >
              <TextAtom
                className={cn("font-semibold text-gym-gray-400", {
                  "text-gym-black-500": day.isSelected,
                })}
              >
                {day.name}
              </TextAtom>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex-row items-center justify-between mb-4">
          <TextAtom className="text-gym-gray-200 font-semibold text-lg">
            Exercícios
          </TextAtom>
          <TouchableOpacity
            className="p-1.5 bg-gym-primary-500 rounded-full"
            activeOpacity={0.7}
            onPress={handleAddExercise}
            hitSlop={20}
          >
            <PlusIcon width={14} height={14} color={colors.black[500]} />
          </TouchableOpacity>
        </View>

        {selectedExercises.map((exercise) => (
          <View
            key={exercise.id}
            className="w-full bg-gym-black-400 rounded-xl p-4 mb-3 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <TextAtom className="text-gym-gray-200 font-semibold text-base mb-1">
                {exercise.name}
              </TextAtom>
              <TextAtom className="text-gym-gray-400 text-sm">
                Séries - {exercise.series}
              </TextAtom>
            </View>
            <TouchableOpacity
              className="p-1.5 bg-gym-primary-500 rounded-full ml-3"
              activeOpacity={0.7}
              onPress={() => handleRemoveExercise(exercise.id)}
              hitSlop={20}
            >
              <MinusIcon width={14} height={14} color={colors.black[500]} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-gym-black-500">
        <ButtonAtom.Root
          onPress={handleSaveTraining}
          className="bg-gym-primary-500"
          disabled={isLoading}
          loading={isLoading}
        >
          <ButtonAtom.Text>Cadastrar</ButtonAtom.Text>
        </ButtonAtom.Root>
      </View>
    </View>
  );
}
