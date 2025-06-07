import { ButtonAtom } from "@atom/button";
import { TextAtom } from "@atom/text";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { useProfile } from "./profile.useCase";

export default function ProfilePage() {
  const { showLogoutModal } = useProfile();

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
            source={{
              uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <TextAtom className="text-2xl font-semibold text-gym-gray-200 mb-1">
          John Doe
        </TextAtom>

        <TextAtom className="text-sm text-gym-gray-400 mb-2">Aluno</TextAtom>

        <TextAtom className="text-sm text-gym-gray-400 mb-10">
          Início: 06/2024
        </TextAtom>

        <View className="flex-row justify-between w-full px-4 mb-8">
          <View className="items-center">
            <TextAtom className="text-3xl font-bold text-gym-primary-500 mb-1">
              12
            </TextAtom>
            <TextAtom className="text-sm text-gym-gray-300">Treinos</TextAtom>
          </View>

          <View className="items-center">
            <TextAtom className="text-3xl font-bold text-gym-primary-500 mb-1">
              36
            </TextAtom>
            <TextAtom className="text-sm text-gym-gray-300">
              Em progresso
            </TextAtom>
          </View>

          <View className="items-center">
            <TextAtom className="text-3xl font-bold text-gym-primary-500 mb-1">
              24
            </TextAtom>
            <TextAtom className="text-sm text-gym-gray-300">Completo</TextAtom>
          </View>
        </View>

        <View className="w-full px-0 mt-8">
          <ButtonAtom.Root onPress={showLogoutModal} className="bg-red-500">
            <ButtonAtom.Text className="text-white">Sair</ButtonAtom.Text>
          </ButtonAtom.Root>
        </View>
      </View>
    </ScrollView>
  );
}
