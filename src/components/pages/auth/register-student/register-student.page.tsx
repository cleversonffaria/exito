import { TextAtom } from "@/components/atom/text";
import { cn } from "@/utils/cn";
import { maskPhone } from "@/utils/phone-mask.utils";
import { ButtonAtom } from "@atom/button";
import { InputAtom } from "@atom/input";
import React from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useRegisterStudent } from "./register-student.useCase";

export default function RegisterStudentPage() {
  const { form, isLoading, handleSubmit } = useRegisterStudent();

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
              label="Nome completo"
              placeholder="Digite o nome completo do aluno"
            />

            <InputAtom.Controller
              control={form.control}
              name="email"
              label="E-mail"
              placeholder="Digite o e-mail do aluno"
              fieldProps={{
                keyboardType: "email-address",
                autoCapitalize: "none",
              }}
            />

            <Controller
              control={form.control}
              name="phone"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <InputAtom.Root error={error?.message} label="Telefone">
                  <InputAtom.Field
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={(text) => onChange(maskPhone(text))}
                    placeholder="Digite o telefone do aluno"
                  />
                </InputAtom.Root>
              )}
            />

            <InputAtom.Controller
              control={form.control}
              name="age"
              label="Idade"
              placeholder="Digite a idade do aluno"
              className="mb-0 flex-1"
              fieldProps={{
                keyboardType: "numeric",
                numberOfLines: 1,
              }}
            />

            <View className="flex-1 mb-4">
              <TextAtom
                className={cn("font-semibold mb-2 text-gym-gray-200", {
                  "text-gym-error-400": form.formState.errors.gender,
                })}
              >
                Gênero
              </TextAtom>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14, flexGrow: 1 }}
              >
                {["Masculino", "Feminino", "Outros"].map((gender) => {
                  const isSelected = form.watch("gender") === gender;

                  return (
                    <TouchableOpacity
                      key={gender}
                      className={cn(
                        "py-3 px-4 rounded-lg border min-w-[100px]",
                        {
                          "bg-gym-primary-500 border-gym-primary-500":
                            isSelected,
                          "bg-gym-black-400 border-gym-gray-700": !isSelected,
                          "border-gym-error-400": form.formState.errors.gender,
                        }
                      )}
                      onPress={() =>
                        form.setValue("gender", gender, {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                    >
                      <TextAtom
                        className={cn("text-center font-medium", {
                          "text-black": isSelected,
                          "text-gym-gray-300": !isSelected,
                        })}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {gender}
                      </TextAtom>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <TextAtom className="text-gym-error-400 text-sm mb-3 mt-2 ml-1">
              {form.formState.errors?.gender?.message as string}
            </TextAtom>

            <InputAtom.Controller
              control={form.control}
              name="goal"
              label="Objetivo"
              placeholder="Digite o objetivo do aluno"
            />
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
