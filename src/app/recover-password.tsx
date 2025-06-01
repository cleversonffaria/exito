import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

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
      <Text>Recuperar senha</Text>

      <TouchableOpacity onPress={handleGoBack} style={{ marginTop: 20 }}>
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
