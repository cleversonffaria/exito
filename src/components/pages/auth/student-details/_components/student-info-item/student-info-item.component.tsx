import { cn } from "@/utils/cn";
import { TextAtom } from "@atom/text";
import { View } from "react-native";
import { NStudentInfoItem } from "./student-info-item.types";

export function StudentInfoItem({
  label,
  value,
  className,
}: NStudentInfoItem.Props) {
  return (
    <View className={cn("w-full flex-row justify-between mb-1", className)}>
      <TextAtom className="text-gym-gray-400">{label}</TextAtom>
      <TextAtom className="text-gym-gray-200">{value}</TextAtom>
    </View>
  );
}
