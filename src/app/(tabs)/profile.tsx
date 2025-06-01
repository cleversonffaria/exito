import { ButtonAtom } from "@atom/button";
import { TextAtom } from "@atom/text";
import { useAuth } from "@store/useAuth";
import { router } from "expo-router";
import React from "react";
import { Alert, SafeAreaView, View } from "react-native";

export default function ProfileScreen() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-5">
        <View className="items-center mb-10">
          <TextAtom className="text-3xl font-bold text-gray-800 mb-2">
            Perfil
          </TextAtom>
          <TextAtom className="text-base text-gray-600">
            Gerencie sua conta
          </TextAtom>
        </View>

        <View className="mb-8">
          <TextAtom className="text-lg font-semibold text-gray-800 mb-4">
            Informações do Usuário
          </TextAtom>
          <View className="bg-gray-50 p-4 rounded-xl">
            <TextAtom className="text-base text-gray-800 mb-2">
              Nome: Usuário
            </TextAtom>
            <TextAtom className="text-base text-gray-800">
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
