import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { InputError } from "./input-atom.error";
import { InputField } from "./input-atom.field";
import { InputLabel } from "./input-atom.label";
import { InputRoot } from "./input-atom.root";
import { NInputAtom } from "./input-atom.types";

interface ControlledInputProps<T extends FieldValues>
  extends Omit<NInputAtom.RootProps, "error" | "children"> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  fieldProps?: Omit<NInputAtom.FieldProps, "value" | "onChangeText">;
}

export function InputController<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  fieldProps,
  ...rootProps
}: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputRoot error={error?.message} {...rootProps}>
          <InputLabel>{label}</InputLabel>
          <InputField
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            {...fieldProps}
          />
          <InputError />
        </InputRoot>
      )}
    />
  );
}
