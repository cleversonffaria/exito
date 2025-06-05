import { TextAtom } from "@atom/text";
import { ScrollView } from "react-native";

export default function HomePage() {
  return (
    <ScrollView className="flex-1 p-6">
      <TextAtom className="text-2xl font-bold text-white mb-6">
        Dashboard
      </TextAtom>
    </ScrollView>
  );
}
