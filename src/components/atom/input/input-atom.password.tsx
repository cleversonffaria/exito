import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import EyeOpen from "@assets/svg/eye-open.svg";
import EyeClose from "@assets/svg/eye-close.svg";
import { colors } from "@/constants/colors";
import { InputRoot } from "./input-atom.root";
import { InputLabel } from "./input-atom.label";
import { InputField } from "./input-atom.field";
import { InputError } from "./input-atom.error";
import { NInputAtom } from "./input-atom.types";

interface PasswordControllerProps<T extends FieldValues>
  extends Omit<NInputAtom.RootProps, "error" | "children"> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  fieldProps?: Omit<NInputAtom.FieldProps, "value" | "onChangeText">;
  onSubmitEditing?: () => void;
}

export function InputPasswordController<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Senha",
  fieldProps,
  onSubmitEditing,
  ...rootProps
}: PasswordControllerProps<T>) {
  const [isVisible, setIsVisible] = useState(false);

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const EyeIcon = isVisible ? EyeOpen : EyeClose;

  return (
    <InputRoot {...rootProps} error={error?.message} label={label}>
      <InputField
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        secureTextEntry={!isVisible}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        returnKeyType="send"
        onSubmitEditing={onSubmitEditing}
        className="flex-1"
        {...fieldProps}
      />
      <TouchableOpacity
        onPress={toggleVisibility}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <EyeIcon width={20} height={20} color={colors.gray[400]} />
      </TouchableOpacity>
    </InputRoot>
  );
}
