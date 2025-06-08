import { TextAtom } from "@atom/text";
import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-4">
        <TextAtom className="text-center text-gym-gray-200">
          Esta tela não existe.
        </TextAtom>
        <Link href="/" className="mt-4">
          <TextAtom className="text-center text-gym-gray-200">
            Voltar para a tela inicial
          </TextAtom>
        </Link>
      </View>
    </>
  );
}
