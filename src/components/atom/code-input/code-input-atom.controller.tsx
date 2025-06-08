import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { CodeInputError } from "./code-input-atom.error";
import { CodeInputField } from "./code-input-atom.field";
import { CodeInputLabel } from "./code-input-atom.label";
import { CodeInputRoot } from "./code-input-atom.root";
import { NCodeInputAtom } from "./code-input-atom.types";

export function CodeInputController<T extends FieldValues>({
  control,
  name,
  label,
  cellCount = 6,
  autoFocus = true,
  onComplete,
  fieldProps,
  ...rootProps
}: NCodeInputAtom.ControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CodeInputRoot error={error?.message} {...rootProps}>
          <CodeInputLabel>{label}</CodeInputLabel>
          <CodeInputField
            value={value}
            onChangeText={onChange}
            cellCount={cellCount}
            autoFocus={autoFocus}
            onComplete={onComplete}
            {...fieldProps}
          />
          <CodeInputError />
        </CodeInputRoot>
      )}
    />
  );
}
