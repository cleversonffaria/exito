import { colors } from "@/constants/colors";
import MinusIcon from "@assets/svg/minus-solid.svg";
import PlusIcon from "@assets/svg/plus-solid.svg";
import UserProfileIcon from "@assets/svg/user-profile.svg";
import { TextAtom } from "@atom/text";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { StudentInfoItem } from "./_components";
import { useStudentDetails } from "./student-details.useCase";

export default function StudentDetailsPage() {
  const { student, isLoading, handleAddTraining, handleRemoveTraining } =
    useStudentDetails();

  if (isLoading || !student) {
    return (
      <View className="flex-1 bg-gym-black-500 items-center justify-center">
        <TextAtom className="text-gym-gray-400 text-lg">
          {isLoading ? "Carregando..." : "Aluno não encontrado"}
        </TextAtom>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gym-black-500">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center px-6 gap-1 mt-4">
          <View className="flex-row items-center justify-between w-full gap-4 mb-2">
            <View className="w-16 h-16 rounded-full bg-gym-black-400 mb-4 overflow-hidden items-center justify-center">
              {student.avatar ? (
                <Image
                  source={{ uri: student.avatar }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <UserProfileIcon width={50} height={50} />
              )}
            </View>
            <View className="flex-row flex-1 justify-between items-center mb-2">
              <View>
                <TextAtom className="text-lg font-semibold text-gym-gray-200">
                  {student.name}
                </TextAtom>
                <TextAtom className="text-gym-gray-400">
                  {student.role}
                </TextAtom>
              </View>
              <TextAtom className="text-gym-gray-400 self-end">
                Início: {student.startDate}
              </TextAtom>
            </View>
          </View>

          <StudentInfoItem label="E-mail" value={student.email} />
          <StudentInfoItem label="Telefone" value={student.phone} />
          <StudentInfoItem label="Idade" value={student.age} />
          <StudentInfoItem label="Sexo" value={student.gender} />
          <StudentInfoItem
            label="Objetivo"
            value={student.goal}
            className="mb-3"
          />

          <View className="w-full flex-row items-center justify-between mb-4 mt-2">
            <TextAtom className="text-gym-gray-200 font-semibold">
              Treinos
            </TextAtom>
            <TouchableOpacity
              className="p-1.5 bg-gym-primary-500 rounded-full"
              activeOpacity={0.7}
              onPress={handleAddTraining}
              hitSlop={20}
            >
              <PlusIcon width={14} height={14} color={colors.black[500]} />
            </TouchableOpacity>
          </View>

          {student.trainings.map((training) => (
            <View
              key={training.id}
              className="w-full bg-gym-black-400 rounded-xl p-6 mb-3 flex-row items-center justify-between"
            >
              <View>
                <TextAtom className="text-gym-gray-200 font-bold text-lg mb-1">
                  {training.name}
                </TextAtom>
                <TextAtom className="text-gym-gray-400">
                  {training.days}
                </TextAtom>
              </View>
              <TouchableOpacity
                className="p-1.5 bg-gym-primary-500 rounded-full"
                activeOpacity={0.7}
                onPress={() => handleRemoveTraining(training.id)}
                hitSlop={20}
              >
                <MinusIcon width={14} height={14} color={colors.black[500]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
