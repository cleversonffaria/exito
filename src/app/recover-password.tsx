import { TextAtom } from "@atom/text";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function RecoverPassword() {
  const handleGoBack = () => {
    router.canGoBack() && router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextAtom>Recuperar senha</TextAtom>

      <TouchableOpacity onPress={handleGoBack} style={{ marginTop: 20 }}>
        <TextAtom>Voltar</TextAtom>
      </TouchableOpacity>
    </View>
  );
}
