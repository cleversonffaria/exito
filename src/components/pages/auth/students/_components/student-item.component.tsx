import { TextAtom } from "@atom/text";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { NStudentsPage } from "../students.types";

interface StudentItemProps {
  student: NStudentsPage.Student;
  onPress?: () => void;
}

export function StudentItem({ student, onPress }: StudentItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-6 py-4 border-b border-gym-gray-700"
      activeOpacity={0.7}
    >
      <View className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <Image
          source={{ uri: student.avatar }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        <TextAtom className="text-gym-gray-200 text-base font-medium">
          {student.name}
        </TextAtom>
        <TextAtom className="text-gym-gray-400 text-sm">
          {student.gender}
        </TextAtom>
      </View>
    </TouchableOpacity>
  );
}
