import { ButtonAtom } from "@atom/button";
import { TextAtom } from "@atom/text";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { useProfile } from "./profile.useCase";

export default function ProfilePage() {
  const { handleLogout } = useProfile();

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 pt-5">
        <View className="items-center mb-10">
          <TextAtom className="text-3xl font-bold text-white mb-2">
            Perfil
          </TextAtom>
          <TextAtom className="text-base text-gym-gray-400">
            Gerencie sua conta
          </TextAtom>
        </View>

        <View className="mb-8">
          <TextAtom className="text-lg font-semibold text-white mb-4">
            Informações do Usuário
          </TextAtom>
          <View className="bg-gym-gray-700 p-4 rounded-xl">
            <TextAtom className="text-base text-white mb-2">
              Nome: Usuário
            </TextAtom>
            <TextAtom className="text-base text-gym-gray-300">
              Email: usuario@example.com
            </TextAtom>
          </View>
        </View>

        <View className="mt-auto mb-10">
          <ButtonAtom.Root onPress={handleLogout} variant="error">
            <ButtonAtom.Text>Sair</ButtonAtom.Text>
          </ButtonAtom.Root>
        </View>
      </View>
    </SafeAreaView>
  );
}
