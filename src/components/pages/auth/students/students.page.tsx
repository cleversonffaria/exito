import { colors } from "@/constants/colors";
import PlusIcon from "@assets/svg/plus-solid.svg";
import SearchIcon from "@assets/svg/search.svg";

import { InputAtom } from "@atom/input";
import { TextAtom } from "@atom/text";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { StudentItem } from "./_components";
import { NStudentsPage } from "./students.types";
import { useStudents } from "./students.useCase";

export default function StudentsPage() {
  const { students, searchQuery, setSearchQuery, addNewStudent } =
    useStudents();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={addNewStudent}
          className="p-1.5 bg-gym-primary-500 rounded-full"
          activeOpacity={0.7}
          hitSlop={20}
        >
          <PlusIcon width={12} height={12} color={colors.black[500]} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, addNewStudent]);

  const renderStudent = ({ item }: { item: NStudentsPage.Student }) => (
    <StudentItem
      student={item}
      onPress={() => console.log("Ver aluno:", item.name)}
    />
  );

  return (
    <View className="flex-1 bg-gym-black-500">
      <View className="px-6 py-4">
        <InputAtom.Root>
          <InputAtom.Icon
            icon={
              <SearchIcon width={16} height={16} color={colors.gray[400]} />
            }
          />

          <InputAtom.Field
            placeholder="Procurar Aluno"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </InputAtom.Root>
      </View>

      {students.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <TextAtom className="text-gym-gray-400 text-lg">
            Nenhum aluno encontrado
          </TextAtom>
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudent}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
