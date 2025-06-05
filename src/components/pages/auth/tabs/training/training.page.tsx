import { TextAtom } from "@atom/text";
import { ScrollView } from "react-native";

export default function TrainingPage() {
  return (
    <ScrollView
      className="px-6"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 50,
      }}
    >
      <TextAtom className="text-2xl font-bold text-white mb-6">Treino</TextAtom>
    </ScrollView>
  );
}
