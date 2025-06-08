import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { InputField } from "./input-atom.field";
import { InputRoot } from "./input-atom.root";
import { NInputAtom } from "./input-atom.types";

export function InputController<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  fieldProps,
  onSubmitEditing,
  ...rootProps
}: NInputAtom.ControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputRoot error={error?.message} {...rootProps} label={label}>
          <InputField
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            onSubmitEditing={onSubmitEditing}
            {...fieldProps}
          />
        </InputRoot>
      )}
    />
  );
}
