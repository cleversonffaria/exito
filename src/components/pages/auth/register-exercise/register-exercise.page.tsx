import { TextAtom } from "@/components/atom/text";
import { colors } from "@/constants/colors";
import MinusIcon from "@assets/svg/minus-solid.svg";
import PlusIcon from "@assets/svg/plus-solid.svg";
import UploadIcon from "@assets/svg/upload.svg";
import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useRegisterExercise } from "./register-exercise.useCase";

export default function RegisterExercisePage() {
  const {
    form,
    isLoading,
    muscleInputs,
    handleAddMuscleInput,
    handleRemoveMuscleInput,
    handleMuscleInputChange,
    handleSubmit,
  } = useRegisterExercise();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={20}
    >
      <View className="flex-1 px-6">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View className="pt-8">
            <InputAtom.Controller
              control={form.control}
              name="name"
              label="Nome"
              placeholder="Digite o nome do exercício"
            />

            <View className="mb-4">
              <TextAtom className="text-gym-gray-200 font-semibold mb-2">
                Thumb do exercício
              </TextAtom>
              <TouchableOpacity
                className="bg-gym-black-400 rounded-xl p-4 h-14 flex-row items-center justify-between border border-gym-gray-700"
                activeOpacity={0.8}
              >
                <TextAtom className="text-gym-gray-400 ml-2">
                  Selecionar arquivo
                </TextAtom>
                <UploadIcon width={20} height={20} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <TextAtom className="text-gym-gray-200 font-semibold mb-2">
                Músculos Trabalhado
              </TextAtom>
              <View className="gap-3">
                {muscleInputs.map((muscle, index) => {
                  const lastMuscle = index === muscleInputs.length - 1;

                  return (
                    <View key={index} className="flex-row items-center gap-3">
                      <InputAtom.Root className="-mb-9 flex-1">
                        <InputAtom.Field
                          placeholder="Digite o músculo trabalhado"
                          value={muscle}
                          onChangeText={(value) =>
                            handleMuscleInputChange(index, value)
                          }
                        />
                      </InputAtom.Root>

                      <TouchableOpacity
                        className="p-1.5 bg-gym-primary-500 rounded-full"
                        activeOpacity={0.7}
                        onPress={() => {
                          if (lastMuscle) return handleAddMuscleInput();
                          handleRemoveMuscleInput(index);
                        }}
                        hitSlop={20}
                      >
                        {lastMuscle ? (
                          <PlusIcon
                            width={16}
                            height={16}
                            color={colors.black[500]}
                          />
                        ) : (
                          <MinusIcon
                            width={16}
                            height={16}
                            color={colors.black[500]}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              {form.formState.errors.muscleGroups && (
                <TextAtom className="text-gym-error-400 text-sm mt-2 ml-1">
                  {form.formState.errors.muscleGroups.message}
                </TextAtom>
              )}
            </View>

            <InputAtom.Controller
              control={form.control}
              name="equipment"
              label="Equipamento"
              placeholder="Digite o equipamento necessário"
            />

            <View className="mb-4">
              <TextAtom className="text-gym-gray-200 font-semibold mb-2">
                Vídeo de demonstração
              </TextAtom>
              <TouchableOpacity
                className="bg-gym-black-400 rounded-xl p-4 h-14 flex-row items-center justify-between border border-gym-gray-700"
                activeOpacity={0.8}
              >
                <TextAtom className="text-gym-gray-400 ml-2">
                  Selecionar arquivo
                </TextAtom>
                <UploadIcon width={20} height={20} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View className="pb-8">
          <ButtonAtom.Root
            onPress={handleSubmit}
            isLoading={isLoading}
            className="bg-gym-primary-500"
          >
            <ButtonAtom.Text className="text-black text-base font-semibold">
              Cadastrar
            </ButtonAtom.Text>
          </ButtonAtom.Root>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
