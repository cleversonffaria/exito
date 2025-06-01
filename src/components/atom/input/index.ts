import { InputController } from "./input-atom.controller";
import { InputError } from "./input-atom.error";
import { InputField } from "./input-atom.field";
import { InputLabel } from "./input-atom.label";
import { InputRoot } from "./input-atom.root";

export { useInputContext } from "./input-atom.context";
export type { NInputAtom } from "./input-atom.types";
export { inputVariants } from "./input-atom.variant";

export const InputAtom = {
  Root: InputRoot,
  Label: InputLabel,
  Field: InputField,
  Error: InputError,
  Controller: InputController,
};
