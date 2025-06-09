import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";

import { ButtonAtom } from "@atom/button";
import { TextAtom } from "@atom/text";
import { NProfilePage } from "./profile.types";
import { useProfile } from "./profile.useCase";

import ExercisesIcon from "@assets/svg/exercise.svg";
import LogoutIcon from "@assets/svg/power-fill.svg";
import StudentsIcon from "@assets/svg/user-card.svg";
import UserProfileIcon from "@assets/svg/user-profile.svg";

export default function ProfilePage({}: NProfilePage.Props) {
  const {
    isTeacher,
    userInfo,
    profileStats,
    navigateToStudents,
    navigateToExercises,
    showLogoutModal,
  } = useProfile();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={showLogoutModal}
          className="p-2 mr-2"
          activeOpacity={0.7}
        >
          <LogoutIcon width={20} height={20} color={colors.error[400]} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showLogoutModal]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
    >
      <View className="items-center px-6 pt-8">
        <View className="w-32 h-32 rounded-full bg-gym-black-400 mb-6 overflow-hidden items-center justify-center">
          {userInfo.hasAvatar ? (
            <Image
              source={{ uri: userInfo.avatar! }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <UserProfileIcon width={80} height={80} color={colors.gray[300]} />
          )}
        </View>

        <TextAtom className="text-2xl font-semibold text-gym-gray-200">
          {userInfo.name}
        </TextAtom>

        <TextAtom className="text-base text-gym-gray-400">
          {userInfo.role}
        </TextAtom>

        <TextAtom className="text-base text-gym-gray-400 mb-10">
          Início: {userInfo.startDate}
        </TextAtom>

        <View className="flex-row justify-around w-full px-4 mb-8">
          {profileStats.map((stat, index) => (
            <View key={index} className="items-center">
              <TextAtom className="text-3xl font-bold text-gym-primary-500 mb-1">
                {stat.value}
              </TextAtom>
              <TextAtom className="text-sm text-gym-gray-300">
                {stat.label}
              </TextAtom>
            </View>
          ))}
        </View>

        {isTeacher && (
          <View className="w-full gap-4">
            <ButtonAtom.Root
              onPress={navigateToStudents}
              className="bg-gym-black-400 border border-gym-gray-700"
            >
              <View className="flex-row items-stretch gap-2 w-full">
                <StudentsIcon
                  width={20}
                  height={20}
                  color={colors.primary[500]}
                />
                <ButtonAtom.Text className="text-gym-gray-200 font-normal">
                  Alunos
                </ButtonAtom.Text>
              </View>
            </ButtonAtom.Root>

            <ButtonAtom.Root
              onPress={navigateToExercises}
              className="bg-gym-black-400 border border-gym-gray-700"
            >
              <View className="flex-row items-stretch gap-2 w-full">
                <ExercisesIcon
                  width={20}
                  height={20}
                  color={colors.primary[500]}
                />
                <ButtonAtom.Text className="text-gym-gray-200 font-normal">
                  Exercícios
                </ButtonAtom.Text>
              </View>
            </ButtonAtom.Root>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
