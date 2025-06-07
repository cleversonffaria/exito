import { colors } from "@/constants/colors";
import LogoutIcon from "@assets/svg/power-fill.svg";
import { TextAtom } from "@atom/text";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useProfile } from "./profile.useCase";

export default function ProfilePage() {
  const { userInfo, profileStats, showLogoutModal } = useProfile();
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
        <View className="w-32 h-32 rounded-full bg-gym-gray-500 mb-6 overflow-hidden">
          <Image
            source={{ uri: userInfo.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <TextAtom className="text-2xl font-semibold text-gym-gray-200 mb-1">
          {userInfo.name}
        </TextAtom>

        <TextAtom className="text-sm text-gym-gray-400 mb-2">
          {userInfo.role}
        </TextAtom>

        <TextAtom className="text-sm text-gym-gray-400 mb-10">
          Início: {userInfo.startDate}
        </TextAtom>

        <View className="flex-row justify-between w-full px-4 mb-8">
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
      </View>
    </ScrollView>
  );
}
