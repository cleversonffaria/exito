import { TextAtom } from "@atom/text";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import UserProfileIcon from "@assets/svg/user-profile.svg";
import { NStudentsPage } from "../../students.types";

interface StudentItemProps {
  student: NStudentsPage.Student;
  onPress?: () => void;
}

export function StudentItem({ student, onPress }: StudentItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 border-b border-gym-gray-700 ${
        student.isDeleted ? "opacity-60" : ""
      }`}
      activeOpacity={0.7}
    >
      <View className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gym-black-400 items-center justify-center">
        {student.avatar ? (
          <Image
            source={{ uri: student.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <UserProfileIcon width={32} height={32} />
        )}
      </View>

      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <TextAtom className="text-gym-gray-200 text-base font-medium">
              {student.name}
            </TextAtom>
          </View>
          <TextAtom className="text-gym-gray-400 text-sm">
            {student.gender}
          </TextAtom>
        </View>

        {student.isDeleted && (
          <TextAtom className="text-red-400 text-xs bg-red-900/30 px-2 py-1 rounded">
            Excluído
          </TextAtom>
        )}
      </View>
    </TouchableOpacity>
  );
}
